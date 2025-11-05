import {
  faucetAbi,
  stakingManagerAbi,
  tokenAbi,
  vaultFactoryAbi,
} from './contracts'

import type { Abi, Address } from 'viem'

export const STAKING_MANAGER = {
  address: '0x07301236DDAD37dCA93690e7a7049Bc13F55158E' as Address,
  abi: stakingManagerAbi as Abi,
} as const

export const VAULT_FACTORY = {
  address: '0x489427Fad204FF494Cd8BE860D4af76b4Ce9F717' as Address,
  abi: vaultFactoryAbi as Abi,
} as const

export const SNT_TOKEN = {
  address: '0x1C3Ac2a186c6149Ae7Cb4D716eBbD0766E4f898a' as Address,
  name: 'Status Test Token',
  symbol: 'STT',
  decimals: 18,
  abi: tokenAbi as Abi,
} as const

export const FAUCET = {
  address: '0x4Fb609F4a457f47B41D35Dd060447271F000120A' as Address,
  abi: faucetAbi as Abi,
} as const
