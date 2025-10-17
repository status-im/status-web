import { useQuery } from '@tanstack/react-query'

// ============================================================================
// Types
// ============================================================================

/**
 * Supported tokens
 * for the time being it's not strict but could be
 */
export type TokenSymbol = 'SNT' | 'ETH' | 'LINEA' | 'BTC' | string

/**
 * Exchange rate data for a token priced in USDT
 */
export interface ExchangeRateData {
  /** Exchange rate price in USDT */
  price: number
  /** Timestamp when the rate was fetched */
  timestamp: number
  /** The token symbol */
  token: string
}

/**
 * Options for exchange rate query configuration
 */
export interface UseExchangeRateOptions {
  /**
   * Token symbol to fetch exchange rate for
   * @default 'SNT'
   */
  token?: TokenSymbol
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
const BINANCE_API_BASE_URL = 'https://api.binance.com/api/v3/ticker/price'
const DEFAULT_REFETCH_INTERVAL = 60_000 // 1 minute
const DEFAULT_STALE_TIME = 30_000 // 30 seconds
const DEFAULT_TOKEN = 'SNT'
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
 *
 * @param token - The token symbol to fetch the rate for
 * @returns Exchange rate data with price and timestamp
 * @throws Error if the API request fails or returns invalid data
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
 * Hook to fetch and cache exchange rates for any token priced in USDT
 *
 * Automatically refetches the rate at regular intervals to keep data fresh.
 * Provides loading, error, and success states via React Query.
 *
 * @param options - Query configuration options
 * @returns React Query result with exchange rate data
 *
 * @example
 * ```tsx
 * // Default SNT/USDT
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
 * // ETH/USDT
 * function EthPrice() {
 *   const { data } = useExchangeRate({ token: 'ETH' })
 *
 *   return <div>1 ETH = ${data?.price.toFixed(2)} USDT</div>
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Multiple tokens
 * function MultiPriceDisplay() {
 *   const snt = useExchangeRate({ token: 'SNT' })
 *   const eth = useExchangeRate({ token: 'ETH' })
 *   const linea = useExchangeRate({ token: 'LINEA' })
 *
 *   return (
 *     <div>
 *       <div>SNT: ${snt.data?.price.toFixed(6)}</div>
 *       <div>ETH: ${eth.data?.price.toFixed(2)}</div>
 *       <div>LINEA: ${linea.data?.price.toFixed(6)}</div>
 *     </div>
 *   )
 * }
 * ```
 */
export function useExchangeRate(options: UseExchangeRateOptions = {}) {
  const {
    token = DEFAULT_TOKEN,
    enabled = true,
    refetchInterval = DEFAULT_REFETCH_INTERVAL,
    staleTime = DEFAULT_STALE_TIME,
  } = options

  return useQuery({
    queryKey: [QUERY_KEY_PREFIX, token] as const,
    queryFn: () => fetchExchangeRate(token),
    enabled,
    refetchInterval,
    staleTime,
    retry: 3,
    retryDelay: attemptIndex =>
      Math.min(1000 * 2 ** attemptIndex, DEFAULT_STALE_TIME),
  })
}
