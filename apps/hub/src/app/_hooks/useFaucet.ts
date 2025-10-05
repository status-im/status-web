import {
  useMutation,
  type UseMutationResult,
  useQuery,
  type UseQueryResult,
} from '@tanstack/react-query'
import { useAccount, useChainId, useConfig, useWriteContract } from 'wagmi'
import { readContracts } from 'wagmi/actions'

import { FAUCET } from '../../config'
import { faucetAbi } from '../contracts'

import type { Address } from 'viem'

// ============================================================================
// Types
// ============================================================================

/**
 * Faucet data returned from contract queries
 */
export interface FaucetData {
  /** Daily token request limit for each account */
  dailyLimit: bigint
  /** Number of requests made by the account today */
  accountDailyRequests: bigint
  /** Unix timestamp when the account's daily limit resets */
  accountResetTime: bigint
}

/**
 * Derived faucet state information
 */
export interface FaucetState extends FaucetData {
  /** Whether the account can request tokens (hasn't hit daily limit) */
  canRequest: boolean
  /** Number of requests remaining for the account today */
  remainingRequests: bigint
  /** Time until the daily limit resets (in seconds) */
  timeUntilReset: number
}

/**
 * Options for the faucet query hook
 */
export interface UseFaucetQueryOptions {
  /** Whether to enable the query. Defaults to when address is available */
  enabled?: boolean
  /** Refetch interval in milliseconds */
  refetchInterval?: number
}

// ============================================================================
// Constants
// ============================================================================

const QUERY_KEY_PREFIX = 'faucet' as const
const DEFAULT_REFETCH_INTERVAL = 30_000 // 30 seconds

// ============================================================================
// Mutation Hook
// ============================================================================

/**
 * Mutation hook to request tokens from the faucet
 *
 * @returns Mutation result with requestTokens function
 *
 * @throws {Error} When wallet is not connected
 *
 * @example
 * ```tsx
 * function FaucetButton() {
 *   const { mutate: requestTokens, isPending } = useFaucetMutation()
 *
 *   return (
 *     <button onClick={() => requestTokens()} disabled={isPending}>
 *       {isPending ? 'Requesting...' : 'Request Tokens'}
 *     </button>
 *   )
 * }
 * ```
 */
export function useFaucetMutation(): UseMutationResult<
  Address,
  Error,
  void,
  unknown
> {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()

  return useMutation({
    mutationKey: [QUERY_KEY_PREFIX, 'request', address],
    mutationFn: async (): Promise<Address> => {
      if (!address) {
        throw new Error('Wallet not connected')
      }

      const hash = await writeContractAsync({
        address: FAUCET.address,
        abi: faucetAbi,
        functionName: 'requestTokens',
        args: [address],
      })

      return hash
    },
  })
}

// ============================================================================
// Query Hook
// ============================================================================

/**
 * Query hook to fetch faucet data for the connected account
 *
 * Fetches:
 * - Daily token request limit
 * - Number of requests made by the account today
 * - Reset time for the account's daily limit
 *
 * @param options - Query configuration options
 * @returns Query result with faucet state data
 *
 * @example
 * ```tsx
 * function FaucetInfo() {
 *   const { data, isLoading } = useFaucetQuery()
 *
 *   if (isLoading) return <Spinner />
 *   if (!data) return null
 *
 *   return (
 *     <div>
 *       <p>Requests remaining: {data.remainingRequests.toString()}</p>
 *       <p>Can request: {data.canRequest ? 'Yes' : 'No'}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useFaucetQuery(
  options?: UseFaucetQueryOptions
): UseQueryResult<FaucetState, Error> {
  const config = useConfig()
  const { address } = useAccount()
  const chainId = useChainId()

  return useQuery({
    queryKey: [QUERY_KEY_PREFIX, address, chainId] as const,
    queryFn: async (): Promise<FaucetState> => {
      if (!address) {
        throw new Error('Wallet not connected')
      }

      const results = await readContracts(config, {
        contracts: [
          {
            chainId,
            address: FAUCET.address,
            abi: faucetAbi,
            functionName: 'DAILY_LIMIT',
          },
          {
            chainId,
            address: FAUCET.address,
            abi: faucetAbi,
            functionName: 'accountDailyRequests',
            args: [address],
          },
          {
            chainId,
            address: FAUCET.address,
            abi: faucetAbi,
            functionName: 'accountResetTime',
            args: [address],
          },
        ],
      })

      // Extract results with proper error handling
      const [dailyLimitResult, requestsResult, resetTimeResult] = results

      if (dailyLimitResult.status === 'failure') {
        throw new Error('Failed to fetch daily limit')
      }
      if (requestsResult.status === 'failure') {
        throw new Error('Failed to fetch account requests')
      }
      if (resetTimeResult.status === 'failure') {
        throw new Error('Failed to fetch reset time')
      }

      // Type-safe extraction of results
      const dailyLimit = dailyLimitResult.result as bigint
      const accountDailyRequests = requestsResult.result as bigint
      const accountResetTime = resetTimeResult.result as bigint

      // Calculate derived state
      const remainingRequests =
        dailyLimit > accountDailyRequests
          ? dailyLimit - accountDailyRequests
          : 0n
      const canRequest = remainingRequests > 0n

      const now = Math.floor(Date.now() / 1000)
      const resetTimestamp = Number(accountResetTime)
      const timeUntilReset = Math.max(0, resetTimestamp - now)

      return {
        dailyLimit,
        accountDailyRequests,
        accountResetTime,
        canRequest,
        remainingRequests,
        timeUntilReset,
      }
    },
    enabled: options?.enabled ?? !!address,
    refetchInterval: options?.refetchInterval ?? DEFAULT_REFETCH_INTERVAL,
  })
}
