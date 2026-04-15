import { Interface } from 'ethers'
import { isAddress } from 'viem'
import { formatEther } from 'viem/utils'

import {
  fetchTrpcData,
  type GasFees,
} from '../../assets/-components/token-helpers'

import type { NetworkType } from '@status-im/wallet/data'

const erc721 = new Interface([
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
])

const erc1155 = new Interface([
  'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)',
  'function balanceOf(address account, uint256 id) view returns (uint256)',
])

const NETWORK_TO_CHAIN_ID: Record<string, number> = {
  ethereum: 1,
}

const parseTokenId = (tokenId: string): bigint => {
  try {
    return BigInt(tokenId)
  } catch {
    throw new Error(`Invalid token id: ${tokenId}`)
  }
}

export const isValidAddress = (address: string) =>
  isAddress(address, { strict: true })

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export type AddressValidation =
  | { kind: 'empty' }
  | { kind: 'invalid' }
  | { kind: 'zero' }
  | { kind: 'self' }
  | { kind: 'ok' }

export const validateRecipient = (
  recipient: string,
  sender: string,
): AddressValidation => {
  if (!recipient) return { kind: 'empty' }
  if (!isValidAddress(recipient)) return { kind: 'invalid' }
  if (recipient.toLowerCase() === ZERO_ADDRESS) return { kind: 'zero' }
  if (recipient.toLowerCase() === sender.toLowerCase()) return { kind: 'self' }
  return { kind: 'ok' }
}

export const isSupportedNftStandard = (standard: string) =>
  ['ERC721', 'ERC1155'].includes(standard)

export const extractTxHash = (id: unknown): string | undefined => {
  if (typeof id === 'string') {
    return id
  }

  if (id && typeof id === 'object') {
    const obj = id as Record<string, unknown>

    if ('result' in obj && typeof obj.result === 'string') {
      return obj.result
    }

    if ('txid' in obj && typeof obj.txid === 'string') {
      return obj.txid
    }
  }

  return undefined
}

const getErrorMessage = (error: unknown): string | null => {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof error.message === 'string') {
      return error.message
    }

    if ('error' in error && typeof error.error === 'string') {
      return error.error
    }
  }

  return null
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

const insufficientFundsPatterns = [
  /insufficient funds for gas \* price \+ value: have (\d+) want (\d+)/i,
  /insufficient funds.*have[:\s]+(\d+).*want[:\s]+(\d+)/i,
]

export const classifyNftSendError = (error: unknown): NftSendError => {
  const message = getErrorMessage(error)

  if (!message) {
    return { code: 'unknown', message: 'Failed to send NFT' }
  }

  for (const pattern of insufficientFundsPatterns) {
    const match = message.match(pattern)
    if (match) {
      const haveWei = BigInt(match[1])
      const wantWei = BigInt(match[2])
      return {
        code: 'insufficient_funds',
        message: `Not enough ETH for gas. Have ${formatEther(haveWei)} ETH, need up to ${formatEther(wantWei)} ETH. Short ${formatEther(wantWei - haveWei)} ETH.`,
        data: { haveWei, wantWei },
      }
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

function buildNftGasFeeParams(params: {
  from: string
  to: string
  contractAddress: string
  tokenId: string
  standard: string
  amount?: string
}): Record<string, unknown> {
  const data = encodeNftTransfer({
    standard: params.standard,
    from: params.from,
    to: params.to,
    tokenId: params.tokenId,
    amount: params.amount,
  })

  return {
    from: params.from,
    to: params.contractAddress,
    value: '0x0',
    data,
  }
}

export async function fetchErc1155Balance(params: {
  owner: string
  contract: string
  tokenId: string
  network: NetworkType
}): Promise<bigint> {
  const chainId = NETWORK_TO_CHAIN_ID[params.network]
  if (!chainId) {
    throw new Error(`Unsupported network: ${params.network}`)
  }

  const data = erc1155.encodeFunctionData('balanceOf', [
    params.owner,
    parseTokenId(params.tokenId),
  ])

  const url = `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/rpc.proxy?chainId=${chainId}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_call',
      params: [{ to: params.contract, data }, 'latest'],
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch ERC-1155 balance')
  }

  const body = (await response.json()) as {
    result?: string
    error?: { message: string }
  }

  if (body.error) {
    throw new Error(body.error.message)
  }
  if (!body.result) {
    throw new Error('Empty ERC-1155 balance response')
  }

  const decoded = erc1155.decodeFunctionResult('balanceOf', body.result)
  return decoded[0] as bigint
}

export async function fetchNftGasFees(params: {
  from: string
  to: string
  contractAddress: string
  tokenId: string
  standard: string
  network: NetworkType
  amount?: string
}): Promise<GasFees> {
  const gasFeeParams = buildNftGasFeeParams(params)

  return fetchTrpcData<GasFees>(
    'nodes.getFeeRate',
    { network: params.network, params: gasFeeParams },
    'Failed to fetch NFT transfer gas fees',
  )
}
