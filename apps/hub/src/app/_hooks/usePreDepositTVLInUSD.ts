import { formatUnits } from 'viem'

import { useExchangeRate } from './useExchangeRate'
import { usePreDepositTVL } from './usePreDepositTVL'

import type { Vault } from '~constants/index'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for reading TVL in USD for a pre-deposit vault
 */
export interface PreDepositTVLInUSDParams {
  vault: Vault
}

/**
 * TVL data in USD
 */
export interface TVLInUSDData {
  /** TVL in USD */
  tvlUSD: number
  /** Raw total assets in wei */
  totalAssets: bigint
  /** Exchange rate used for conversion */
  exchangeRate: number
}

export interface UsePreDepositTVLInUSDReturn {
  data: TVLInUSDData | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  isFetching: boolean
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to read the total assets (TVL) for a pre-deposit vault in USD value.
 *
 * This hook combines usePreDepositTVL and useExchangeRate to provide TVL data
 * converted to USD using live exchange rates.
 *
 * **Query Process:**
 * 1. Fetches vault's total assets via totalAssets function
 * 2. Fetches live exchange rate for the token
 * 3. Converts total assets to USD value
 * 4. Returns combined data with proper loading/error states
 *
 * @returns Query result maintaining useQuery interface with TVL in USD
 *
 * @example
 * Basic usage
 * ```tsx
 * function VaultInfo() {
 *   const { data: tvlData, isLoading } = usePreDepositTVLInUSD({
 *     vault
 *   })
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   return (
 *     <div>
 *       TVL: ${tvlData?.tvlUSD.toLocaleString()}
 *       <br />
 *       Rate: ${tvlData?.exchangeRate}
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
 *     data: tvlData,
 *     isLoading,
 *     isError,
 *     error
 *   } = usePreDepositTVLInUSD({ vault })
 *
 *   if (isError) {
 *     return <div>Error: {error?.message}</div>
 *   }
 *
 *   if (isLoading) return <div>Loading TVL...</div>
 *
 *   return (
 *     <div>
 *       <h3>{vault.name}</h3>
 *       <p>TVL: ${tvlData?.tvlUSD.toFixed(2)}</p>
 *       <p>Total Assets: {formatUnits(tvlData?.totalAssets || 0n, 18)} {tvlData?.tokenSymbol}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function usePreDepositTVLInUSD({
  vault,
}: PreDepositTVLInUSDParams): UsePreDepositTVLInUSDReturn {
  const tvlQuery = usePreDepositTVL({ vault })
  const exchangeRateQuery = useExchangeRate({
    token: vault.token.priceKey || vault.token.symbol,
  })

  let data: TVLInUSDData | undefined = undefined

  if (tvlQuery.data && exchangeRateQuery.data) {
    const tokenAmount = Number(formatUnits(tvlQuery.data, vault.token.decimals))
    const tvlUSD = tokenAmount * exchangeRateQuery.data.price

    data = {
      tvlUSD,
      totalAssets: tvlQuery.data,
      exchangeRate: exchangeRateQuery.data.price,
    }
  }

  const isLoading = tvlQuery.isLoading || exchangeRateQuery.isLoading
  const isError = tvlQuery.isError || exchangeRateQuery.isError
  const error = tvlQuery.error || exchangeRateQuery.error
  const isFetching = tvlQuery.isFetching || exchangeRateQuery.isFetching

  return {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  }
}
