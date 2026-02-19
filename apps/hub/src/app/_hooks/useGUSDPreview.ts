import { mainnet } from 'viem/chains'
import { useReadContract } from 'wagmi'

import { stablecoinVaultAbi } from '~constants/contracts'

import type { StablecoinToken } from '~constants/address'

// ============================================================================
// Types
// ============================================================================

export interface UseGUSDPreviewParams {
  /** The stablecoin being deposited */
  stablecoin: StablecoinToken
  /** Amount to deposit in wei (stablecoin decimals) */
  amount: bigint
  /** Whether the query should be enabled */
  enabled?: boolean
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to preview the GUSD output for a stablecoin deposit.
 *
 * Calls the stablecoin-specific vault's previewDeposit() function
 * to show users how many GUSD shares they'll receive.
 *
 * @returns Query result with:
 * - `data`: Expected GUSD shares in wei (18 decimals)
 * - `isLoading`: Whether the query is loading
 * - `refetch`: Function to manually refetch
 *
 * @example
 * ```tsx
 * const { data: previewShares } = useGUSDPreview({
 *   stablecoin: USDC_TOKEN,
 *   amount: parseUnits('100', 6), // 100 USDC
 * })
 *
 * // previewShares is in 18 decimals (GUSD)
 * const formatted = formatUnits(previewShares, 18) // "99.85"
 * ```
 */
export function useGUSDPreview({
  stablecoin,
  amount,
  enabled = true,
}: UseGUSDPreviewParams) {
  return useReadContract({
    address: stablecoin.vaultAddress,
    abi: stablecoinVaultAbi,
    functionName: 'previewDeposit',
    args: [amount],
    chainId: mainnet.id,
    query: {
      enabled: enabled && amount > 0n,
    },
  })
}
