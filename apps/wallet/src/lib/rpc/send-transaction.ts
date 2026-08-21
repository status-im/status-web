import { ProviderRpcError } from '@status-im/ethereum-provider'

import { getChainIdForOrigin, isSameAddress } from '../../data/dapp-permissions'
import { requestFeeRate } from '../gas-fees'
import {
  buildAndSendTransaction,
  maxFeeEth,
  resolveFeeParams,
  type TransactionRequest,
  type TransactionSenders,
} from '../send-transaction'
import { requireOriginAddress, requireWalletFor } from './account'
import { assertNoPendingApproval, requestApproval } from './request-approval'

import type { createAPI } from '../../data/api'
import type { RpcContext } from './context'
import type { Address, Hex } from 'viem'

/**
 * Signing is fenced to mainnet at the backend, not just here:
 * `nodes.getFeeRate` / `broadcastTransaction` / `getNonce` all pin
 * `z.enum(['ethereum'])`, and `api.ts` hardcodes `chainID: '01'`. Lifting the
 * fence is a backend change, so a dApp on another chain is told why rather
 * than served a mainnet transaction it did not ask for.
 */
const SIGNABLE_CHAIN_ID = '0x1'

type DappTransaction = {
  from?: string
  to?: string
  value?: string
  data?: string
  input?: string
  gas?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  nonce?: string
  gasPrice?: string
  accessList?: unknown
}

/**
 * Fields the send path cannot honor, refused rather than dropped: a dropped
 * field changes what the transaction does, and the popup would still show the
 * request the dApp made. `nonceTracker` assigns its own nonce, so a resubmit
 * meant to replace or cancel a pending transaction would broadcast as a second
 * spend at the next nonce instead. `gasPrice` has no route to the backend,
 * which takes only the EIP-1559 pair, so it would be silently replaced by our
 * own estimate. `type` is not listed: every transaction we sign is Enveloped,
 * so a dApp asking for `0x2` is describing what it already gets.
 */
const UNSUPPORTED_FIELDS: Record<string, string> = {
  nonce: 'nonce is not supported; the wallet assigns the nonce',
  gasPrice:
    'gasPrice is not supported; use maxFeePerGas and maxPriorityFeePerGas',
}

function invalidParams(message: string): ProviderRpcError {
  return new ProviderRpcError({ code: -32602, message })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const ADDRESS_PATTERN = /^0x[0-9a-fA-F]{40}$/

/**
 * A field the dApp did not send stays `undefined` so the fee policy can tell
 * "omitted" from "zero" -- the two mean different things there.
 *
 * The `0x` prefix is required, as `hexutil.Big` requires it in status-go's
 * `send_transaction.go`. A bare `'64'` is ambiguous between decimal and hex,
 * and guessing wrong on `value` sends the wrong amount.
 */
function parseQuantity(value: unknown, field: string): bigint | undefined {
  if (value === undefined || value === null || value === '') return undefined
  if (typeof value === 'number' || typeof value === 'bigint') {
    return BigInt(value)
  }
  if (typeof value !== 'string' || !/^0x[0-9a-fA-F]+$/.test(value)) {
    throw invalidParams(`${field} is not a hex quantity`)
  }
  return BigInt(value)
}

/**
 * `'0x'` is what dApps send for "no calldata", and it is truthy. Left as-is it
 * would route a plain transfer through `sendContractCall`.
 */
function parseCalldata(value: unknown): Hex | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value !== 'string') {
    throw invalidParams('data is not a hex string')
  }
  if (value === '' || value === '0x') return undefined
  if (!/^0x([0-9a-fA-F]{2})+$/.test(value)) {
    throw invalidParams('data is not a hex string')
  }
  return value as Hex
}

function assertSupportedFields(request: DappTransaction): void {
  for (const [field, message] of Object.entries(UNSUPPORTED_FIELDS)) {
    const value = request[field as keyof DappTransaction]
    if (value !== undefined && value !== null) {
      throw invalidParams(message)
    }
  }

  // An empty list is what a dApp defaulting the field sends, and dropping it
  // changes nothing.
  if (Array.isArray(request.accessList) && request.accessList.length > 0) {
    throw invalidParams('accessList is not supported')
  }
}

/**
 * geth accepts `input` as an alias for `data` and some libraries send only it.
 * Reading `data` alone would turn a contract call into a bare transfer to the
 * contract. Two values that disagree is geth's error case, not a precedence
 * rule -- there is no way to tell which one the dApp meant.
 */
function selectCalldata(request: DappTransaction): unknown {
  const { data, input } = request
  if (data === undefined || input === undefined) return data ?? input
  if (
    typeof data === 'string' &&
    typeof input === 'string' &&
    data.toLowerCase() === input.toLowerCase()
  ) {
    return data
  }
  throw invalidParams('data and input are both set and disagree')
}

