import {
  encodeNftTransfer,
  extractTxHash,
  isSupportedNftStandard,
} from '@status-im/wallet/components'
import { NETWORK_TO_CHAIN_ID } from '@status-im/wallet/data'
import { Interface } from 'ethers'

import {
  fetchTrpcData,
  type GasFees,
} from '../../assets/-components/token-helpers'

import type { NetworkType } from '@status-im/wallet/data'

export { extractTxHash, isSupportedNftStandard }

const JSONRPC_REQUEST_ID = 1
const JSONRPC_VERSION = '2.0'

const erc1155 = new Interface([
  'function balanceOf(address account, uint256 id) view returns (uint256)',
])

const parseTokenId = (tokenId: string): bigint => {
  try {
    return BigInt(tokenId)
  } catch {
    throw new Error(`Invalid token id: ${tokenId}`)
  }
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
      jsonrpc: JSONRPC_VERSION,
      id: JSONRPC_REQUEST_ID,
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
