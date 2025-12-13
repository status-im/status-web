import { formatUnits } from 'viem'

import { useMultipleExchangeRates } from './useMultipleExchangeRates'
import { useMultiplePreDepositTVL } from './useMultiplePreDepositTVL'

import type { Vault } from '~constants/index'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for reading TVL in USD for multiple pre-deposit vaults
 */
export interface MultiplePreDepositTVLInUSDParams {
  vaults: Vault[]
}

/**
 * TVL data in USD for a single vault
 */
export interface VaultTVLInUSDData {
  vault: Vault
  tvlUSD: number | null
  totalAssets: bigint | null
  exchangeRate: number | null
  error: Error | null
}

/**
 * Combined TVL data for multiple vaults
 */
export interface MultipleVaultTVLInUSDData {
  vaults: VaultTVLInUSDData[]
  totalTVLUSD: number
}

/**
 * Return type for useMultiplePreDepositTVLInUSD hook
 */
export interface UseMultiplePreDepositTVLInUSDReturn {
  data: MultipleVaultTVLInUSDData | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
  isFetching: boolean
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to read the total assets (TVL) for multiple pre-deposit vaults in USD value.
 *
 * This hook combines useMultiplePreDepositTVL with useMultipleExchangeRates
 * to provide TVL data converted to USD using live exchange rates, plus a total
 * TVL across all vaults.
 *
 * @returns Combined TVL data with loading states
 *
 * @example
 * Basic usage
 * ```tsx
 * function VaultsDashboard() {
 *   const { data: tvlData, isLoading } = useMultiplePreDepositTVLInUSD({
 *     vaults: [vault1, vault2, vault3]
 *   })
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   return (
 *     <div>
 *       <h2>Total TVL: ${tvlData?.totalTVLUSD.toLocaleString()}</h2>
 *       {tvlData?.vaults.map((vaultData) => (
 *         <div key={vaultData.vault.address}>
 *           {vaultData.vault.name}: ${vaultData.tvlUSD?.toLocaleString() ?? 'Error'}
 *         </div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useMultiplePreDepositTVLInUSD({
  vaults,
}: MultiplePreDepositTVLInUSDParams): UseMultiplePreDepositTVLInUSDReturn {
  const tokens = vaults.map(vault => vault.token.symbol)

  const tvlQuery = useMultiplePreDepositTVL({ vaults })
  const exchangeRatesQuery = useMultipleExchangeRates({ tokens })

  let data: MultipleVaultTVLInUSDData | undefined = undefined

  if (tvlQuery.data && exchangeRatesQuery.data) {
    const vaultsData: VaultTVLInUSDData[] = vaults.map((vault, index) => {
      const totalAssets = tvlQuery.data?.[index]
      const exchangeRateData = exchangeRatesQuery?.data?.get(vault.token.symbol)
      const exchangeRate = exchangeRateData?.price

      let tvlUSD: number | null = null

      if (totalAssets && exchangeRate) {
        const tokenAmount = Number(
          formatUnits(totalAssets, vault.token.decimals)
        )
        tvlUSD = tokenAmount * exchangeRate
      }

      return {
        vault,
        tvlUSD,
        totalAssets: totalAssets || null,
        exchangeRate: exchangeRate || null,
        error: null,
      }
    })

    const totalTVLUSD = vaultsData.reduce((sum, vaultData) => {
      return sum + (vaultData.tvlUSD || 0)
    }, 0)

    data = {
      vaults: vaultsData,
      totalTVLUSD,
    }
  }

  const isLoading = tvlQuery.isLoading || exchangeRatesQuery.isLoading
  const isError = tvlQuery.isError || exchangeRatesQuery.isError
  const error = tvlQuery.error || exchangeRatesQuery.error
  const isFetching = tvlQuery.isFetching || exchangeRatesQuery.isFetching

  return {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  }
}
