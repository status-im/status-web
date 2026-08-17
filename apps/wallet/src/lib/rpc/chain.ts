import { ProviderRpcError } from '@status-im/ethereum-provider'

import {
  getChainIdForOrigin,
  setChainIdForOrigin,
} from '../../data/dapp-permissions'

import type { RpcContext } from './context'

const SUPPORTED_CHAIN_IDS = new Set(['0x1', '0x6300b5ea'])

export async function eth_chainId({ origin }: RpcContext): Promise<string> {
  return await getChainIdForOrigin(origin)
}

export async function net_version({ origin }: RpcContext): Promise<string> {
  const chainId = await getChainIdForOrigin(origin)
  return parseInt(chainId, 16).toString()
}

export async function wallet_switchEthereumChain({
  params,
  origin,
}: RpcContext): Promise<null> {
  const p = params as [{ chainId: string }] | undefined
  const requestedChainId = p?.[0]?.chainId
  if (requestedChainId && !SUPPORTED_CHAIN_IDS.has(requestedChainId)) {
    throw new ProviderRpcError({
      code: 4902,
      message: `Unrecognized chain ID ${requestedChainId}. Try adding the chain using wallet_addEthereumChain first.`,
    })
  }
  if (requestedChainId) {
    await setChainIdForOrigin(origin, requestedChainId)
  }
  return null
}

export async function wallet_addEthereumChain({
  params,
  origin,
}: RpcContext): Promise<null> {
  const p = params as [{ chainId: string }] | undefined
  const requestedChainId = p?.[0]?.chainId
  if (requestedChainId && !SUPPORTED_CHAIN_IDS.has(requestedChainId)) {
    throw new ProviderRpcError({
      code: 4902,
      message: `Chain ${requestedChainId} is not supported`,
    })
  }
  if (requestedChainId) {
    await setChainIdForOrigin(origin, requestedChainId)
  }
  return null
}