/**
 * Typed against the real caller rather than a hand-written shape, so a change
 * to a send procedure's input schema breaks the build instead of failing
 * inside the worker after the user has already approved.
 */
function sendingApi(): TransactionSenders {
  const api = (
    globalThis as unknown as { api: Awaited<ReturnType<typeof createAPI>> }
  ).api
  return api.wallet.account.ethereum
}

export async function eth_sendTransaction({
  params,
  origin,
  metadata,
}: RpcContext): Promise<string> {
  const chainId = await getChainIdForOrigin(origin)
  if (chainId !== SIGNABLE_CHAIN_ID) {
    throw new ProviderRpcError({
      code: 4200,
      message: `Transactions can only be sent on Ethereum mainnet. This dApp is connected to chain ${parseInt(chainId, 16)}.`,
    })
  }

  const p = Array.isArray(params) ? params : []
  if (!isRecord(p[0])) {
    throw invalidParams('eth_sendTransaction expects a transaction object')
  }
  const request = p[0] as DappTransaction

  assertSupportedFields(request)

  if (!request.to) {
    // status-go has the same gap: `broadcastTransaction` is the only route out
    // and it carries no deployment path.
    throw new ProviderRpcError({
      code: 4200,
      message: 'Contract deployment is not supported',
    })
  }

  if (!ADDRESS_PATTERN.test(request.to)) {
    throw invalidParams(`to ${request.to} is not an address`)
  }

  const signerAddress = await requireOriginAddress(origin)
  if (request.from && !isSameAddress(signerAddress, request.from)) {
    // status-go: `from parameter address is not dApp's shared account`.
    throw invalidParams(
      `from parameter address ${request.from} is not the dApp's shared account`,
    )
  }

  const signer = await requireWalletFor(signerAddress)
  await assertNoPendingApproval()

  const tx: TransactionRequest = {
    to: request.to as Address,
    // Omitted on `approve`, `transfer`, and every other non-payable call.
    // `nodes.getFeeRate` requires it, so default it as `send_transaction.go`
    // does rather than letting zod reject server-side.
    value: parseQuantity(request.value, 'value') ?? 0n,
    data: parseCalldata(selectCalldata(request)),
    gas: parseQuantity(request.gas, 'gas'),
    maxFeePerGas: parseQuantity(request.maxFeePerGas, 'maxFeePerGas'),
    maxPriorityFeePerGas: parseQuantity(
      request.maxPriorityFeePerGas,
      'maxPriorityFeePerGas',
    ),
  }

  // Priced before the popup so it can show the fee, and the resolved values are
  // fed back into the send below: estimating again there would broadcast at a
  // price the user never saw. Run even when the dApp priced the transaction
  // itself, because this is also where a reverting call is caught.
  let fees
  try {
    fees = await requestFeeRate({
      from: signerAddress,
      to: tx.to,
      value: tx.value.toString(16),
      data: tx.data,
    })
  } catch (error) {
    // A reverting call fails here. Surfacing the reason beats an empty popup
    // followed by an opaque failure.
    throw new ProviderRpcError({
      code: -32603,
      message: `Could not estimate the transaction: ${error instanceof Error ? error.message : String(error)}`,
    })
  }

  const feeParams = resolveFeeParams(tx, fees)

  const result = await requestApproval({
    type: 'eth_sendTransaction',
    origin,
    title: metadata?.title ?? origin,
    favicon: metadata?.favicon ?? `${origin}/favicon.ico`,
    address: signerAddress,
    accountName: signer.accountName,
    chainId,
    to: tx.to,
    value: `0x${tx.value.toString(16)}`,
    data: tx.data ?? null,
    maxFeeEth: maxFeeEth(feeParams),
  })

  if (!result) {
    throw new ProviderRpcError({
      code: 4001,
      message: 'User rejected the request.',
    })
  }

  const ethereum = sendingApi()
  try {
    return await buildAndSendTransaction(
      {
        ...tx,
        gas: BigInt(feeParams.gasLimit),
        maxFeePerGas: BigInt(feeParams.maxFeePerGas),
        maxPriorityFeePerGas: BigInt(feeParams.maxPriorityFeePerGas),
      },
      {
        walletId: signer.walletId,
        address: signerAddress as Address,
        // Every fee field is pinned above, so the policy short-circuits and
        // this is not reached. Serving the estimate the user was shown, rather
        // than fetching a fresh one, is the point of resolving it early.
        fetchGasFees: async () => fees,
      },
      ethereum,
    )
  } catch (error) {
    throw new ProviderRpcError({
      code: -32603,
      message: error instanceof Error ? error.message : String(error),
    })
  }
}
