import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import { useAccount, useChainId, useConfig, useWriteContract } from 'wagmi'
import { readContracts } from 'wagmi/actions'

import { FAUCET } from '~constants/index'

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
  /** Whether the account can claim tokens (hasn't hit daily limit) */
  canClaim: boolean
  /** Number of requests remaining for the account today */
  remainingRequests: bigint
  /** Whether the account has used the faucet today */
  hasUsedFaucet: boolean
  /** Amount of tokens actually used today */
  actualUsedToday: bigint
  /** Amount of tokens remaining for the account today */
  remainingAmount: bigint
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

export interface UseFaucetMutationOptions {
  amount?: bigint
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
  void,
  Error,
  UseFaucetMutationOptions,
  unknown
> {
  const { address } = useAccount()
  const { writeContract } = useWriteContract()
  const chainId = useChainId()
  const queryClient = useQueryClient()
  const { refetch: refetchFaucetQuery } = useFaucetQuery()

  return useMutation({
    mutationKey: [QUERY_KEY_PREFIX, 'request', address],
    mutationFn: async ({ amount }: UseFaucetMutationOptions) => {
      if (!address) {
        throw new Error('Wallet not connected')
      }

      return writeContract({
        account: address,
        address: FAUCET.address,
        abi: FAUCET.abi,
        functionName: 'requestTokens',
        args: [amount ?? 0n, address],
      })
    },
    onSuccess: () => {
      refetchFaucetQuery()
      // Invalidate faucet query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_PREFIX, address, chainId],
      })
    },
    onError: error => {
      console.error('Failed to request tokens:', error)
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
            abi: FAUCET.abi,
            functionName: 'DAILY_LIMIT',
          },
          {
            chainId,
            address: FAUCET.address,
            abi: FAUCET.abi,
            functionName: 'accountDailyRequests',
            args: [address],
          },
          {
            chainId,
            address: FAUCET.address,
            abi: FAUCET.abi,
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

      const now = Math.floor(Date.now() / 1000)

      // const remainingRequests = dailyLimit > accountDailyRequests
      const remainingAmount =
        accountResetTime <= now ? dailyLimit : dailyLimit - accountDailyRequests
      const actualUsedToday =
        accountResetTime <= now ? 0n : accountDailyRequests
      const hasUsedFaucet = actualUsedToday > 0n
      const canClaim = remainingAmount > 0n

      return {
        dailyLimit,
        accountDailyRequests,
        accountResetTime,
        hasUsedFaucet,
        actualUsedToday,
        remainingAmount,
        remainingRequests,
        canClaim,
      }
    },
    enabled: options?.enabled ?? !!address,
    refetchInterval: options?.refetchInterval ?? DEFAULT_REFETCH_INTERVAL,
  })
}
