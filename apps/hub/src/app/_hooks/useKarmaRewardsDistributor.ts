import { useToast } from '@status-im/components'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { type Address } from 'viem'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { statusSepolia } from 'wagmi/chains'

import { CACHE_CONFIG, REWARDS } from '~constants/index'

// ============================================================================
// Types
// ============================================================================

/**
 * Result data for karma rewards balance query
 */
export interface KarmaRewardsBalanceData {
  /** The rewards balance for the account */
  balance: bigint
  /** The account address that was queried */
  account: Address
}

/**
 * Options for karma rewards balance query configuration
 */
export interface UseKarmaRewardsDistributorOptions {
  /**
   * Address to query rewards balance for
   * If not provided, uses the connected wallet address
   */
  address?: Address
  /**
   * Enable or disable the query
   * @default true
   */
  enabled?: boolean
  /**
   * Time in milliseconds until data is considered stale
   * @default 30000 (30 seconds)
   */
  staleTime?: number
  /**
   * Refetch interval in milliseconds
   * @default 60000 (60 seconds)
   */
  refetchInterval?: number
}

/**
 * Return type for useKarmaRewardsDistributor hook
 */
export type UseKarmaRewardsDistributorReturn =
  UseQueryResult<KarmaRewardsBalanceData>

// ============================================================================
// Constants
// ============================================================================

const QUERY_KEY_PREFIX = 'karma-rewards-balance'
const DEFAULT_BALANCE = 0n

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Fetches the karma rewards balance for a specific account
 *
 * @param config - Wagmi config instance
 * @param chainId - The chain ID to query on
 * @param account - The account address to query
 * @returns The karma rewards balance as a bigint
 * @throws Error if the contract call fails
 */
async function fetchKarmaRewardsBalance(
  config: ReturnType<typeof useConfig>,
  chainId: number,
  account: Address
): Promise<bigint> {
  try {
    const result = (await readContract(config, {
      chainId,
      address: REWARDS.address,
      abi: REWARDS.abi,
      functionName: 'rewardsBalanceOf',
      args: [account],
    })) as bigint

    return result
  } catch (error) {
    console.error(
      `Failed to fetch karma rewards balance for ${account}:`,
      error instanceof Error ? error.message : String(error)
    )
    throw error
  }
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Query hook to fetch karma rewards balance for an account
 *
 * Fetches the rewards balance from the Karma Rewards Distributor contract
 * using the `rewardsBalanceOf` function. The balance represents the amount
 * of karma rewards available for the account to claim.
 *
 * The balance is automatically refetched at regular intervals to keep data fresh.
 *
 * @param options - Query configuration options
 * @returns Query result with karma rewards balance data
 *
 * @example
 * Basic usage (connected wallet)
 * ```tsx
 * function RewardsDisplay() {
 *   const { data, isLoading, error } = useKarmaRewardsDistributor()
 *
 *   if (isLoading) return <div>Loading...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return <div>Rewards: {data?.balance.toString()}</div>
 * }
 * ```
 *
 * @example
 * Query specific address
 * ```tsx
 * function UserRewardsDisplay({ userAddress }: { userAddress: Address }) {
 *   const { data } = useKarmaRewardsDistributor({
 *     address: userAddress
 *   })
 *
 *   return <div>{data?.balance.toString()} rewards available</div>
 * }
 * ```
 *
 * @example
 * With custom refetch interval
 * ```tsx
 * function LiveRewardsBalance() {
 *   const { data } = useKarmaRewardsDistributor({
 *     refetchInterval: 30000, // Refetch every 30 seconds
 *   })
 *
 *   return <div>{formatTokenAmount(data?.balance)} rewards</div>
 * }
 * ```
 *
 * @example
 * Conditional query
 * ```tsx
 * function ClaimableRewards({ shouldFetch }: { shouldFetch: boolean }) {
 *   const { data } = useKarmaRewardsDistributor({
 *     enabled: shouldFetch
 *   })
 *
 *   return data?.balance > 0n ? (
 *     <button>Claim {data.balance.toString()} rewards</button>
 *   ) : null
 * }
 * ```
 */
export function useKarmaRewardsDistributor(
  options: UseKarmaRewardsDistributorOptions = {}
): UseKarmaRewardsDistributorReturn {
  const { address: connectedAddress } = useAccount()
  const config = useConfig()
  const chainId = useChainId()
  const toast = useToast()

  const {
    address: queryAddress,
    enabled = true,
    staleTime = CACHE_CONFIG.MP_STALE_TIME,
    refetchInterval = CACHE_CONFIG.MP_REFETCH_INTERVAL,
  } = options

  const targetAddress = queryAddress ?? connectedAddress
  const isStatusNetworkSepolia = chainId === statusSepolia.id

  return useQuery<KarmaRewardsBalanceData>({
    queryKey: [QUERY_KEY_PREFIX, targetAddress, statusSepolia.id] as const,
    queryFn: async (): Promise<KarmaRewardsBalanceData> => {
      if (!targetAddress) {
        return {
          balance: DEFAULT_BALANCE,
          account: '0x0' as Address,
        }
      }

      try {
        const balance = await fetchKarmaRewardsBalance(
          config,
          statusSepolia.id,
          targetAddress
        )

        return {
          balance,
          account: targetAddress,
        }
      } catch (error) {
        toast.negative(
          `Failed to fetch karma rewards balance: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
        throw error
      }
    },
    enabled: enabled && !!targetAddress && isStatusNetworkSepolia,
    staleTime,
    refetchInterval,
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30_000),
  })
}
