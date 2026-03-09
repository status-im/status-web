import type { RewardsDistributor } from '../modules/rewards'
import type { Address } from './common'

/** Built-in chain presets for Status Network deployments. Use 'custom' in KarmaSDKConfig for other chains. */
export type ChainPreset = 'sn-hoodi' | 'sn-mainnet'

export type SDKMode = 'read-only' | 'read-write'

/** Minimal EIP-1193 provider interface for platform agnosticity */
export interface EIP1193Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>
}

export interface ChainConfig {
  chainId: number
  /** Human-readable chain name. Defaults to "Karma Chain (<chainId>)". */
  name?: string
  /** Native currency definition. Defaults to ETH (18 decimals). */
  nativeCurrency?: { name: string; symbol: string; decimals: number }
  contracts: {
    karma: Address
    statusRewardsDistributor: Address
    karmaTier: Address
    karmaAirdrop?: Address
    /** @deprecated Use statusRewardsDistributor. Will be removed in v1.0. */
    rewardsDistributor?: Address
  }
}

export interface KarmaSDKConfig {
  /** Named chain preset, or 'custom' with customChain required */
  chain: ChainPreset | 'custom'
  /** Operation mode — 'read-write' requires privateKeyOrSigner */
  mode: SDKMode
  /** RPC URL string or an EIP-1193 compatible provider */
  rpcUrlOrProvider: string | EIP1193Provider
  /** Private key hex string or EIP-1193 provider for signing. Required when mode='read-write' */
  privateKeyOrSigner?: string | EIP1193Provider
  /** Override the Karma API base URL */
  apiUrl?: string
  /** Custom fetch implementation (for Node.js < 18, or testing) */
  fetch?: typeof globalThis.fetch
  /** Required when chain='custom' */
  customChain?: ChainConfig
  /** Custom RewardsDistributor instance. Defaults to StatusKarmaDistributor. */
  rewardsDistributor?: RewardsDistributor
}
