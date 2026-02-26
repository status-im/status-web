import type { Address } from '../types/common'
import type { ChainConfig, ChainPreset } from '../types/config'

export type { Address }

export const KARMA_CHAIN_IDS = {
  STATUS_SEPOLIA: 1660990954,
} as const

export type KarmaChainId =
  (typeof KARMA_CHAIN_IDS)[keyof typeof KARMA_CHAIN_IDS]

export const KARMA_ADDRESSES: Record<
  KarmaChainId,
  {
    karma: Address
    statusRewardsDistributor: Address
    karmaTier: Address
    karmaAirdrop?: Address
  }
> = {
  [KARMA_CHAIN_IDS.STATUS_SEPOLIA]: {
    karma: '0x7ec5Dc75D09fAbcD55e76077AFa5d4b77D112fde',
    statusRewardsDistributor: '0xAEF19bbbe490Ad9C083EcE40c835A2f21B720de8',
    karmaTier: '0xc7fCD786a161f42bDaF66E18a67C767C23cFd30C',
  },
} as const

export const CHAIN_PRESETS: Record<ChainPreset, ChainConfig> = {
  'sn-hoodi': {
    chainId: KARMA_CHAIN_IDS.STATUS_SEPOLIA,
    contracts: KARMA_ADDRESSES[KARMA_CHAIN_IDS.STATUS_SEPOLIA],
  },
  'sn-mainnet': {
    chainId: KARMA_CHAIN_IDS.STATUS_SEPOLIA, // TODO: replace with mainnet chain ID
    contracts: KARMA_ADDRESSES[KARMA_CHAIN_IDS.STATUS_SEPOLIA],
  },
}

export function getKarmaAddresses(chainId: number) {
  const addresses = KARMA_ADDRESSES[chainId as KarmaChainId]
  if (!addresses) {
    throw new Error(`Karma contracts not deployed on chain ${chainId}`)
  }
  return {
    ...addresses,
    /** @deprecated Use statusRewardsDistributor instead */
    rewardsDistributor: addresses.statusRewardsDistributor,
  }
}
