import { useQueries } from '@tanstack/react-query'

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
  data: Map<TokenSymbol, ExchangeRateData | undefined> | undefined
  results: TokenExchangeRateResult[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  isFetching: boolean
}

// ============================================================================
// Constants
// ============================================================================

const QUERY_KEY_PREFIX = 'exchangeRate'
const BINANCE_API_BASE_URL = 'https://api.binance.com/api/v3/ticker/price'
const DEFAULT_REFETCH_INTERVAL = 60_000 // 1 minute
const DEFAULT_STALE_TIME = 30_000 // 30 seconds
const QUOTE_TOKEN = 'USDT'

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Formats a token symbol for Binance (e.g., SNTUSDT, ETHUSDT)
 */
function formatSymbol(token: string): string {
  return `${token.toUpperCase()}${QUOTE_TOKEN}`
}

/**
 * Fetches the current exchange rate for a token in USDT from Binance
 */
async function fetchExchangeRate(token: string): Promise<ExchangeRateData> {
  const symbol = formatSymbol(token)
  const url = `${BINANCE_API_BASE_URL}?symbol=${symbol}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch exchange rate for ${symbol}: ${response.status} ${response.statusText}`
    )
  }

  const data = await response.json()

  if (!data.price) {
    throw new Error(
      `Invalid response from Binance API: missing price for ${symbol}`
    )
  }

  const price = parseFloat(data.price)

  if (isNaN(price)) {
    throw new Error(`Invalid price value for ${symbol}: ${data.price}`)
  }

  return {
    price,
    timestamp: Date.now(),
    token,
  }
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to fetch multiple exchange rates in parallel using useQueries
 *
 * @returns Combined exchange rate data and loading states
 *
 * @example
 * ```tsx
 * function PriceDisplay() {
 *   const { data: rates, isLoading } = useMultipleExchangeRates({
 *     tokens: ['SNT', 'ETH', 'LINEA']
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

  const queries = useQueries({
    queries: tokens.map(token => ({
      queryKey: [QUERY_KEY_PREFIX, token] as const,
      queryFn: async () => await fetchExchangeRate(token),
      enabled,
      refetchInterval,
      staleTime,
      retry: 3,
      retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, DEFAULT_STALE_TIME),
    })),
  })

  const results: TokenExchangeRateResult[] = queries.map((query, index) => ({
    token: tokens[index],
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }))

  const data = queries.every(q => q.data)
    ? new Map(results.map(result => [result.token, result.data]))
    : undefined

  const isLoading = queries.some(q => q.isLoading)
  const isError = queries.some(q => q.isError)
  const error = queries.find(q => q.error)?.error || null
  const isFetching = queries.some(q => q.isFetching)

  return {
    data,
    results,
    isLoading,
    isError,
    error,
    isFetching,
  }
}
