import { useCallback, useEffect } from 'react'

import { useAccount, useReadContract } from 'wagmi'

import type { Vault } from '~constants/index'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for reading user's deposited assets in a pre-deposit vault
 */
export interface UserVaultDepositParams {
  vault: Vault
  /** Optional: override the user address (defaults to connected wallet) */
  userAddress?: `0x${string}`
  /** Optional: callback to register refetch function for external triggering */
  registerRefetch?: (vaultId: string, refetch: () => void) => void
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to read a user's deposited assets in a pre-deposit vault.
 *
 * Uses the ERC4626 `balanceOf` to get vault shares, then `convertToAssets`
 * to convert shares to the underlying asset amount. This works even when
 * the vault is in a state that doesn't allow withdrawals (maxWithdraw = 0).
 *
 * @returns Object with:
 * - `data`: User's deposited assets in wei (bigint | undefined)
 * - `shares`: User's vault shares (bigint | undefined)
 * - `isLoading`: Whether the query is loading
 * - `refetch`: Function to manually refetch
 */
export function useUserVaultDeposit({
  vault,
  userAddress,
  registerRefetch,
}: UserVaultDepositParams) {
  const { address: connectedAddress } = useAccount()
  const ownerAddress = userAddress ?? connectedAddress

  const {
    data: shares,
    isLoading: isLoadingShares,
    refetch: refetchShares,
  } = useReadContract({
    abi: vault.abi,
    address: vault.address,
    chainId: vault.chainId,
    functionName: 'balanceOf',
    args: ownerAddress ? [ownerAddress] : undefined,
    query: {
      enabled: !!ownerAddress,
    },
  })

  const {
    data: assets,
    isLoading: isLoadingAssets,
    refetch: refetchAssets,
  } = useReadContract({
    abi: vault.abi,
    address: vault.address,
    chainId: vault.chainId,
    functionName: 'convertToAssets',
    args: shares !== undefined ? [shares] : undefined,
    query: {
      enabled: shares !== undefined && shares > 0n,
    },
  })

  const data = shares === 0n ? 0n : assets

  const refetch = useCallback(() => {
    refetchShares()
    refetchAssets()
  }, [refetchShares, refetchAssets])

  useEffect(() => {
    registerRefetch?.(vault.id, refetch)
  }, [vault.id, registerRefetch, refetch])

  return {
    data,
    shares,
    isLoading: isLoadingShares || isLoadingAssets,
    refetch,
  }
}
