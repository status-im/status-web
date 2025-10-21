import { lineaTokenAbi } from './contracts/LineaTokenAbi'
import { MockTokenAbi } from './contracts/MockTokenAbi'
import { PreDepositVaultAbi } from './contracts/PreDepositVaultAbi'
import { tokenAbi } from './contracts/TokenAbi'

import type { ReactNode } from 'react'
import type { Abi, Address } from 'viem'

export type Token = {
  address: Address
  name: string
  symbol: string
  decimals: number
  abi: Abi
}

export type Reward = {
  name: string
  icon: ReactNode
}

export type Vault = {
  id: string
  name: string
  address: Address
  apy: string
  rewards: REWARD[]
  icon: string
  token: TOKEN
  abi: typeof PreDepositVaultAbi
}

export const wETH_TOKEN: TOKEN = {
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  name: 'Wrapped Ether',
  symbol: 'WETH',
  decimals: 18,
  abi: tokenAbi,
} as const

export const SNT_TOKEN: TOKEN = {
  address: '0x1C3Ac2a186c6149Ae7Cb4D716eBbD0766E4f898a',
  name: 'Status Test Token',
  symbol: 'STT',
  decimals: 18,
  abi: tokenAbi,
} as const

export const LINEA_TOKEN: TOKEN = {
  address: '0x1789e0043623282D5DCc7F213d703C6D8BAfBB04',
  name: 'Linea',
  symbol: 'LINEA',
  decimals: 18,
  abi: lineaTokenAbi,
} as const

export const MOCK_TOKEN: TOKEN = {
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
  rewards: [
    {
      name: 'SNT',
      icon: 'SNT',
    },
  ],
  icon: 'SNT',
  address: '0x88DfF41EE1958b7B7EbA809Ab7F6FCC33fd9969E',
  token: MOCK_TOKEN,
  abi: PreDepositVaultAbi,
} as const
