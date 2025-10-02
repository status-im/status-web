import { createConfig, http } from 'wagmi'

import type { Config, CreateConfigParameters, Transport } from 'wagmi'
import type { Chain } from 'wagmi/chains'

// Todo: move this to shared packages

/**
 * Configuration options for Status Hub wagmi config
 */
export interface DefineWagmiConfigOptions {
  /**
   * Array of chains to support
   */
  chains: [Chain, ...Chain[]]

  /**
   * Enable server-side rendering support
   * @default false
   */
  ssr?: boolean

  /**
   * Custom RPC URLs per chain (optional)
   * Maps chain IDs to RPC URLs
   */
  rpcUrls?: Record<number, string>

  /**
   * Batch JSON-RPC requests
   * @default undefined
   */
  batch?: CreateConfigParameters['batch']

  /**
   * Polling interval in milliseconds
   * @default undefined
   */
  pollingInterval?: number

  /**
   * WalletConnect project ID
   * @default undefined
   */
  walletConnectProjectId?: string
}

/**
 * Creates a wagmi configuration for Status Hub with the specified chains and options
 *
 * @param options - Configuration options
 * @returns Wagmi config instance
 *
 * @example
 * ```ts
 * import { mainnet, optimism } from 'wagmi/chains'
 *
 * const config = defineWagmiConfig({
 *   chains: [mainnet, optimism],
 *   ssr: true,
 *   walletConnectProjectId: 'your-project-id',
 *   rpcUrls: {
 *     [mainnet.id]: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY'
 *   }
 * })
 * ```
 */
export const defineWagmiConfig = (
  options: DefineWagmiConfigOptions
): Config => {
  const { chains, ssr = false, rpcUrls, batch, pollingInterval } = options

  const transports = chains.reduce(
    (acc, chain) => {
      const rpcUrl = rpcUrls?.[chain.id]
      acc[chain.id] = http(rpcUrl, {
        batch: batch ? true : undefined,
        ...(pollingInterval && { pollingInterval }),
      })
      return acc
    },
    {} as Record<number, Transport>
  )

  return createConfig({
    chains,
    ssr,
    transports,
    batch,
  })
}

/**
 * Type helper to infer the config type from defineWagmiConfig
 */
export type InferWagmiConfig = ReturnType<typeof defineWagmiConfig>
