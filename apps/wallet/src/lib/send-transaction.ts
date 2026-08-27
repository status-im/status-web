import {
  getTransactionHash,
  isEthereumTransactionHash,
} from '@status-im/wallet/utils'
import { formatEther } from 'viem/utils'

import type { GasFeeRequestParams, GasFees } from './gas-fees'
import type { Address, Hex } from 'viem'

const ERC20_TRANSFER_SIGNATURE = '0xa9059cbb'
/** `0x` + selector + 32-byte recipient word + 32-byte amount word. */
const ERC20_TRANSFER_CALLDATA_LENGTH = 2 + 8 + 64 + 64

export type TransactionRequest = {
  to: Address
  value: bigint
  data?: Hex
  gas?: bigint
  maxFeePerGas?: bigint
  maxPriorityFeePerGas?: bigint
}

export type FeeParams = {
  gasLimit: string
  maxFeePerGas: string
  maxPriorityFeePerGas: string
}

/** The `{ id: { txid } }` envelope every `wallet.account.ethereum.send*` returns. */
type SendResult = {
  id: { txid?: { error?: unknown } | string | null }
}

type SendInput = {
  walletId: string
  fromAddress: string
  toAddress: string
  gasLimit: string
  maxFeePerGas: string
  maxInclusionFeePerGas: string
}

/**
 * The three transports, injected rather than imported: the extension page holds
 * a tRPC proxy client and the service worker holds a caller, and both must
 * reach the identical policy above.
 */
export type TransactionSenders = {
  send: (input: SendInput & { amount: string }) => Promise<SendResult>
  sendErc20: (input: SendInput & { data: string }) => Promise<SendResult>
  sendContractCall: (
    input: SendInput & { data: string; value?: string },
  ) => Promise<SendResult>
}

export type TransactionContext = {
  walletId: string
  address: Address
  fetchGasFees: (params: GasFeeRequestParams) => Promise<GasFees>
}

const toHex = (value: bigint) => `0x${value.toString(16)}`

/** Whether any fee field is missing and an estimate has to be fetched. */
export function needsFeeEstimate(tx: TransactionRequest): boolean {
  return !tx.maxFeePerGas || tx.maxPriorityFeePerGas === undefined || !tx.gas
}

/**
 * Fee policy: transactions created by the wallet itself carry no fee fields and
 * are priced entirely by the internal estimator. External callers (e.g. the
 * LiFi widget for swaps) are trusted for every field they provide -- only
 * genuinely missing pieces are filled in.
 *
 * Pure, so a caller that has to show the fee before sending (the dApp approval
 * popup) can resolve it once and hand the result back as a fully specified
 * transaction, instead of estimating twice and displaying a price other than
 * the one it broadcasts.
 */
export function resolveFeeParams(
  tx: TransactionRequest,
  fees: GasFees | null,
): FeeParams {
  let maxFeePerGas = tx.maxFeePerGas ? toHex(tx.maxFeePerGas) : undefined
  let maxPriorityFeePerGas =
    tx.maxPriorityFeePerGas !== undefined
      ? toHex(tx.maxPriorityFeePerGas)
      : undefined
  let gasLimit = tx.gas ? toHex(tx.gas) : undefined

  if (fees) {
    if (!maxFeePerGas && tx.maxPriorityFeePerGas !== undefined) {
      // LiFi quotes carry a quote-time maxPriorityFeePerGas but the SDK
      // strips maxFeePerGas, leaving the ceiling to the wallet. Building
      // it from our own estimate alone can undercut the quoted priority
      // (invalid EIP-1559 tx, rejected at broadcast), so honor the quoted
      // priority and add the estimator's base-fee headroom on top
      // (its maxFeePerGas = BASE_FEE_MULTIPLIER*baseFee + own priority).
      const baseFeeHeadroom =
        BigInt(fees.txParams.maxFeePerGas) -
        BigInt(fees.txParams.maxPriorityFeePerGas)
      maxFeePerGas = toHex(baseFeeHeadroom + tx.maxPriorityFeePerGas)
    }

    maxFeePerGas ??= fees.txParams.maxFeePerGas
    maxPriorityFeePerGas ??= fees.txParams.maxPriorityFeePerGas
    gasLimit ??= fees.txParams.gasLimit
  }

  if (!maxFeePerGas || !maxPriorityFeePerGas || !gasLimit) {
    throw new Error('Gas fees not available')
  }

  // EIP-1559 invariant: a tip above the fee ceiling is rejected by nodes.
  // Only reachable when the caller pinned maxFeePerGas but left the
  // priority fee to the (potentially higher) internal estimate.
  if (BigInt(maxPriorityFeePerGas) > BigInt(maxFeePerGas)) {
    maxPriorityFeePerGas = maxFeePerGas
  }

  return { gasLimit, maxFeePerGas, maxPriorityFeePerGas }
}

