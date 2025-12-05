import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import { useAccount } from 'wagmi'

import { clientEnv } from '~constants/env.client.mjs'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for claiming karma
 */
export interface ClaimKarmaParams {
  /** Token from the proof of work */
  token: string
}

/**
 * Response from claiming karma
 */
export interface ClaimKarmaResponse {
  /** Whether the claim was successful */
  result: {
    /** Result of the claim */
    success: boolean
  }
}

/**
 * Return type for useClaimKarma hook
 */
export type UseClaimKarmaReturn = UseMutationResult<
  ClaimKarmaResponse,
  Error,
  ClaimKarmaParams,
  unknown
>

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY = 'claim-karma' as const
const API_ENDPOINT = `${clientEnv.NEXT_PUBLIC_STATUS_NETWORK_API_URL}/sybil/connect-provider/pow`

// ============================================================================
// Hook
// ============================================================================

/**
 * Mutation hook to claim karma by connecting a proof of work provider
 *
 * **Claim Process:**
 * 1. Validates wallet connection
 * 2. Sends token to the sybil API
 * 3. Returns success status
 *
 * @returns Mutation result with claim function and status
 *
 * @throws {Error} When wallet is not connected
 * @throws {Error} When token is invalid or missing
 * @throws {Error} When API request fails
 *
 * @example
 * Basic usage
 * ```tsx
 * function ClaimKarmaButton() {
 *   const { mutate: claimKarma, isPending } = useClaimKarma()
 *
 *   const handleClaim = () => {
 *     claimKarma({ token: 'proof-of-work-token' })
 *   }
 *
 *   return (
 *     <button onClick={handleClaim} disabled={isPending}>
 *       {isPending ? 'Claiming...' : 'Claim Karma'}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * With callbacks
 * ```tsx
 * claimKarma(
 *   { token: 'proof-of-work-token' },
 *   {
 *     onSuccess: (data) => {
 *       if (data.success) {
 *         console.log('Karma claimed successfully!')
 *       }
 *     },
 *     onError: (error) => {
 *       console.error('Claim failed:', error)
 *     },
 *   }
 * )
 * ```
 */
export function useClaimKarma(): UseClaimKarmaReturn {
  const { address } = useAccount()
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MUTATION_KEY, address],
    mutationFn: async ({
      token,
    }: ClaimKarmaParams): Promise<ClaimKarmaResponse> => {
      // Validate wallet connection
      if (!address) {
        throw new Error(
          'Wallet not connected. Please connect your wallet first.'
        )
      }

      // Validate token
      if (!token || token.trim() === '') {
        throw new Error('Token is required')
      }

      // Make API request
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        throw new Error(`Failed to claim karma: ${response.statusText}`)
      }

      return response.json()
    },
    onSuccess: () => {
      // Invalidate current user query to refetch updated connectedSybilProviders
      queryClient.invalidateQueries({
        queryKey: ['current-user'],
      })
      // Invalidate karma balance query to refetch updated balance in KarmaOverviewCard
      queryClient.invalidateQueries({
        queryKey: ['karma-balance'],
      })
      // Invalidate karma rewards balance query to refetch updated rewards
      queryClient.invalidateQueries({
        queryKey: ['karma-rewards-balance'],
      })
    },
  })
}
