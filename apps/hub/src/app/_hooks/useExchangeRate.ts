import { useQuery } from '@tanstack/react-query'

// ============================================================================
// Types
// ============================================================================

/**
 * Exchange rate data for SNT/USDT pair
 */
export interface ExchangeRateData {
  /** Exchange rate price (SNT in USDT) */
  price: number
  /** Timestamp when the rate was fetched */
  timestamp: number
}

/**
 * Options for exchange rate query configuration
 */
export interface UseExchangeRateOptions {
  /**
   * Enable or disable the query
   * @default true
   */
  enabled?: boolean
  /**
   * Refetch interval in milliseconds
   * @default 60000 (1 minute)
   */
  refetchInterval?: number
  /**
   * Time in milliseconds until data is considered stale
   * @default 30000 (30 seconds)
   */
  staleTime?: number
}

/**
 * Return type for useExchangeRate hook
 */
export type UseExchangeRateReturn = ReturnType<typeof useExchangeRate>

// ============================================================================
// Constants
// ============================================================================

const QUERY_KEY_PREFIX = 'exchangeRate'
const BINANCE_API_URL =
  'https://api.binance.com/api/v3/ticker/price?symbol=SNTUSDT'
const DEFAULT_REFETCH_INTERVAL = 60_000 // 1 minute
const DEFAULT_STALE_TIME = 30_000 // 30 seconds

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Fetches the current SNT/USDT exchange rate from Binance
 *
 * @returns Exchange rate data with price and timestamp
 * @throws Error if the API request fails or returns invalid data
 */
async function fetchExchangeRate(): Promise<ExchangeRateData> {
  const response = await fetch(BINANCE_API_URL)

  if (!response.ok) {
    throw new Error(
      `Failed to fetch exchange rate: ${response.status} ${response.statusText}`
    )
  }

  const data = await response.json()

  if (!data.price) {
    throw new Error('Invalid response from Binance API: missing price')
  }

  const price = parseFloat(data.price)

  if (isNaN(price)) {
    throw new Error(`Invalid price value: ${data.price}`)
  }

  return {
    price,
    timestamp: Date.now(),
  }
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to fetch and cache the current SNT/USDT exchange rate
 *
 * Automatically refetches the rate at regular intervals to keep data fresh.
 * Provides loading, error, and success states via React Query.
 *
 * @param options - Query configuration options
 * @returns React Query result with exchange rate data
 *
 * @example
 * ```tsx
 * function PriceDisplay() {
 *   const { data, isLoading, error } = useExchangeRate()
 *
 *   if (isLoading) return <div>Loading price...</div>
 *   if (error) return <div>Failed to load price</div>
 *
 *   return <div>1 SNT = ${data.price.toFixed(6)} USDT</div>
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Custom refetch interval
 * function LivePrice() {
 *   const { data } = useExchangeRate({
 *     refetchInterval: 30000, // Refetch every 30 seconds
 *   })
 *
 *   return <div>${data?.price.toFixed(6)}</div>
 * }
 * ```
 */
export function useExchangeRate(options: UseExchangeRateOptions = {}) {
  const {
    enabled = true,
    refetchInterval = DEFAULT_REFETCH_INTERVAL,
    staleTime = DEFAULT_STALE_TIME,
  } = options

  return useQuery({
    queryKey: [QUERY_KEY_PREFIX] as const,
    queryFn: fetchExchangeRate,
    enabled,
    refetchInterval,
    staleTime,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  })
}
