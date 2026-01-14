import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

import { clientEnv } from '~constants/env.client.mjs'

// ============================================================================
// Types
// ============================================================================

/**
 * Supported tokens
 * for the time being it's not strict but could be
 */
export type TokenSymbol = 'SNT' | 'ETH' | 'LINEA' | 'BTC' | string

/**
 * Exchange rate data for a token priced in USD
 */
export interface ExchangeRateData {
  /** Exchange rate price in USD */
  price: number
  /** 24h price change percentage */
  priceChange24h?: number
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
const API_BASE_URL = clientEnv.NEXT_PUBLIC_STATUS_API_URL
const DEFAULT_REFETCH_INTERVAL = 60_000 // 1 minute
const DEFAULT_STALE_TIME = 30_000 // 30 seconds
const DEFAULT_TOKEN = 'SNT'

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Fetches the current exchange rate for a token in USD from the market API
 *
 * @param token - The token symbol to fetch the rate for
 * @param t - Translation function
 * @returns Exchange rate data with price and timestamp
 * @throws Error if the API request fails or returns invalid data
 */
async function fetchExchangeRate(
  token: string,
  t: ReturnType<typeof useTranslations>
): Promise<ExchangeRateData> {
  const url = new URL(`${API_BASE_URL}/api/trpc/market.tokenPrice`)
  url.searchParams.set('input', JSON.stringify({ json: { symbols: [token] } }))

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(
      t('errors.failed_fetch_exchange_rate', {
        token,
        status: response.status.toString(),
        statusText: response.statusText,
      })
    )
  }

  const body = await response.json()

  const tokenPrice = body?.result?.data?.json?.[token]

  if (tokenPrice?.usd === undefined || tokenPrice?.usd === null) {
    throw new Error(t('errors.invalid_market_api_response', { token }))
  }

  if (isNaN(tokenPrice.usd)) {
    throw new Error(
      t('errors.invalid_price_value', {
        token,
        price: tokenPrice.usd.toString(),
      })
    )
  }

  return {
    price: tokenPrice.usd,
    priceChange24h: tokenPrice.usd_24h_change,
    timestamp: Date.now(),
    token,
  }
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to fetch and cache exchange rates for any token priced in USD
 *
 * Automatically refetches the rate at regular intervals to keep data fresh.
 * Provides loading, error, and success states via React Query.
 *
 * @param options - Query configuration options
 * @returns React Query result with exchange rate data
 *
 * @example
 * ```tsx
 * // Default SNT/USD
 * function PriceDisplay() {
 *   const { data, isLoading, error } = useExchangeRate()
 *
 *   if (isLoading) return <div>Loading price...</div>
 *   if (error) return <div>Failed to load price</div>
 *
 *   return <div>1 SNT = ${data.price.toFixed(6)} USD</div>
 * }
 * ```
 *
 * @example
 * ```tsx
 * // ETH/USD
 * function EthPrice() {
 *   const { data } = useExchangeRate({ token: 'ETH' })
 *
 *   return <div>1 ETH = ${data?.price.toFixed(2)} USD</div>
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Multiple tokens
 * function MultiPriceDisplay() {
 *   const snt = useExchangeRate({ token: 'SNT' })
 *   const eth = useExchangeRate({ token: 'ETH' })
 *
 *   return (
 *     <div>
 *       <div>SNT: ${snt.data?.price.toFixed(6)}</div>
 *       <div>ETH: ${eth.data?.price.toFixed(2)}</div>
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
  const t = useTranslations()

  return useQuery({
    queryKey: [QUERY_KEY_PREFIX, token] as const,
    queryFn: () => fetchExchangeRate(token, t),
    enabled,
    refetchInterval,
    staleTime,
    retry: 3,
    retryDelay: attemptIndex =>
      Math.min(1000 * 2 ** attemptIndex, DEFAULT_STALE_TIME),
  })
}
