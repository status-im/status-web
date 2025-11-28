import { useReadContracts } from 'wagmi'

import type { UseQueryResult } from '@tanstack/react-query'
import type { Vault } from '~constants/index'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for reading total assets from multiple pre-deposit vaults
 */
export interface MultiplePreDepositTVLParams {
  vaults: Vault[]
}

export type UseMultiplePreDepositTVLReturn = UseQueryResult<
  (bigint | undefined)[] | undefined
>

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to read the total assets (TVL) for multiple pre-deposit vaults in parallel.
 *
 * **Query Process:**
 * 1. Validates vault configurations
 * 2. Calls each vault's `totalAssets` function in parallel
 * 3. Returns the total assets amount (in wei) for each vault
 * 4. Automatically refetches when dependencies change
 *
 */

export function useMultiplePreDepositTVL({
  vaults,
}: MultiplePreDepositTVLParams): UseMultiplePreDepositTVLReturn {
  const contracts = vaults.map(vault => ({
    abi: vault.abi,
    address: vault.address,
    chainId: vault.chainId,
    functionName: 'totalAssets' as const,
  }))

  return useReadContracts({
    contracts,
    query: {
      enabled: vaults.length > 0,
    },
  })
}
