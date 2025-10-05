import type { Address } from 'viem'

export const STAKING_MANAGER = {
  address: '0x785e6c5af58FB26F4a0E43e0cF254af10EaEe0f1' as Address,
} as const

export const VAULT_FACTORY = {
  address: '0xf7b6EC76aCa97b395dc48f7A2861aD810B34b52e' as Address,
} as const

export const SNT_TOKEN = {
  address: '0x1C3Ac2a186c6149Ae7Cb4D716eBbD0766E4f898a' as Address,
  name: 'Status Test Token',
  symbol: 'STT',
  decimals: 18,
} as const

export const FAUCET = {
  address: '0x4Fb609F4a457f47B41D35Dd060447271F000120A' as Address,
} as const
