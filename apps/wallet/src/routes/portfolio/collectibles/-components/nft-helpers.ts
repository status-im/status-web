import {
  encodeNftTransfer,
  extractTxHash,
  isSupportedNftStandard,
} from '@status-im/wallet/components'
import { Interface } from 'ethers'

import { callAnvilRpc, estimateAnvilGasFees } from '@/lib/anvil-rpc'

import type { GasFees } from '../../assets/-components/token-helpers'
import type { NetworkType } from '@status-im/wallet/data'

export { extractTxHash, isSupportedNftStandard }

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
  const data = erc1155.encodeFunctionData('balanceOf', [
    params.owner,
    parseTokenId(params.tokenId),
  ])

  const result = await callAnvilRpc<string>('eth_call', [
    { to: params.contract, data },
    'latest',
  ])

  if (!result) {
    throw new Error('Empty ERC-1155 balance response')
  }

  const decoded = erc1155.decodeFunctionResult('balanceOf', result)
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

  return estimateAnvilGasFees(gasFeeParams)
}
