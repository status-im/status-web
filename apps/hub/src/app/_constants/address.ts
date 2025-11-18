import {
  faucetAbi,
  // karmaAbi,
  // karmaTierAbi,
  // rewardsAbi,
  stakingManagerAbi,
  tokenAbi,
  vaultFactoryAbi,
} from './contracts'
import { lineaTokenAbi } from './contracts/LineaTokenAbi'
import { MockTokenAbi } from './contracts/MockTokenAbi'
import { PreDepositVaultAbi } from './contracts/PreDepositVaultAbi'

import type { Abi, Address } from 'viem'

export type Token = {
  address: Address
  name: string
  symbol: string
  decimals: number
  abi: Abi
}

export type Vault = {
  id: string
  name: string
  address: Address
  apy: string
  rewards: string[]
  icon: string
  token: Token
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

export const wETH_TOKEN: Token = {
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  name: 'Wrapped Ether',
  symbol: 'WETH',
  decimals: 18,
  abi: tokenAbi,
} as const

export const SNT_TOKEN: Token = {
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

export const MOCK_TOKEN: Token = {
  address: '0x3841E6CD6466599d30FdFF9166E5b38452b7F232',
  name: 'MockERC20',
  symbol: 'MERC',
  decimals: 18,
  abi: MockTokenAbi,
} as const

// ============================================================================
// Vaults
// ============================================================================

export const TEST_VAULT: Vault = {
  id: 'MERC',
  name: 'MockERC20 vault',
  apy: '10.5%',
  rewards: ['SNT'],
  icon: 'SNT',
  address: '0x88DfF41EE1958b7B7EbA809Ab7F6FCC33fd9969E',
  token: MOCK_TOKEN,
  abi: PreDepositVaultAbi,
} as const

export const STT_VAULT: Vault = {
  id: 'STT',
  name: 'Status Test Token',
  apy: '10.5%',
  rewards: ['SNT'],
  icon: 'SNT',
  address: '0x3cb680f84f7729b56c18907C899a26bC1f4ad4D4',
  token: SNT_TOKEN,
  abi: PreDepositVaultAbi,
} as const

export const VAULTS: Vault[] = [
  TEST_VAULT,
  // {
  //   id: 'SNT',
  //   name: 'SNT vault',
  //   apy: '8.7%',
  //   rewards: ['KARMA', 'MetaFi', 'Points'],
  //   icon: 'SNT',
  //   token: SNT_TOKEN,
  //   address: '0x0000000000000000000000000000000000000000',
  //   abi: PreDepositVaultAbi,
  // },
  // {
  //   id: 'LINEA',
  //   name: 'LINEA vault',
  //   apy: '3.9%',
  //   rewards: ['KARMA', 'SNT', 'Points'],
  //   icon: 'LINEA',
  //   token: LINEA_TOKEN,
  //   address: '0x0000000000000000000000000000000000000000',
  //   abi: PreDepositVaultAbi,
  // },
  // {
  //   id: 'ETH',
  //   name: 'ETH vault',
  //   apy: '5.2%',
  //   rewards: ['KARMA', 'SNT', 'LINEA'],
  //   icon: 'ETH',
  //   token: wETH_TOKEN,
  //   address: '0x0000000000000000000000000000000000000000',
  //   abi: PreDepositVaultAbi,
  // },
]

// export const KARMA = {
//   address: '0x7ec5Dc75D09fAbcD55e76077AFa5d4b77D112fde' as Address,
//   abi: karmaAbi as Abi,
// } as const

// export const REWARDS = {
//   address: '0xAEF19bbbe490Ad9C083EcE40c835A2f21B720de8' as Address,
//   abi: rewardsAbi as Abi,
// } as const

// export const KARMA_TIER = {
//   address: '0xc7fCD786a161f42bDaF66E18a67C767C23cFd30C' as Address,
//   abi: karmaTierAbi as Abi,
// } as const
