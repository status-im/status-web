import { useAccount, useReadContract } from 'wagmi'

import type { UseQueryResult } from '@tanstack/react-query'
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
}

export type UseUserVaultDepositReturn = UseQueryResult<bigint | undefined>

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to read a user's deposited assets in a pre-deposit vault.
 *
 * Uses the ERC4626 `maxWithdraw` function which returns the maximum amount
 * of underlying assets that can be withdrawn by the owner. This represents
 * the user's deposited balance converted to assets.
 *
 * @returns Query result with the following properties:
 * - `data`: User's deposited assets in wei (bigint | undefined)
 * - `isLoading`: Whether the initial query is loading
 * - `isFetching`: Whether the query is fetching (initial or refetch)
 * - `isError`: Whether the query has errored
 * - `error`: Error object if the query failed
 * - `isSuccess`: Whether the query was successful
 * - `refetch`: Function to manually refetch
 *
 * @example
 * Basic usage
 * ```tsx
 * function VaultInfo() {
 *   const { data: depositedBalance, isLoading } = useUserVaultDeposit({ vault })
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   return (
 *     <div>
 *       Deposited: {depositedBalance ? formatUnits(depositedBalance, 18) : '0'} tokens
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * With VaultCard
 * ```tsx
 * function VaultWithDeposit({ vault }) {
 *   const { data: depositedBalance } = useUserVaultDeposit({ vault })
 *
 *   return (
 *     <VaultCard
 *       vault={vault}
 *       depositedBalance={depositedBalance}
 *       onDeposit={() => {}}
 *     />
 *   )
 * }
 * ```
 */
export function useUserVaultDeposit({
  vault,
  userAddress,
}: UserVaultDepositParams): UseUserVaultDepositReturn {
  const { address: connectedAddress } = useAccount()
  const ownerAddress = userAddress ?? connectedAddress

  return useReadContract({
    abi: vault.abi,
    address: vault.address,
    chainId: vault.chainId,
    functionName: 'maxWithdraw',
    args: ownerAddress ? [ownerAddress] : undefined,
    query: {
      enabled: !!ownerAddress,
    },
  })
}
