import { linea, mainnet } from 'viem/chains'

import {
  faucetAbi,
  karmaAbi,
  karmaTierAbi,
  lidoStETHAbi,
  rewardsAbi,
  stakingManagerAbi,
  tokenAbi,
  vaultFactoryAbi,
} from './contracts'
import { lineaTokenAbi } from './contracts/LineaTokenAbi'
import { PreDepositVaultAbi } from './contracts/PreDepositVaultAbi'

import type { Abi, Address } from 'viem'

export type Token = {
  address: Address
  name: string
  symbol: string
  decimals: number
  abi: Abi
  priceKey?: string
}

export type Vault = {
  id: string
  name: string
  address: Address
  apy: string
  rewards: string[]
  icon: string
  token: Token
  chainId: number
  network: (typeof mainnet | typeof linea)['name']
  abi: typeof PreDepositVaultAbi
}

export const STAKING_MANAGER = {
  address: '0x5cDf1646E4c1D21eE94DED1DA8da3Ca450dc96D1' as Address,
  abi: stakingManagerAbi as Abi,
} as const

export const VAULT_FACTORY = {
  address: '0xddDcd43a0B0dA865decf3e4Ae71FbBE3e2DfFF14' as Address,
  abi: vaultFactoryAbi as Abi,
} as const

export const FAUCET = {
  address: '0x4Fb609F4a457f47B41D35Dd060447271F000120A' as Address,
  abi: faucetAbi as Abi,
} as const

export const WETH_TOKEN: Token = {
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  name: 'Wrapped Ether',
  symbol: 'WETH',
  decimals: 18,
  // priceKey: 'ETH',
  abi: tokenAbi,
} as const

export const stETH_TOKEN: Token = {
  address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
  name: 'Liquid staked Ether 2.0',
  symbol: 'stETH',
  decimals: 18,
  abi: lidoStETHAbi,
} as const

export const SNT_TOKEN: Token = {
  address: '0x744d70FDBE2Ba4CF95131626614a1763DF805B9E',
  name: 'Status Network',
  symbol: 'SNT',
  decimals: 18,
  abi: tokenAbi,
} as const

// Testnet token for staking on Status Sepolia
export const STT_TOKEN: Token = {
  address: '0x1C3Ac2a186c6149Ae7Cb4D716eBbD0766E4f898a',
  name: 'Status Test Token',
  symbol: 'STT',
  decimals: 18,
  abi: tokenAbi,
} as const

export const LINEA_TOKEN: Token = {
  address: '0x1789e0043623282D5DCc7F213d703C6D8BAfBB04',
  name: 'Linea',
  symbol: 'LINEA',
  decimals: 18,
  abi: lineaTokenAbi,
} as const

// ============================================================================
// Vaults
// ============================================================================

export const SNT_VAULT: Vault = {
  id: 'SNT',
  name: 'SNT Vault',
  apy: '',
  rewards: ['LINEA', 'native apps points'],
  icon: 'SNT',
  address: '0x493957E168aCCdDdf849913C3d60988c652935Cd',
  token: SNT_TOKEN,
  abi: PreDepositVaultAbi,
  chainId: mainnet.id,
  network: mainnet.name,
} as const

export const LINEA_VAULT: Vault = {
  id: 'LINEA',
  name: 'LINEA Vault',
  apy: '',
  rewards: ['SNT', 'native apps points'],
  icon: 'LINEA',
  address: '0xb223cA53A53A5931426b601Fa01ED2425D8540fB',
  token: LINEA_TOKEN,
  abi: PreDepositVaultAbi,
  chainId: linea.id,
  network: linea.name,
} as const

export const WETH_VAULT: Vault = {
  id: 'WETH',
  name: 'WETH vault',
  apy: '',
  rewards: ['SNT, LINEA', 'native apps points'],
  icon: 'WETH',
  address: '0xc71Ec84Ee70a54000dB3370807bfAF4309a67a1f',
  token: WETH_TOKEN,
  abi: PreDepositVaultAbi,
  chainId: mainnet.id,
  network: mainnet.name,
} as const

export const GUSD_VAULT: Vault = {
  id: 'GUSD',
  name: 'GUSD Vault',
  apy: '',
  rewards: ['SNT, LINEA', 'native apps points'],
  icon: 'GUSD',
  address: '0x0000000000000000000000000000000000000000',
  token: WETH_TOKEN,
  abi: PreDepositVaultAbi,
  chainId: mainnet.id,
  network: mainnet.name,
} as const

export const VAULTS: Vault[] = [SNT_VAULT, LINEA_VAULT, WETH_VAULT, GUSD_VAULT]

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
