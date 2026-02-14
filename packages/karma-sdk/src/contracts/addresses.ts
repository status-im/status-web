export type Address = `0x${string}`

export const KARMA_CHAIN_IDS = {
  STATUS_SEPOLIA: 1660990954,
} as const

export type KarmaChainId =
  (typeof KARMA_CHAIN_IDS)[keyof typeof KARMA_CHAIN_IDS]

export const KARMA_ADDRESSES: Record<
  KarmaChainId,
  {
    karma: Address
    rewardsDistributor: Address
    karmaTier: Address
    karmaAirdrop?: Address
  }
> = {
  [KARMA_CHAIN_IDS.STATUS_SEPOLIA]: {
    karma: '0x7ec5Dc75D09fAbcD55e76077AFa5d4b77D112fde',
    rewardsDistributor: '0xAEF19bbbe490Ad9C083EcE40c835A2f21B720de8',
    karmaTier: '0xc7fCD786a161f42bDaF66E18a67C767C23cFd30C',
  },
} as const

export function getKarmaAddresses(chainId: number) {
  const addresses = KARMA_ADDRESSES[chainId as KarmaChainId]
  if (!addresses) {
    throw new Error(`Karma contracts not deployed on chain ${chainId}`)
  }
  return addresses
}
