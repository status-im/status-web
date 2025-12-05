import { useToast } from '@status-im/components'
import {
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'

import { clientEnv } from '~constants/env.client.mjs'

// Query client instance for invalidation outside of React components
let queryClientInstance: ReturnType<typeof useQueryClient> | null = null

// ============================================================================
// Types
// ============================================================================

/**
 * Current user data returned from the API
 */
export interface CurrentUser {
  /** User's Ethereum address */
  address: string
  /** List of connected sybil providers (e.g., 'POW') */
  connectedSybilProviders: string[]
  /** User's global position/rank */
  globalPosition: number
}

/**
 * API response wrapper for current user
 */
interface CurrentUserResponse {
  result: CurrentUser
}

/**
 * Options for the current user query hook
 */
export interface UseCurrentUserOptions {
  /** Whether to enable the query. Defaults to true */
  enabled?: boolean
  /** Refetch interval in milliseconds */
  refetchInterval?: number
}

// ============================================================================
// Constants
// ============================================================================

const QUERY_KEY_PREFIX = 'current-user' as const
const API_ENDPOINT = `${clientEnv.NEXT_PUBLIC_STATUS_NETWORK_API_URL}/auth/me`
const DEFAULT_REFETCH_INTERVAL = 60_000 // 60 seconds

// ============================================================================
// Hook
// ============================================================================

/**
 * Query hook to fetch the current authenticated user
 *
 * Fetches the current user data from the /auth/me endpoint.
 * Automatically refetches when the user signs in via SIWE.
 *
 * **Behavior:**
 * - Refetches automatically after SIWE authentication
 * - Uses session cookies for authentication
 * - Automatically refetches on a configurable interval
 *
 * @param options - Query configuration options
 * @returns Query result with current user data
 *
 * @example
 * Basic usage
 * ```tsx
 * function UserProfile() {
 *   const { data: user, isLoading } = useCurrentUser()
 *
 *   if (isLoading) return <Spinner />
 *   if (!user) return <div>Not authenticated</div>
 *
 *   return (
 *     <div>
 *       <p>Address: {user.address}</p>
 *       <p>Global Position: {user.globalPosition}</p>
 *       <p>Connected Providers: {user.connectedSybilProviders.join(', ')}</p>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * With custom options
 * ```tsx
 * const { data: user } = useCurrentUser({
 *   enabled: true,
 *   refetchInterval: 30_000, // Refetch every 30 seconds
 * })
 * ```
 */
export function useCurrentUser(
  options?: UseCurrentUserOptions
): UseQueryResult<CurrentUser, Error> {
  const queryClient = useQueryClient()
  const toast = useToast()
  // Store query client instance for invalidation outside of React components
  if (!queryClientInstance) {
    queryClientInstance = queryClient
  }

  return useQuery({
    queryKey: [QUERY_KEY_PREFIX] as const,
    queryFn: async (): Promise<CurrentUser> => {
      try {
        const response = await fetch(API_ENDPOINT, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(
            `Failed to fetch current user: ${response.statusText}`
          )
        }

        const data: CurrentUserResponse = await response.json()
        return data.result
      } catch (error) {
        toast.negative(
          `Failed to fetch current user: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
        throw error
      }
    },
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval ?? DEFAULT_REFETCH_INTERVAL,
  })
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Invalidates the current user query, forcing a refetch
 *
 * This function can be called from outside React components
 * to invalidate the current user cache after authentication changes.
 *
 * @example
 * ```ts
 * // After successful SIWE authentication
 * invalidateCurrentUser()
 * ```
 */
export function invalidateCurrentUser(): void {
  if (queryClientInstance) {
    queryClientInstance.invalidateQueries({
      queryKey: [QUERY_KEY_PREFIX],
    })
  }
}