/** The ceiling the account must be able to cover, for display before signing. */
export function maxFeeEth(fees: FeeParams): string {
  return formatEther(BigInt(fees.maxFeePerGas) * BigInt(fees.gasLimit))
}

export function parseInsufficientFundsError(error: unknown): Error | null {
  const errorObj =
    typeof error === 'object' && error !== null && 'message' in error
      ? error
      : null
  const errorMessage =
    errorObj && typeof errorObj.message === 'string'
      ? errorObj.message
      : typeof error === 'string'
        ? error
        : null
  if (!errorMessage) return null
  const match = errorMessage.match(
    /insufficient funds for gas \* price \+ value: have (\d+) want (\d+)/,
  )
  if (!match) return null
  const haveWei = BigInt(match[1])
  const wantWei = BigInt(match[2])
  const haveEth = formatEther(haveWei)
  const wantEth = formatEther(wantWei)
  const shortfallEth = formatEther(wantWei - haveWei)
  return new Error(
    `Insufficient funds for gas. Have ${haveEth} ETH, need up to ${wantEth} ETH (max fee). Short ${shortfallEth} ETH.`,
  )
}

function handleTransactionError(error: unknown, context: string): never {
  console.error(`${context} error:`, error)
  const parsedError = parseInsufficientFundsError(error)
  if (parsedError) throw parsedError
  throw new Error(
    typeof error === 'object' && error !== null && 'message' in error
      ? String(error.message)
      : String(error),
  )
}

/**
 * A failed broadcast rejects rather than resolving error-shaped, so the throw
 * is where the node's reason arrives and has to be translated.
 */
async function sendOrThrow(
  send: () => Promise<SendResult>,
  context: string,
): Promise<Hex> {
  let result: SendResult
  try {
    result = await send()
  } catch (error) {
    handleTransactionError(error, context)
  }
  return requireHash(result, context)
}

function requireHash(result: SendResult, context: string): Hex {
  const txid = result.id.txid
  if (txid && typeof txid === 'object' && txid.error) {
    handleTransactionError(txid.error, context)
  }

  const txHash = getTransactionHash(txid)
  if (!isEthereumTransactionHash(txHash)) {
    throw new Error('Transaction failed')
  }
  return txHash as Hex
}

/**
 * `sendErc20` does not sign the calldata it is handed: it reads the recipient
 * and amount back out of it and re-encodes an `erc20Transfer`, a shape that
 * carries no ETH value. Anything the re-encoding would not reproduce -- bytes
 * past the amount word, a non-zero value, a recipient word with dirty padding
 * -- would be dropped after the user had already approved it, so only a
 * transfer that survives the round trip byte-for-byte takes that route. The
 * rest go through `sendContractCall`, which signs the calldata verbatim.
 */
function isCanonicalErc20Transfer(data: Hex, value: bigint): boolean {
  return (
    value === 0n &&
    data.length === ERC20_TRANSFER_CALLDATA_LENGTH &&
    data.toLowerCase().startsWith(ERC20_TRANSFER_SIGNATURE) &&
    data.slice(10, 34) === '0'.repeat(24)
  )
}

/**
 * Prices, signs and broadcasts a transaction. Unlocking is the caller's job:
 * the extension page prompts through the password modal, the dApp path through
 * the approval popup.
 */
export async function buildAndSendTransaction(
  tx: TransactionRequest,
  ctx: TransactionContext,
  senders: TransactionSenders,
): Promise<Hex> {
  const fees = needsFeeEstimate(tx)
    ? await ctx.fetchGasFees({
        from: ctx.address,
        to: tx.to,
        value: tx.value.toString(16),
        data: tx.data,
      })
    : null

  const { gasLimit, maxFeePerGas, maxPriorityFeePerGas } = resolveFeeParams(
    tx,
    fees,
  )

  const common = {
    walletId: ctx.walletId,
    fromAddress: ctx.address,
    toAddress: tx.to,
    gasLimit,
    maxFeePerGas,
    maxInclusionFeePerGas: maxPriorityFeePerGas,
  }

  if (tx.data) {
    if (isCanonicalErc20Transfer(tx.data, tx.value)) {
      return sendOrThrow(
        () => senders.sendErc20({ ...common, data: tx.data as Hex }),
        'ERC20 transfer',
      )
    }

    return sendOrThrow(
      () =>
        senders.sendContractCall({
          ...common,
          data: tx.data as Hex,
          value: tx.value.toString(16),
        }),
      'Contract call',
    )
  }

  return sendOrThrow(
    () => senders.send({ ...common, amount: tx.value.toString(16) }),
    'Send transaction',
  )
}
