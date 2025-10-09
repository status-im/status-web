import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { type Address } from 'viem'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { readContract } from 'wagmi/actions'

import { STAKING_MANAGER } from '~constants/index'
import { type StakingVault, useStakingVaults } from '~hooks/useStakingVaults'

// ============================================================================
// Types
// ============================================================================

/**
 * Result data for multiplier points balance query
 */
export interface MultiplierPointsData {
  /** Map of vault addresses to their current MP balances */
  vaultBalances: Record<Address, bigint>
  /** Total uncompounded MP across all vaults */
  totalUncompounded: bigint
  /** Total multiplier points redeemed by a user */
  totalMpRedeemed: bigint
}

/**
 * Return type for the useMultiplierPointsBalance query hook
 */
export type UseMultiplierPointsBalanceReturn =
  UseQueryResult<MultiplierPointsData>

// ============================================================================
// Constants
// ============================================================================

const QUERY_KEYS = {
  MULTIPLIER_POINTS: 'multiplier-points-balance',
} as const

const DEFAULT_MP_DATA: MultiplierPointsData = {
  vaultBalances: {},
  totalUncompounded: 0n,
  totalMpRedeemed: 0n,
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Fetches the multiplier points balance for a specific vault
 */
async function fetchVaultMpBalance(
  config: ReturnType<typeof useConfig>,
  vaultAddress: Address
): Promise<bigint> {
  const result = (await readContract(config, {
    address: STAKING_MANAGER.address,
    abi: STAKING_MANAGER.abi,
    functionName: 'mpBalanceOf',
    args: [vaultAddress],
  })) as bigint

  return result
}

/**
 * Calculates total uncompounded MP by comparing vault balances with staked amounts
 */
function calculateTotalUncompounded(
  vaultBalances: Record<Address, bigint>,
  vaults: StakingVault[]
): bigint {
  return vaults.reduce((total, vault) => {
    const currentBalance = vaultBalances[vault.address] ?? 0n
    const stakedAmount = vault.data?.mpAccrued ?? 0n
    const uncompounded =
      currentBalance > stakedAmount ? currentBalance - stakedAmount : 0n
    return total + uncompounded
  }, 0n)
}

/**
 * Fetches the total multiplier points redeemed by a user
 */
async function fetchMpBalanceOfAccount(
  config: ReturnType<typeof useConfig>,
  chainId: number,
  address: Address
): Promise<bigint> {
  try {
    const result = (await readContract(config, {
      chainId,
      address: STAKING_MANAGER.address,
      abi: STAKING_MANAGER.abi,
      functionName: 'mpBalanceOfAccount',
      args: [address],
    })) as bigint

    return result
  } catch (error) {
    console.error(
      `Failed to fetch account MP redeemed for ${address}:`,
      error instanceof Error ? error.message : String(error)
    )
    return 0n
  }
}

// ============================================================================
// Query Hook
// ============================================================================

/**
 * Query hook to fetch multiplier points balances across all vaults
 *
 * **Data Retrieved:**
 * - Individual vault MP balances
 * - Total uncompounded MP (difference between current balance and staked amount)
 *
 * @returns Query result with MP balance data
 *
 * @example
 * Basic usage
 * ```tsx
 * function MultiplierPointsDisplay() {
 *   const { data, isLoading, error } = useMultiplierPointsBalance()
 *
 *   if (isLoading) return <div>Loading...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return (
 *     <div>
 *       <p>Total Uncompounded: {data?.totalUncompounded.toString()}</p>
 *       <p>Vaults: {Object.keys(data?.vaultBalances ?? {}).length}</p>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * With formatted display
 * ```tsx
 * function CompoundInfo() {
 *   const { data } = useMultiplierPointsBalance()
 *   const hasUncompounded = (data?.totalUncompounded ?? 0n) > 0n
 *
 *   return (
 *     <div>
 *       {hasUncompounded ? (
 *         <p>{formatSNT(data.totalUncompounded)} points ready to compound</p>
 *       ) : (
 *         <p>No points ready to compound</p>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useMultiplierPointsBalance(): UseMultiplierPointsBalanceReturn {
  const { address } = useAccount()
  const config = useConfig()
  const chainId = useChainId()
  const { data: vaults } = useStakingVaults()

  return useQuery<MultiplierPointsData>({
    queryKey: [QUERY_KEYS.MULTIPLIER_POINTS, address, vaults?.length],
    queryFn: async (): Promise<MultiplierPointsData> => {
      if (!vaults || vaults.length === 0 || !address || !chainId) {
        return DEFAULT_MP_DATA
      }

      try {
        const vaultAddresses = vaults.map(vault => vault.address)

        // Fetch all MP balances in parallel
        const balances = await Promise.all(
          vaultAddresses.map(vaultAddress =>
            fetchVaultMpBalance(config, vaultAddress)
          )
        )

        // Map addresses to balances
        const vaultBalances = vaultAddresses.reduce(
          (acc, vaultAddress, index) => {
            acc[vaultAddress] = balances[index]
            return acc
          },
          {} as Record<Address, bigint>
        )

        const totalMpRedeemed = await fetchMpBalanceOfAccount(
          config,
          chainId,
          address
        )

        // Calculate total uncompounded MPs
        const totalUncompounded = calculateTotalUncompounded(
          vaultBalances,
          vaults
        )

        return {
          vaultBalances,
          totalUncompounded,
          totalMpRedeemed,
        }
      } catch (error) {
        console.error('Failed to fetch multiplier points balances:', error)
        return DEFAULT_MP_DATA
      }
    },
    enabled: !!address && !!vaults && vaults.length > 0,
    staleTime: 30_000, // Consider data fresh for 30 seconds
    refetchInterval: 60_000, // Refetch every 60 seconds
  })
}
