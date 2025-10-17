import { useAccount, useReadContract } from 'wagmi'

import type { Vault } from '~constants/index'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for reading max deposit amount
 */
export interface MaxPreDepositValueParams {
  /** Vault to query max deposit for */
  vault: Vault
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to read the maximum deposit amount for a user in a pre-deposit vault.
 *
 * **Query Process:**
 * 1. Validates wallet connection
 * 2. Calls vault's `maxDeposit` function with user's address
 * 3. Returns the maximum amount (in wei) that can be deposited
 * 4. Automatically refetches when dependencies change
 *
 * @returns Query result with the following properties:
 * - `data`: Maximum deposit amount in wei (bigint | undefined)
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
 *   const { data: maxDeposit, isLoading } = useMaxPreDepositValue({ vault })
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   return (
 *     <div>
 *       Max deposit: {maxDeposit ? formatUnits(maxDeposit, 18) : '0'} tokens
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
 *     data: maxDeposit,
 *     isLoading,
 *     isError,
 *     error
 *   } = useMaxPreDepositValue({ vault })
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
 *       max={maxDeposit ? formatUnits(maxDeposit, 18) : '0'}
 *       placeholder="Enter amount"
 *     />
 *   )
 * }
 * ```
 *
 */
export function useMaxPreDepositValue({ vault }: MaxPreDepositValueParams) {
  const { address } = useAccount()

  return useReadContract({
    abi: vault.abi,
    address: vault.address,
    functionName: 'maxDeposit',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && vault !== null,
    },
  })
}
