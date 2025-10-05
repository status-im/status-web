import { useMemo } from 'react'

import { formatUnits } from 'viem'

import { SNT_TOKEN } from '../../config'

import type { VaultWithAddress } from './useAccountVaults'

// ============================================================================
// Types
// ============================================================================

/**
 * Weighted boost calculation result
 */
export interface WeightedBoost {
  /** Weighted aggregate boost multiplier as a number */
  value: number
  /** Formatted boost multiplier (e.g., "1.25") */
  formatted: string
  /** Total staked amount across all vaults */
  totalStaked: number
  /** Whether any vaults have stake */
  hasStake: boolean
}

// ============================================================================
// Constants
// ============================================================================

const BASE_BOOST = 1.0
const DEFAULT_DECIMALS = 2

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Converts bigint token amount to number using formatUnits
 *
 * @param value - The bigint value to convert
 * @param decimals - Number of decimals for the token
 * @returns Numeric representation
 */
function toTokenAmount(value: bigint, decimals: number): number {
  return Number(formatUnits(value, decimals))
}

/**
 * Calculates the boost multiplier for a single vault
 *
 * Boost formula: (MP / Staked) + 1
 *
 * @param stakedBalance - Amount of tokens staked in the vault
 * @param mpAccrued - Multiplier points accrued
 * @param decimals - Token decimals
 * @returns Boost multiplier for the vault
 */
function calculateVaultBoost(
  stakedBalance: bigint,
  mpAccrued: bigint,
  decimals: number
): number {
  const staked = toTokenAmount(stakedBalance, decimals)
  const mp = toTokenAmount(mpAccrued, decimals)

  if (staked === 0) return BASE_BOOST

  return mp / staked + BASE_BOOST
}

/**
 * Calculates weighted aggregate boost across all vaults
 *
 * The weighted boost is calculated as:
 * Sum(Boost_i * Staked_i) / Sum(Staked_i)
 *
 * Where:
 * - Boost_i = (MP_i / Staked_i) + 1
 * - Staked_i = staked balance in vault i
 *
 * @param vaults - Array of vaults with their data
 * @param decimals - Token decimals
 * @returns Weighted boost calculation result
 */
function calculateWeightedBoost(
  vaults: VaultWithAddress[],
  decimals: number
): WeightedBoost {
  let totalWeightedBoost = 0
  let totalStaked = 0

  // Calculate weighted sum across all vaults
  for (const vault of vaults) {
    // Skip vaults with no data or no stake
    if (!vault.data || vault.data.stakedBalance === 0n) {
      continue
    }

    const vaultStaked = toTokenAmount(vault.data.stakedBalance, decimals)
    const vaultBoost = calculateVaultBoost(
      vault.data.stakedBalance,
      vault.data.mpAccrued,
      decimals
    )

    totalWeightedBoost += vaultBoost * vaultStaked
    totalStaked += vaultStaked
  }

  // Handle no stake case
  if (totalStaked === 0) {
    return {
      value: BASE_BOOST,
      formatted: BASE_BOOST.toFixed(DEFAULT_DECIMALS),
      totalStaked: 0,
      hasStake: false,
    }
  }

  // Calculate weighted average
  const weightedAverage = totalWeightedBoost / totalStaked

  return {
    value: weightedAverage,
    formatted: weightedAverage.toFixed(DEFAULT_DECIMALS),
    totalStaked,
    hasStake: true,
  }
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to calculate weighted aggregate boost across all user vaults
 *
 * The weighted boost rewards long-term staking by calculating a weighted
 * average of individual vault boosts based on their staked amounts.
 *
 * @param vaults - Array of user vaults with their data
 * @returns Weighted boost calculation result
 *
 * @example
 * ```tsx
 * function BoostDisplay() {
 *   const { data: vaults } = useAccountVaults()
 *   const boost = useWeightedBoost(vaults)
 *
 *   return (
 *     <div>
 *       <p>Weighted Boost: x{boost.formatted}</p>
 *       <p>Total Staked: {boost.totalStaked} SNT</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useWeightedBoost(vaults?: VaultWithAddress[]): WeightedBoost {
  return useMemo(() => {
    if (!vaults || vaults.length === 0) {
      return {
        value: BASE_BOOST,
        formatted: BASE_BOOST.toFixed(DEFAULT_DECIMALS),
        totalStaked: 0,
        hasStake: false,
      }
    }

    return calculateWeightedBoost(vaults, SNT_TOKEN.decimals)
  }, [vaults])
}
