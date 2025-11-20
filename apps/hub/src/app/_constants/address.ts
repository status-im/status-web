import {
  faucetAbi,
  karmaAbi,
  karmaTierAbi,
  rewardsAbi,
  stakingManagerAbi,
  tokenAbi,
  vaultFactoryAbi,
} from './contracts'

import type { Abi, Address } from 'viem'

export const STAKING_MANAGER = {
  address: '0x5cDf1646E4c1D21eE94DED1DA8da3Ca450dc96D1' as Address,
  abi: stakingManagerAbi as Abi,
} as const

export const VAULT_FACTORY = {
  address: '0xddDcd43a0B0dA865decf3e4Ae71FbBE3e2DfFF14' as Address,
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

export const KARMA = {
  address: '0x7ec5Dc75D09fAbcD55e76077AFa5d4b77D112fde' as Address,
  abi: karmaAbi as Abi,
} as const

export const REWARDS = {
  address: '0xAEF19bbbe490Ad9C083EcE40c835A2f21B720de8' as Address,
  abi: rewardsAbi as Abi,
} as const

export const KARMA_TIER = {
  address: '0xc7fCD786a161f42bDaF66E18a67C767C23cFd30C' as Address,
  abi: karmaTierAbi as Abi,
} as const
