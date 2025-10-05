import { useQuery } from '@tanstack/react-query'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { readContract } from 'wagmi/actions'

import { STAKING_MANAGER } from '../../config'
import { stakingManagerAbi } from '../contracts'

import type { UseQueryResult } from '@tanstack/react-query'
import type { Address } from 'viem'

// ============================================================================
// Types
// ============================================================================

/**
 * Vault data structure returned from the StakeManager contract's getVault function
 * Maps directly to the VaultData struct in the smart contract
 */
export interface VaultData {
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
 * Enriched vault data with its contract address
 */
export interface VaultWithAddress {
  /** The vault contract address */
  address: Address
  /** Vault data from the contract, or null if fetch failed */
  data: VaultData | null
}

/**
 * Configuration options for the useAccountVaults hook
 */
export interface UseAccountVaultsOptions {
  /** Whether to enable the query. Defaults to true when wallet is connected */
  enabled?: boolean
  /** Cache duration in milliseconds. Default: 10000ms (10 seconds) */
  staleTime?: number
  /** Auto-refetch interval in milliseconds. Default: disabled */
  refetchInterval?: number
}

/**
 * Return type for the useAccountVaults hook
 */
export type UseAccountVaultsReturn = UseQueryResult<VaultWithAddress[], Error>

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_STALE_TIME = 10_000 // 10 seconds
const QUERY_KEY_PREFIX = 'accountVaults' as const

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Fetches vault addresses for a given account from the StakeManager contract
 *
 * @param config - Wagmi configuration
 * @param chainId - The chain ID to query
 * @param accountAddress - The account address to fetch vaults for
 * @returns Array of vault addresses owned by the account
 */
async function fetchVaultAddresses(
  config: ReturnType<typeof useConfig>,
  chainId: number,
  accountAddress: Address
): Promise<Address[]> {
  const addresses = await readContract(config, {
    chainId,
    address: STAKING_MANAGER.address,
    abi: stakingManagerAbi,
    functionName: 'getAccountVaults',
    args: [accountAddress],
  })

  return addresses as Address[]
}

/**
 * Fetches vault data for a specific vault address with error handling
 *
 * @param config - Wagmi configuration
 * @param chainId - The chain ID to query
 * @param vaultAddress - The vault address to fetch data for
 * @returns Vault data if successful, null if the request fails
 */
async function fetchVaultData(
  config: ReturnType<typeof useConfig>,
  chainId: number,
  vaultAddress: Address
): Promise<VaultData | null> {
  try {
    const data = await readContract(config, {
      chainId,
      address: STAKING_MANAGER.address,
      abi: stakingManagerAbi,
      functionName: 'getVault',
      args: [vaultAddress],
    })

    return data as VaultData
  } catch (error) {
    // Log error for debugging but don't throw - allows partial results
    console.error(
      `[useAccountVaults] Failed to fetch vault data for ${vaultAddress}:`,
      error instanceof Error ? error.message : String(error)
    )
    return null
  }
}

/**
 * Enriches a vault address with its data, creating a VaultWithAddress object
 *
 * @param config - Wagmi configuration
 * @param chainId - The chain ID to query
 * @param vaultAddress - The vault address to enrich
 * @returns VaultWithAddress object containing address and data (or null if fetch failed)
 */
async function enrichVaultAddress(
  config: ReturnType<typeof useConfig>,
  chainId: number,
  vaultAddress: Address
): Promise<VaultWithAddress> {
  const data = await fetchVaultData(config, chainId, vaultAddress)
  return { address: vaultAddress, data }
}

// ============================================================================
// Hook
// ============================================================================

/**
 * React Query hook to fetch all vaults owned by the connected wallet account
 *
 * **Features:**
 * - Fetches vault addresses from StakeManager contract
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
 *   const { data: vaults, isLoading, error } = useAccountVaults()
 *
 *   if (isLoading) return <Spinner />
 *   if (error) return <ErrorMessage error={error} />
 *
 *   return (
 *     <div>
 *       {vaults?.map((vault) =>
 *         vault.data ? (
 *           <VaultCard key={vault.address} address={vault.address} data={vault.data} />
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
 * const { data: vaults } = useAccountVaults({
 *   enabled: isConnected,
 *   staleTime: 30_000, // 30 seconds
 *   refetchInterval: 60_000, // 1 minute
 * })
 * ```
 */
export function useAccountVaults(
  options?: UseAccountVaultsOptions
): UseAccountVaultsReturn {
  const { address } = useAccount()
  const config = useConfig()
  const chainId = useChainId()

  return useQuery({
    queryKey: [QUERY_KEY_PREFIX, address, chainId] as const,
    queryFn: async (): Promise<VaultWithAddress[]> => {
      // Guard: Return empty array if no wallet is connected
      if (!address) {
        return []
      }

      // Step 1: Fetch all vault addresses for the account
      const vaultAddresses = await fetchVaultAddresses(config, chainId, address)

      // Step 2: Fetch detailed data for each vault in parallel
      const vaultsWithData = await Promise.all(
        vaultAddresses.map(vaultAddress =>
          enrichVaultAddress(config, chainId, vaultAddress)
        )
      )

      return vaultsWithData
    },
    enabled: options?.enabled ?? !!address,
    staleTime: options?.staleTime ?? DEFAULT_STALE_TIME,
    refetchInterval: options?.refetchInterval,
  })
}
