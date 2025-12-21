import { useReadContract } from 'wagmi'

import type { UseQueryResult } from '@tanstack/react-query'
import type { Vault } from '~constants/index'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for reading total assets of a pre-deposit vault
 */
export interface PreDepositTVLParams {
  vault: Vault
}

export type UsePreDepositTVLReturn = UseQueryResult<bigint | undefined>

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to read the total assets (TVL) for a pre-deposit vault.
 *
 * **Query Process:**
 * 1. Validates vault configuration
 * 2. Calls vault's `totalAssets` function
 * 3. Returns the total assets amount (in wei) held by the vault (which is a sum of deposits, assets moved to the strategy, and assets moved to the L2)
 *
 * @returns Query result with the following properties:
 * - `data`: Total assets amount in wei (bigint | undefined)
 * - `isLoading`: Whether the initial query is loading
 * - `isFetching`: Whether the query is fetching (initial or refetch)
 * - `isError`: Whether the query has errored
 * - `error`: Error object if the query failed
 * - `isSuccess`: Whether the query was successful
 * - `refetch`: Function to manually refetch
 * - `status`: Query status ('pending' | 'error' | 'success')
 *
 * @example
 * Basic usage
 * ```tsx
 * function VaultInfo() {
 *   const { data: totalAssets, isLoading } = usePreDepositTVL({ vault })
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   return (
 *     <div>
 *       Total Assets: {totalAssets ? formatUnits(totalAssets, 18) : '0'} tokens
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * With error handling
 * ```tsx
 * function VaultInfo() {
 *   const {
 *     data: totalAssets,
 *     isLoading,
 *     isError,
 *     error
 *   } = usePreDepositTVL({ vault })
 *
 *   if (isError) {
 *     return <div>Error: {error?.message}</div>
 *   }
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   return (
 *     <div>
 *       TVL: {totalAssets ? formatUnits(totalAssets, 18) : '0'} tokens
 *     </div>
 *   )
 * }
 * ```
 *
 */
export function usePreDepositTVL({
  vault,
}: PreDepositTVLParams): UsePreDepositTVLReturn {
  return useReadContract({
    abi: vault.abi,
    address: vault.address,
    chainId: vault.chainId,
    functionName: 'totalAssets',
    query: {
      enabled: vault !== null,
    },
  })
}
