import { useQuery } from '@tanstack/react-query'

import { clientEnv } from '~constants/env.client.mjs'

import type {
  ExchangeRateData,
  TokenSymbol,
  UseExchangeRateOptions,
} from './useExchangeRate'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for fetching multiple exchange rates
 */
export interface UseMultipleExchangeRatesParams {
  tokens: TokenSymbol[]
  options?: Omit<UseExchangeRateOptions, 'token'>
}

/**
 * Exchange rate result for a specific token
 */
export interface TokenExchangeRateResult {
  token: TokenSymbol
  data: ExchangeRateData | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
}

/**
 * Return type for useMultipleExchangeRates hook
 */
export interface UseMultipleExchangeRatesReturn {
  data: Map<TokenSymbol, ExchangeRateData> | undefined
  results: TokenExchangeRateResult[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  isFetching: boolean
}

// ============================================================================
// Constants
// ============================================================================

const QUERY_KEY_PREFIX = 'exchangeRates'
const API_BASE_URL = clientEnv.NEXT_PUBLIC_STATUS_API_URL
const DEFAULT_REFETCH_INTERVAL = 60_000 // 1 minute
const DEFAULT_STALE_TIME = 30_000 // 30 seconds

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Fetches exchange rates for multiple tokens in a single API call
 */
async function fetchMultipleExchangeRates(
  tokens: string[]
): Promise<Map<string, ExchangeRateData>> {
  const url = new URL(`${API_BASE_URL}/api/trpc/market.tokenPrice`)
  url.searchParams.set('input', JSON.stringify({ json: { symbols: tokens } }))

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch exchange rates: ${response.status} ${response.statusText}`
    )
  }

  const data = await response.json()

  // tRPC response structure: { result: { data: { json: { TOKEN: { usd, ... } } } } }
  const prices = data?.result?.data?.json

  const pricesMap = new Map<string, ExchangeRateData>()
  const timestamp = Date.now()

  for (const token of tokens) {
    const tokenPrice = prices?.[token]

    if (tokenPrice?.usd !== undefined && !isNaN(tokenPrice.usd)) {
      pricesMap.set(token, {
        price: tokenPrice.usd,
        priceChange24h: tokenPrice.usd_24h_change,
        timestamp,
        token,
      })
    }
  }

  return pricesMap
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to fetch multiple exchange rates in a single API call
 *
 * More efficient than calling useExchangeRate multiple times as it batches
 * all token requests into a single API call.
 *
 * @returns Combined exchange rate data and loading states
 *
 * @example
 * ```tsx
 * function PriceDisplay() {
 *   const { data: rates, isLoading } = useMultipleExchangeRates({
 *     tokens: ['SNT', 'ETH', 'BTC']
 *   })
 *
 *   if (isLoading) return <div>Loading...</div>
 *
 *   return (
 *     <div>
 *       {rates && Array.from(rates.entries()).map(([token, rate]) => (
 *         <div key={token}>{token}: ${rate.price}</div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useMultipleExchangeRates({
  tokens,
  options = {},
}: UseMultipleExchangeRatesParams): UseMultipleExchangeRatesReturn {
  const {
    enabled = true,
    refetchInterval = DEFAULT_REFETCH_INTERVAL,
    staleTime = DEFAULT_STALE_TIME,
  } = options

  const query = useQuery({
    queryKey: [QUERY_KEY_PREFIX, ...tokens.sort()] as const,
    queryFn: () => fetchMultipleExchangeRates(tokens),
    enabled: enabled && tokens.length > 0,
    refetchInterval,
    staleTime,
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, DEFAULT_STALE_TIME),
  })

  // Build results array for backwards compatibility
  const results: TokenExchangeRateResult[] = tokens.map(token => ({
    token,
    data: query.data?.get(token),
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }))

  return {
    data: query.data,
    results,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
  }
}
