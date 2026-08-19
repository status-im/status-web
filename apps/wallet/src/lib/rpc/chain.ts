import { ProviderRpcError } from '@status-im/ethereum-provider'

import {
  getChainIdForOrigin,
  setChainIdForOrigin,
} from '../../data/dapp-permissions'
import { getChainByHex, toChainId } from '../chains'

import type { RpcContext } from './context'

export async function eth_chainId({ origin }: RpcContext): Promise<string> {
  return await getChainIdForOrigin(origin)
}

export async function net_version({ origin }: RpcContext): Promise<string> {
  const chainId = await getChainIdForOrigin(origin)
  return toChainId(chainId).toString()
}

export async function wallet_switchEthereumChain({
  params,
  origin,
}: RpcContext): Promise<null> {
  const p = params as [{ chainId: string }] | undefined
  const requestedChainId = p?.[0]?.chainId
  if (!requestedChainId) {
    return null
  }

  const chain = getChainByHex(requestedChainId)
  if (!chain) {
    throw new ProviderRpcError({
      code: 4902,
      message: `Unrecognized chain ID ${requestedChainId}. Try adding the chain using wallet_addEthereumChain first.`,
    })
  }

  // The registry's spelling, not the dApp's, so an origin that asked for
  // `0x6300B5EA` is not a different chain from one that asked for `0x6300b5ea`
  // everywhere downstream.
  await setChainIdForOrigin(origin, chain.hex)
  return null
}

export async function wallet_addEthereumChain({
  params,
  origin,
}: RpcContext): Promise<null> {
  const p = params as [{ chainId: string }] | undefined
  const requestedChainId = p?.[0]?.chainId
  if (!requestedChainId) {
    return null
  }

  const chain = getChainByHex(requestedChainId)
  if (!chain) {
    throw new ProviderRpcError({
      code: 4902,
      message: `Chain ${requestedChainId} is not supported`,
    })
  }

  await setChainIdForOrigin(origin, chain.hex)
  return null
}
