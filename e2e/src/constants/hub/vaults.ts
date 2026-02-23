/**
 * Test vault data — simplified subset of apps/hub constants.
 * If vault addresses or names change, update this file accordingly.
 */
export const TEST_VAULTS = {
  WETH: {
    id: 'WETH',
    name: 'WETH Vault',
    token: 'WETH',
    address: '0xc71Ec84Ee70a54000dB3370807bfAF4309a67a1f',
    chainId: 1,
  },
  SNT: {
    id: 'SNT',
    name: 'SNT Vault',
    token: 'SNT',
    address: '0x493957E168aCCdDdf849913C3d60988c652935Cd',
    chainId: 1,
  },
  LINEA: {
    id: 'LINEA',
    name: 'LINEA Vault',
    token: 'LINEA',
    address: '0xb223cA53A53A5931426b601Fa01ED2425D8540fB',
    chainId: 59144,
  },
  GUSD: {
    id: 'GUSD',
    name: 'GUSD Vault',
    token: 'GUSD',
    address: '0x79B4cDb14A31E8B0e21C0120C409Ac14Af35f919',
    chainId: 1,
  },
} as const

export const TEST_AMOUNTS = {
  EXCEED_BALANCE: '999999999',
} as const

/**
 * Amounts below vault minimum deposit thresholds (for below-minimum validation tests).
 * Current minimums: WETH = 0.001, SNT = 1, LINEA = 1.
 * Each value here must be strictly less than the corresponding minimum.
 */
export const BELOW_MIN_AMOUNTS = {
  WETH: '0.0005',
  SNT: '0.5',
  LINEA: '0.5',
} as const

/** Amounts for happy-path deposit tests (above minimum, reasonable values). */
export const DEPOSIT_AMOUNTS = {
  WETH: '0.01',
  WETH_PARTIAL: '0.02',
  SNT: '10',
  LINEA: '10',
  GUSD_USDT: '10',
  GUSD_USDC: '10',
  GUSD_USDS: '10',
} as const
