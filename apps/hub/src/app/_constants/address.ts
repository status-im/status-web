import { keccak256, stringToHex } from 'viem'
import { linea, mainnet } from 'viem/chains'

import {
  bridgeCoordinatorL1Abi,
  faucetAbi,
  genericDepositorAbi,
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

export type StablecoinToken = Token & {
  vaultAddress: Address
}

export type GUSDConfig = {
  depositorAddress: Address
  depositorAbi: typeof genericDepositorAbi
  coordinatorAddress: Address
  coordinatorAbi: typeof bridgeCoordinatorL1Abi
  chainNickname: `0x${string}`
  stablecoins: StablecoinToken[]
  outputToken: Token
}

export type BaseVault = {
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

export type GUSDVault = BaseVault & {
  id: 'GUSD'
  gusdConfig: GUSDConfig
}

export type Vault = BaseVault | GUSDVault

export function isGUSDVault(vault: Vault): vault is GUSDVault {
  return vault.id === 'GUSD' && 'gusdConfig' in vault
}

export const STAKING_MANAGER = {
  address: '0x2Bc5b2a5F580064aaB6fbC1ee30113CD808582aC' as Address,
  abi: stakingManagerAbi as Abi,
} as const

export const VAULT_FACTORY = {
  address: '0x20620462A0415D922130C1c36bee3C5fcA866fd3' as Address,
  abi: vaultFactoryAbi as Abi,
} as const

export const FAUCET = {
  address: '0x2673840A768893dbD8F6398B0E985dDC8cfC9C6C' as Address,
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

// Testnet token for staking on Status Hoodi
export const STT_TOKEN: Token = {
  address: '0x14c847ce7ab6c8002616176478b32C237fdF0cBb',
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
// GUSD
// ============================================================================

export const USDC_TOKEN: StablecoinToken = {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  name: 'USD Coin',
  symbol: 'USDC',
  decimals: 6,
  abi: tokenAbi,
  priceKey: 'USDC',
  vaultAddress: '0x4825eFF24F9B7b76EEAFA2ecc6A1D5dFCb3c1c3f',
} as const

export const USDT_TOKEN: StablecoinToken = {
  address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  name: 'Tether USD',
  symbol: 'USDT',
  decimals: 6,
  abi: tokenAbi,
  priceKey: 'USDT',
  vaultAddress: '0xB8280955aE7b5207AF4CDbdCd775135Bd38157fE',
} as const

export const USDS_TOKEN: StablecoinToken = {
  address: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
  name: 'USDS Stablecoin',
  symbol: 'USDS',
  decimals: 18,
  abi: tokenAbi,
  priceKey: 'USDS',
  vaultAddress: '0x6133dA4Cd25773Ebd38542a8aCEF8F94cA89892A',
} as const

export const GUSD_TOKEN: Token = {
  address: '0x8c307baDbd78bEa5A1cCF9677caa58e7A2172502',
  name: 'Generic USD Unit',
  symbol: 'GUSD',
  decimals: 18,
  abi: tokenAbi,
  priceKey: 'GUSD',
} as const

export const GUSD_STABLECOINS: StablecoinToken[] = [
  USDC_TOKEN,
  USDT_TOKEN,
  USDS_TOKEN,
]

export const DEFAULT_GUSD_STABLECOIN = USDT_TOKEN

export const GENERIC_DEPOSITOR = {
  address: '0x79B4cDb14A31E8B0e21C0120C409Ac14Af35f919' as Address,
  abi: genericDepositorAbi,
} as const

export const BRIDGE_COORDINATOR_L1 = {
  address: '0x0503F2C5A1a4b72450c6Cfa790F2097CF5cB6a01' as Address,
  abi: bridgeCoordinatorL1Abi,
} as const

export const STATUS_L2_CHAIN_NICKNAME = keccak256(stringToHex('Status_L2'))

// ============================================================================
// Vaults
// ============================================================================

export const SNT_VAULT: Vault = {
  id: 'SNT',
  name: 'SNT Vault',
  apy: '',
  rewards: ['LINEA', 'vault.native_apps_points'],
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
  rewards: ['SNT', 'vault.native_apps_points'],
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
  rewards: ['SNT, LINEA', 'vault.native_apps_points'],
  icon: 'WETH',
  address: '0xc71Ec84Ee70a54000dB3370807bfAF4309a67a1f',
  token: WETH_TOKEN,
  abi: PreDepositVaultAbi,
  chainId: mainnet.id,
  network: mainnet.name,
} as const

export const GUSD_VAULT: GUSDVault = {
  id: 'GUSD',
  name: 'GUSD Vault',
  apy: '',
  rewards: ['SNT, LINEA', 'vault.native_apps_points'],
  icon: 'GUSD',
  address: GENERIC_DEPOSITOR.address,
  token: DEFAULT_GUSD_STABLECOIN,
  abi: PreDepositVaultAbi,
  chainId: mainnet.id,
  network: mainnet.name,
  gusdConfig: {
    depositorAddress: GENERIC_DEPOSITOR.address,
    depositorAbi: genericDepositorAbi,
    coordinatorAddress: BRIDGE_COORDINATOR_L1.address,
    coordinatorAbi: bridgeCoordinatorL1Abi,
    chainNickname: STATUS_L2_CHAIN_NICKNAME,
    stablecoins: GUSD_STABLECOINS,
    outputToken: GUSD_TOKEN,
  },
}

export const VAULTS: Vault[] = [WETH_VAULT, GUSD_VAULT, SNT_VAULT, LINEA_VAULT]

export const KARMA = {
  address: '0x0700bE6f329cC48C38144f71c898b72795dB6C1b' as Address,
  abi: karmaAbi as Abi,
} as const

export const REWARDS = {
  address: '0x2E0905fcCb440d602271179E5F48980FA4f597FE' as Address,
  abi: rewardsAbi as Abi,
} as const

export const KARMA_TIER = {
  address: '0xb8039632E089DCEFA6bBB1590948926B2463b691' as Address,
  abi: karmaTierAbi as Abi,
} as const
