import { mainnet } from 'viem/chains'
import { useReadContract } from 'wagmi'

import {
  BRIDGE_COORDINATOR_L1,
  STATUS_L2_CHAIN_NICKNAME,
} from '~constants/address'

import type { UseQueryResult } from '@tanstack/react-query'

// ============================================================================
// Types
// ============================================================================

export interface UseGUSDTVLParams {
  /** Whether the query should be enabled */
  enabled?: boolean
}

export type UseGUSDTVLReturn = UseQueryResult<bigint | undefined>

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to read the total GUSD pre-deposits (TVL) from BridgeCoordinatorL1.
 *
 * Uses the coordinator's `getTotalPredeposits()` function to get the
 * aggregate GUSD predeposited for the Status L2 chain.
 *
 * @returns Query result with:
 * - `data`: Total GUSD predeposited in wei (18 decimals)
 * - `isLoading`: Whether the query is loading
 * - `refetch`: Function to manually refetch
 *
 * @example
 * ```tsx
 * const { data: tvl, isLoading } = useGUSDTVL()
 *
 * if (isLoading) return <div>Loading...</div>
 *
 * return (
 *   <div>
 *     GUSD Vault TVL: {formatUnits(tvl ?? 0n, 18)} GUSD
 *   </div>
 * )
 * ```
 */
export function useGUSDTVL({
  enabled = true,
}: UseGUSDTVLParams = {}): UseGUSDTVLReturn {
  return useReadContract({
    address: BRIDGE_COORDINATOR_L1.address,
    abi: BRIDGE_COORDINATOR_L1.abi,
    functionName: 'getTotalPredeposits',
    args: [STATUS_L2_CHAIN_NICKNAME],
    chainId: mainnet.id,
    query: {
      enabled,
    },
  })
}
