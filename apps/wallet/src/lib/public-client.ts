import { ProviderRpcError } from '@status-im/ethereum-provider'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

import { getChain } from './chains'
import { getRpcProxyUrl } from './rpc-proxy'

import type { PublicClient } from 'viem'

const clients = new Map<number, PublicClient>()

/**
 * The read client for one chain, over the wallet's authenticated proxy.
 *
 * A dApp that switched chains has to be read on the chain it switched to;
 * serving it mainnet was the silent wrongness this replaces. Chains the proxy
 * has no route for are refused here rather than answered from the wrong node.
 */
export function getPublicClient(chainId: number): PublicClient {
  const cached = clients.get(chainId)
  if (cached) {
    return cached
  }

  const chain = getChain(chainId)
  if (!chain?.proxyChainId) {
    // 4901, not 4902: the chain is recognised and switchable, there is just no
    // route to it. 4902 invites the dApp to add the chain and retry, which
    // succeeds and then fails again the same way.
    throw new ProviderRpcError({
      code: 4901,
      message: `Chain ${chainId} is not available`,
    })
  }

  const client = createPublicClient({
    chain: chain.viemChain,
    transport: http(getRpcProxyUrl(chain.proxyChainId)),
  })
  clients.set(chainId, client)
  return client
}

export const publicClient = getPublicClient(mainnet.id)
