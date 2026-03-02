import { CONTRACTS } from '@helpers/anvil-rpc.js'

/**
 * Test vault data — simplified subset of apps/hub constants.
 * Vault addresses reference CONTRACTS (single source of truth).
 */
export const TEST_VAULTS = {
  WETH: {
    id: 'WETH',
    name: 'WETH vault',
    token: 'WETH',
    address: CONTRACTS.WETH_VAULT,
    chainId: 1,
  },
  SNT: {
    id: 'SNT',
    name: 'SNT Vault',
    token: 'SNT',
    address: CONTRACTS.SNT_VAULT,
    chainId: 1,
  },
  LINEA: {
    id: 'LINEA',
    name: 'LINEA Vault',
    token: 'LINEA',
    address: CONTRACTS.LINEA_VAULT,
    chainId: 59144,
  },
  GUSD: {
    id: 'GUSD',
    name: 'GUSD Vault',
    token: 'GUSD',
    address: CONTRACTS.GUSD_VAULT,
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
