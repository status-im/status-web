import { useToast } from '@status-im/components'
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { type Address } from 'viem'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { readContract } from 'wagmi/actions'

import { CACHE_CONFIG, KARMA } from '~constants/index'

// ============================================================================
// Types
// ============================================================================

/**
 * Result data for karma balance query
 */
export interface KarmaBalanceData {
  /** The karma balance for the account */
  balance: bigint
  /** The account address that was queried */
  account: Address
}

/**
 * Options for karma balance query configuration
 */
export interface UseKarmaBalanceOptions {
  /**
   * Address to query balance for
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
 * Return type for useKarmaBalance hook
 */
export type UseKarmaBalanceReturn = UseQueryResult<KarmaBalanceData>

// ============================================================================
// Constants
// ============================================================================

const QUERY_KEY_PREFIX = 'karma-balance'

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Fetches the karma balance for a specific account
 *
 * @param config - Wagmi config instance
 * @param chainId - The chain ID to query on
 * @param account - The account address to query
 * @returns The karma balance as a bigint
 * @throws Error if the contract call fails
 */
async function fetchKarmaBalance(
  config: ReturnType<typeof useConfig>,
  chainId: number,
  account: Address
): Promise<bigint> {
  try {
    const result = (await readContract(config, {
      chainId,
      address: KARMA.address,
      abi: KARMA.abi,
      functionName: 'balanceOf',
      args: [account],
    })) as bigint

    return result
  } catch (error) {
    console.error(
      `Failed to fetch karma balance for ${account}:`,
      error instanceof Error ? error.message : String(error)
    )
    throw error
  }
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Query hook to fetch karma balance for an account
 *
 * Fetches the ERC20 balance from the Karma contract using the `balanceOf` function.
 * The balance is automatically refetched at regular intervals to keep data fresh.
 *
 * @param options - Query configuration options
 * @returns Query result with karma balance data
 *
 * @example
 * Basic usage (connected wallet)
 * ```tsx
 * function KarmaDisplay() {
 *   const { data, isLoading, error } = useKarmaBalance()
 *
 *   if (isLoading) return <div>Loading...</div>
 *   if (error) return <div>Error: {error.message}</div>
 *
 *   return <div>Balance: {data?.balance.toString()}</div>
 * }
 * ```
 *
 * @example
 * Query specific address
 * ```tsx
 * function UserKarmaDisplay({ userAddress }: { userAddress: Address }) {
 *   const { data } = useKarmaBalance({
 *     address: userAddress
 *   })
 *
 *   return <div>{data?.balance.toString()} KARMA</div>
 * }
 * ```
 *
 * @example
 * With custom refetch interval
 * ```tsx
 * function LiveKarmaBalance() {
 *   const { data } = useKarmaBalance({
 *     refetchInterval: 30000, // Refetch every 30 seconds
 *   })
 *
 *   return <div>{formatTokenAmount(data?.balance)} KARMA</div>
 * }
 * ```
 */
export function useKarmaBalance(
  options: UseKarmaBalanceOptions = {}
): UseKarmaBalanceReturn {
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

  // Use provided address or fall back to connected address
  const targetAddress = queryAddress ?? connectedAddress

  return useQuery<KarmaBalanceData>({
    queryKey: [QUERY_KEY_PREFIX, targetAddress, chainId] as const,
    queryFn: async (): Promise<KarmaBalanceData> => {
      if (!targetAddress) {
        throw new Error('No address provided')
      }

      try {
        const balance = await fetchKarmaBalance(config, chainId, targetAddress)

        return {
          balance,
          account: targetAddress,
        }
      } catch (error) {
        toast.negative(
          `Failed to fetch karma balance: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
        throw error
      }
    },
    enabled: enabled && !!targetAddress,
    staleTime,
    refetchInterval,
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30_000),
  })
}
