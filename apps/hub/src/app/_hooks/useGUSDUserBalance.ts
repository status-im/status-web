import { useCallback, useEffect } from 'react'

import { pad } from 'viem'
import { mainnet } from 'viem/chains'
import { useAccount, useReadContract } from 'wagmi'

import {
  BRIDGE_COORDINATOR_L1,
  STATUS_L2_CHAIN_NICKNAME,
} from '~constants/address'

// ============================================================================
// Types
// ============================================================================

export interface UseGUSDUserBalanceParams {
  /** Optional: callback to register refetch function for external triggering */
  registerRefetch?: (vaultId: string, refetch: () => void) => void
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Convert an address to bytes32 format for the BridgeCoordinator.
 * This pads the 20-byte address to 32 bytes (left-padded with zeros).
 */
export function addressToBytes32(address: `0x${string}`): `0x${string}` {
  return pad(address, { size: 32 })
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to read a user's GUSD pre-deposit balance from BridgeCoordinatorL1.
 *
 * Uses the coordinator's `getPredeposit()` function to get the user's
 * predeposited GUSD amount for the Status L2 chain.
 *
 * @returns Object with:
 * - `data`: User's predeposited GUSD in wei (18 decimals)
 * - `isLoading`: Whether the query is loading
 * - `refetch`: Function to manually refetch
 *
 * @example
 * ```tsx
 * const { data: gusdBalance, isLoading } = useGUSDUserBalance()
 *
 * if (isLoading) return <div>Loading...</div>
 *
 * return (
 *   <div>
 *     Your GUSD pre-deposit: {formatUnits(gusdBalance ?? 0n, 18)} GUSD
 *   </div>
 * )
 * ```
 */
export function useGUSDUserBalance({
  registerRefetch,
}: UseGUSDUserBalanceParams = {}) {
  const { address: ownerAddress } = useAccount()

  // Convert address to bytes32 for the coordinator
  const remoteRecipient = ownerAddress
    ? addressToBytes32(ownerAddress)
    : undefined

  const {
    data,
    isLoading,
    refetch: refetchBalance,
  } = useReadContract({
    address: BRIDGE_COORDINATOR_L1.address,
    abi: BRIDGE_COORDINATOR_L1.abi,
    functionName: 'getPredeposit',
    args:
      ownerAddress && remoteRecipient
        ? [STATUS_L2_CHAIN_NICKNAME, ownerAddress, remoteRecipient]
        : undefined,
    chainId: mainnet.id,
    query: {
      enabled: !!ownerAddress,
    },
  })

  const refetch = useCallback(() => {
    refetchBalance()
  }, [refetchBalance])

  useEffect(() => {
    registerRefetch?.('GUSD', refetch)
  }, [registerRefetch, refetch])

  return {
    data,
    isLoading,
    refetch,
  }
}
