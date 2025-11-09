import { useReadContract } from 'wagmi'

import type { Vault } from '~constants/index'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for reading Min deposit amount
 */
export interface MinPreDepositValueParams {
  /** Vault to query Min deposit for */
  vault: Vault
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to read the minimum deposit amount for a user in a pre-deposit vault.
 *
 * **Query Process:**
 * 1. Validates wallet connection
 * 2. Calls vault's `minDeposit` function with user's address
 * 3. Returns the minimum amount (in wei) that can be deposited
 * 4. Automatically refetches when dependencies change
 *
 * @returns Query result with the following properties:
 * - `data`: Minimum deposit amount in wei (bigint | undefined)
 * - `isLoading`: Whether the initial query is loading
 * - `isFetching`: Whether the query is fetching (initial or refetch)
 * - `isError`: Whether the query has errored
 * - `error`: Error object if the query failed
 * - `isSuccess`: Whether the query was successful
 * - `refetch`: Function to manually refetch
 * - `status`: Query status ('pending' | 'error' | 'success')
 *
 * @param params - Parameters including the vault to query
 *
 * @example
 * Basic usage
 * ```tsx
 * function DepositForm() {
 *   const { data: minDeposit, isLoading } = useMinPreDepositValue({ vault })
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   return (
 *     <div>
 *       Min deposit: {minDeposit ? formatUnits(minDeposit, 18) : '0'} tokens
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * With error handling
 * ```tsx
 * function DepositForm() {
 *   const {
 *     data: minDeposit,
 *     isLoading,
 *     isError,
 *     error
 *   } = useMinPreDepositValue({ vault })
 *
 *   if (isError) {
 *     return <div>Error: {error?.message}</div>
 *   }
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   return (
 *     <input
 *       type="number"
 *       min={minDeposit ? formatUnits(minDeposit, 18) : '0'}
 *       placeholder="Enter amount"
 *     />
 *   )
 * }
 * ```
 *
 */
export function useMinPreDepositValue({ vault }: MinPreDepositValueParams) {
  return useReadContract({
    abi: vault.abi,
    address: vault.address,
    functionName: 'minDepositAmount',
    query: {
      enabled: vault !== null,
    },
  })
}
