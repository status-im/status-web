import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { type Address } from 'viem'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { readContract, readContracts } from 'wagmi/actions'

import { vaultAbi } from '~constants/contracts'
import { STAKING_MANAGER } from '~constants/index'

// ============================================================================
// Types
// ============================================================================

/**
 * Vault data structure returned from the StakingManager contract
 * Maps directly to the VaultData struct in the smart contract
 */
export interface StakingVaultData {
  /** Total amount of tokens staked in the vault */
  stakedBalance: bigint
  /** Current reward index for calculating accrued rewards */
  rewardIndex: bigint
  /** Amount of multiplier points (MP) accrued over time */
  mpAccrued: bigint
  /** Maximum multiplier points achievable based on stake and lock period */
  maxMP: bigint
  /** Timestamp of the last MP update */
  lastMPUpdateTime: bigint
  /** Timestamp when the vault unlocks (0 if not locked) */
  lockUntil: bigint
  /** Total rewards accrued and available for claiming */
  rewardsAccrued: bigint
}

/**
 * Vault with its address and associated data
 */
export interface StakingVault {
  /** The vault contract address */
  address: Address
  /** Vault data from the contract, or null if fetch failed */
  data: StakingVaultData | null
}

/**
 * Configuration options for the useStakingVaults hook
 */
export interface UseStakingVaultsOptions {
  /** Whether to enable the query. Defaults to true when wallet is connected */
  enabled?: boolean
  /** Cache duration in milliseconds. Default: 10000ms (10 seconds) */
  staleTime?: number
  /** Auto-refetch interval in milliseconds. Default: disabled */
  refetchInterval?: number
}

/**
 * Return type for the useStakingVaults hook
 */
export type UseStakingVaultsReturn = UseQueryResult<StakingVault[], Error>

// ============================================================================
// Constants
// ============================================================================

const QUERY_KEY = 'staking-vaults' as const

const CACHE_CONFIG = {
  DEFAULT_STALE_TIME: 10_000, // 10 seconds
} as const

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Fetches vault addresses for a given account from the StakingManager contract
 */
async function fetchAccountVaultAddresses(
  config: ReturnType<typeof useConfig>,
  chainId: number,
  accountAddress: Address
): Promise<Address[]> {
  const addresses = (await readContract(config, {
    chainId,
    address: STAKING_MANAGER.address,
    abi: STAKING_MANAGER.abi,
    functionName: 'getAccountVaults',
    args: [accountAddress],
  })) as Address[]

  return addresses
}

/**
 * Fetches vault data for a specific vault address with error handling
 */
async function fetchVaultData(
  config: ReturnType<typeof useConfig>,
  chainId: number,
  vaultAddress: Address
): Promise<StakingVaultData | null> {
  try {
    const results = await readContracts(config, {
      contracts: [
        {
          chainId,
          address: STAKING_MANAGER.address,
          abi: STAKING_MANAGER.abi,
          functionName: 'getVault',
          args: [vaultAddress],
        },
        {
          chainId,
          address: vaultAddress,
          abi: vaultAbi,
          functionName: 'lockUntil',
          args: [],
        },
      ],
    })

    // Check if both contract calls succeeded
    const [vaultResult, lockUntilResult] = results

    if (
      vaultResult.status !== 'success' ||
      lockUntilResult.status !== 'success'
    ) {
      console.error(
        `Failed to fetch vault data for ${vaultAddress}:`,
        vaultResult.status !== 'success'
          ? vaultResult.error
          : lockUntilResult.error
      )
      return null
    }

    // Extract the actual data from successful results
    const vaultData = vaultResult.result as Omit<StakingVaultData, 'lockUntil'>
    const lockUntil = lockUntilResult.result as bigint

    return {
      ...vaultData,
      lockUntil,
    }
  } catch (error) {
    // Log error for debugging but don't throw - allows partial results
    console.error(
      `Failed to fetch vault data for ${vaultAddress}:`,
      error instanceof Error ? error.message : String(error)
    )
    return null
  }
}

/**
 * Enriches a vault address with its data
 */
async function enrichVaultWithData(
  config: ReturnType<typeof useConfig>,
  chainId: number,
  vaultAddress: Address
): Promise<StakingVault> {
  const data = await fetchVaultData(config, chainId, vaultAddress)
  return { address: vaultAddress, data }
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Query hook to fetch all staking vaults owned by the connected account
 *
 * **Features:**
 * - Fetches vault addresses from StakingManager contract
 * - Enriches each address with detailed vault data in parallel
 * - Graceful error handling - failed vaults return with `data: null`
 * - Automatic refetching and caching via React Query
 * - Network-aware caching (includes chainId in query key)
 *
 * **Performance:**
 * - Parallel fetching of vault data using Promise.all
 * - Configurable cache duration via staleTime option
 * - Optional auto-refetch via refetchInterval
 *
 * @param options - Configuration options for query behavior
 * @returns React Query result with vault data
 *
 * @example
 * Basic usage
 * ```tsx
 * function VaultsList() {
 *   const { data: vaults, isLoading, error } = useStakingVaults()
 *
 *   if (isLoading) return <Spinner />
 *   if (error) return <ErrorMessage error={error} />
 *
 *   return (
 *     <div>
 *       {vaults?.map((vault) =>
 *         vault.data ? (
 *           <VaultCard key={vault.address} vault={vault} />
 *         ) : (
 *           <FailedVaultCard key={vault.address} address={vault.address} />
 *         )
 *       )}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * With custom options
 * ```tsx
 * const { data: vaults, refetch } = useStakingVaults({
 *   enabled: isConnected,
 *   staleTime: 30_000, // 30 seconds
 *   refetchInterval: 60_000, // 1 minute
 * })
 * ```
 *
 * @example
 * Filtering vaults with data
 * ```tsx
 * const { data: vaults } = useStakingVaults()
 * const validVaults = vaults?.filter((v) => v.data !== null) ?? []
 * ```
 */
export function useStakingVaults(
  options?: UseStakingVaultsOptions
): UseStakingVaultsReturn {
  const { address } = useAccount()
  const config = useConfig()
  const chainId = useChainId()

  return useQuery<StakingVault[], Error>({
    queryKey: [QUERY_KEY, address, chainId],
    queryFn: async (): Promise<StakingVault[]> => {
      // Guard: Return empty array if no wallet is connected
      if (!address) {
        return []
      }

      // Step 1: Fetch all vault addresses for the account
      const vaultAddresses = await fetchAccountVaultAddresses(
        config,
        chainId,
        address
      )

      // Step 2: Fetch detailed data for each vault in parallel
      const vaults = await Promise.all(
        vaultAddresses.map(vaultAddress =>
          enrichVaultWithData(config, chainId, vaultAddress)
        )
      )

      return vaults
    },
    enabled: options?.enabled ?? !!address,
    staleTime: options?.staleTime ?? CACHE_CONFIG.DEFAULT_STALE_TIME,
    refetchInterval: options?.refetchInterval,
  })
}
