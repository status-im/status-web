import { formatEther, Interface, isAddress } from 'ethers'
import * as z from 'zod'

export type GasFees = {
  feeEth: number
  feeEur: number
  maxFeeEth: number
  maxFeeEur: number
  confirmationTime: string
  txParams: {
    gasLimit: string
    maxFeePerGas: string
    maxPriorityFeePerGas: string
  }
}

const erc721 = new Interface([
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
])

const erc1155 = new Interface([
  'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)',
])

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const tryBigInt = (val: string): bigint | null => {
  try {
    return BigInt(val)
  } catch {
    return null
  }
}

const parseTokenId = (tokenId: string): bigint => {
  try {
    return BigInt(tokenId)
  } catch {
    throw new Error(`Invalid token id: ${tokenId}`)
  }
}

const getErrorMessage = (error: unknown): string | null => {
  if (!error) return null
  if (typeof error === 'string') return error
  if (
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message
  }
  return null
}

export const createNftSendSchema = (params: {
  fromAddress: string
  isErc1155: boolean
  balance?: bigint
}) => {
  const { fromAddress, isErc1155, balance } = params

  return z.object({
    to: z
      .string()
      .min(1, 'Recipient address is required')
      .refine(val => isAddress(val), 'The address is not valid')
      .refine(
        val => val.toLowerCase() !== ZERO_ADDRESS,
        "Can't send to the zero address",
      )
      .refine(
        val => val.toLowerCase() !== fromAddress.toLowerCase(),
        "Can't send to the sender address",
      ),
    amount: z
      .string()
      .refine(
        val => !isErc1155 || !val.includes('.'),
        "Can't send fraction of collectible",
      )
      .refine(
        val => !isErc1155 || /^\d+$/.test(val),
        'Amount must be a positive integer',
      )
      .refine(val => {
        if (!isErc1155) return true
        const big = tryBigInt(val)
        return big !== null && big > 0n
      }, 'Amount must be greater than 0')
      .refine(val => {
        if (!isErc1155 || balance === undefined) return true
        const big = tryBigInt(val)
        return big !== null && big <= balance
      }, 'More than available balance'),
  })
}

export function encodeNftTransfer(params: {
  standard: string
  from: string
  to: string
  tokenId: string
  amount?: string
}): string {
  const id = parseTokenId(params.tokenId)

  if (params.standard === 'ERC1155') {
    return erc1155.encodeFunctionData('safeTransferFrom', [
      params.from,
      params.to,
      id,
      BigInt(params.amount ?? '1'),
      '0x',
    ])
  }

  if (params.standard === 'ERC721') {
    return erc721.encodeFunctionData('safeTransferFrom', [
      params.from,
      params.to,
      id,
    ])
  }

  throw new Error(`Unsupported NFT standard: ${params.standard}`)
}

export const isSupportedNftStandard = (standard: string) =>
  ['ERC721', 'ERC1155'].includes(standard)

export function extractTxHash(id: unknown): string | undefined {
  if (typeof id === 'string') return id
  if (id && typeof id === 'object') {
    const obj = id as Record<string, unknown>
    if ('result' in obj && typeof obj['result'] === 'string')
      return obj['result']
    if ('txid' in obj) return obj['txid'] as string
  }
  return undefined
}

export type NftSendErrorCode =
  | 'insufficient_funds'
  | 'user_rejected'
  | 'not_approved'
  | 'erc1155_insufficient_balance'
  | 'execution_reverted'
  | 'tx_hash_missing'
  | 'wallet_locked'
  | 'unknown'

export type NftSendError = {
  code: NftSendErrorCode
  message: string
  data?: { haveWei: bigint; wantWei: bigint }
}

const insufficientFundsPattern =
  /insufficient funds[^:]*:\s*have\s+(\d+)\s+want\s+(\d+)/i

export const classifyNftSendError = (error: unknown): NftSendError => {
  const message = getErrorMessage(error)

  if (!message) {
    return { code: 'unknown', message: 'Failed to send NFT' }
  }

  const match = message.match(insufficientFundsPattern)
  if (match) {
    const haveWei = BigInt(match[1])
    const wantWei = BigInt(match[2])
    return {
      code: 'insufficient_funds',
      message: `Not enough ETH for gas. Have ${formatEther(haveWei)} ETH, need up to ${formatEther(wantWei)} ETH. Short ${formatEther(wantWei - haveWei)} ETH.`,
      data: { haveWei, wantWei },
    }
  }

  if (/insufficient funds/i.test(message)) {
    return {
      code: 'insufficient_funds',
      message: 'Not enough ETH to pay for gas.',
    }
  }

  if (/user rejected|user denied|rejected request|cancelled/i.test(message)) {
    return { code: 'user_rejected', message: 'Transaction was cancelled.' }
  }

  if (/not owner nor approved|caller is not token owner/i.test(message)) {
    return {
      code: 'not_approved',
      message: 'This wallet is not allowed to transfer this NFT.',
    }
  }

  if (/insufficient balance for transfer/i.test(message)) {
    return {
      code: 'erc1155_insufficient_balance',
      message: 'Not enough balance to transfer this ERC1155 NFT.',
    }
  }

  if (/execution reverted/i.test(message)) {
    return {
      code: 'execution_reverted',
      message: 'The NFT contract rejected this transfer.',
    }
  }

  if (/transaction hash not found/i.test(message)) {
    return {
      code: 'tx_hash_missing',
      message: 'The node did not return a transaction hash.',
    }
  }

  if (/wallet not unlocked/i.test(message)) {
    return {
      code: 'wallet_locked',
      message: 'Wallet is locked. Unlock it and try again.',
    }
  }

  return { code: 'unknown', message: 'Failed to send NFT' }
}

export const getNftSendErrorMessage = (error: unknown): string =>
  classifyNftSendError(error).message
