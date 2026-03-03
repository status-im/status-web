import {
  createPublicClient as viemCreatePublicClient,
  createWalletClient as viemCreateWalletClient,
  defineChain,
  http,
  custom,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import type { PublicClient, WalletClient } from 'viem'
import type { KarmaSDKConfig, EIP1193Provider, ChainConfig } from '../types/config'
import type { Hex } from '../types/common'

export function buildChain(chainConfig: ChainConfig) {
  return defineChain({
    id: chainConfig.chainId,
    name: chainConfig.name ?? `Karma Chain (${chainConfig.chainId})`,
    nativeCurrency: chainConfig.nativeCurrency ?? { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: [] } },
  })
}

export function buildPublicClient(
  config: KarmaSDKConfig,
  chainConfig: ChainConfig,
): PublicClient {
  const chain = buildChain(chainConfig)

  const transport =
    typeof config.rpcUrlOrProvider === 'string'
      ? http(config.rpcUrlOrProvider)
      : custom(config.rpcUrlOrProvider as EIP1193Provider)

  return viemCreatePublicClient({ chain, transport })
}

export function buildWalletClient(
  config: KarmaSDKConfig,
  chainConfig: ChainConfig,
): WalletClient | null {
  if (config.mode === 'read-only') return null

  if (!config.privateKeyOrSigner) {
    throw new Error(
      'privateKeyOrSigner is required when mode is "read-write"',
    )
  }

  const chain = buildChain(chainConfig)

  const transport =
    typeof config.rpcUrlOrProvider === 'string'
      ? http(config.rpcUrlOrProvider)
      : custom(config.rpcUrlOrProvider as EIP1193Provider)

  if (typeof config.privateKeyOrSigner === 'string') {
    const account = privateKeyToAccount(config.privateKeyOrSigner as Hex)
    return viemCreateWalletClient({ account, chain, transport })
  }

  return viemCreateWalletClient({
    chain,
    transport: custom(config.privateKeyOrSigner),
  })
}
