import { Interface } from 'ethers'

import {
  fetchTrpcData,
  type GasFees,
} from '../../assets/-components/token-helpers'

export const erc721 = new Interface([
  'function safeTransferFrom(address from, address to, uint256 tokenId)',
])

export const erc1155 = new Interface([
  'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)',
])

export function encodeNftTransfer(params: {
  standard: string
  from: string
  to: string
  tokenId: string
  amount?: string
}): string {
  if (params.standard === 'ERC721') {
    return erc721.encodeFunctionData('safeTransferFrom', [
      params.from,
      params.to,
      BigInt(params.tokenId),
    ])
  }

  if (params.standard === 'ERC1155') {
    return erc1155.encodeFunctionData('safeTransferFrom', [
      params.from,
      params.to,
      BigInt(params.tokenId),
      BigInt(params.amount ?? '1'),
      '0x',
    ])
  }

  throw new Error(`Unsupported NFT standard: ${params.standard}`)
}

export function buildNftGasFeeParams(params: {
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

export async function fetchNftGasFees(params: {
  from: string
  to: string
  contractAddress: string
  tokenId: string
  standard: string
  network: string
  amount?: string
}): Promise<GasFees> {
  const gasFeeParams = buildNftGasFeeParams(params)

  return fetchTrpcData<GasFees>(
    'nodes.getFeeRate',
    { network: params.network, params: gasFeeParams },
    'Failed to fetch NFT transfer gas fees',
  )
}
