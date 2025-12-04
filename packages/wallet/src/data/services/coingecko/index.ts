/**
 * CoinGecko API Service
 * @see https://docs.coingecko.com/ for CoinGecko API documentation
 *
 * Supports both direct API calls and proxy endpoint
 * Proxy: https://test.market.status.im
 * Direct: https://api.coingecko.com/api/v3
 */

import retry from 'async-retry'

import { serverEnv } from '../../../config/env.server.mjs'
import erc20TokenList from '../../../constants/erc20.json'
import { DEFAULT_TOKEN_IDS } from '../../api/routers/assets'
import { markApiKeyAsRateLimited } from '../api-key-rotation'

import type { NetworkType } from '../../api/types'
import type {
  CoinGeckoCoinDetailResponse,
  CoinGeckoCoinHistoryResponse,
  CoinGeckoCoinListResponse,
  CoinGeckoMarketChartResponse,
  CoinGeckoNFTFloorPriceResponse,
  CoinGeckoSimplePriceResponse,
} from './types'

const PROXY_BASE_URL = 'https://test.market.status.im'
const DIRECT_API_BASE_URL = 'https://api.coingecko.com/api/v3'

const PROXY_AUTH = {
  username: serverEnv.MARKET_PROXY_AUTH_USERNAME,
  password: serverEnv.MARKET_PROXY_AUTH_PASSWORD,
}

export const COINGECKO_REVALIDATION_TIMES = {
  TRADING_PRICE: 15,
  CURRENT_PRICE: 60,
  PRICE_HISTORY: 3600,
  PRICE_HISTORY_DAILY: 3600,
  TOKEN_METADATA: 3600,
  PRICE_FOR_DATE: 15,
} as const

type Revalidation =
  (typeof COINGECKO_REVALIDATION_TIMES)[keyof typeof COINGECKO_REVALIDATION_TIMES]

const coingeckoNetworks = {
  ethereum: 'ethereum',
  optimism: 'optimistic-ethereum',
  arbitrum: 'arbitrum-one',
  base: 'base',
  polygon: 'polygon-pos',
  bsc: 'binance-smart-chain',
}

const coingeckoNativeTokens = {
  ethereum: 'ethereum',
  optimism: 'ethereum',
  arbitrum: 'ethereum',
  base: 'ethereum',
  polygon: 'ethereum',
  bsc: 'ethereum',
}

// Cache for coin list to avoid repeated API calls
let coinListCache: CoinGeckoCoinListResponse | null = null
let coinListCacheTime = 0
const COIN_LIST_CACHE_TTL = 3600 * 1000 // 1 hour

/**
 * Fetch with Basic Auth (for proxy)
 */
async function _fetchWithAuth<T>(
  url: URL,
  revalidate: number,
  tag: string,
): Promise<T> {
  const credentials = Buffer.from(
    `${PROXY_AUTH.username}:${PROXY_AUTH.password}`,
  ).toString('base64')

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    cache: 'force-cache',
    next: {
      revalidate,
      tags: [tag],
    },
  })

  if (!response.ok) {
    let errorMessage = response.statusText
    try {
      const errorBody = await response.text()
      if (errorBody) {
        try {
          const parsed = JSON.parse(errorBody)
          errorMessage = parsed.error?.message || parsed.message || errorBody
        } catch {
          errorMessage = errorBody
        }
      }
    } catch {
      // Ignore errors when reading error body
    }

    console.error(
      `Failed to fetch ${url.toString()}: ${response.status} ${errorMessage}`,
    )

    if (response.status === 429) {
      const apiKey = url.searchParams.get('api_key')
      if (apiKey) {
        markApiKeyAsRateLimited(apiKey)
      }
    }

    throw new Error(`Failed to fetch: ${response.status} ${errorMessage}`)
  }

  const body: T = await response.json()

  // Check for CoinGecko error format
  if (
    typeof body === 'object' &&
    body !== null &&
    'error' in body &&
    body.error
  ) {
    const error = body.error as { message?: string }
    console.error(error.message || 'Unknown error')

    if (error.message?.toLowerCase().includes('rate limit')) {
      const apiKey = url.searchParams.get('api_key')
      if (apiKey) {
        markApiKeyAsRateLimited(apiKey)
      }
    }

    throw new Error('Failed to fetch.')
  }

  return body
}

/**
 * Fetch from direct CoinGecko API
 */
async function _fetchDirect<T>(
  url: URL,
  revalidate: number,
  useApiKey = false,
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (useApiKey && serverEnv.COINGECKO_API_KEY) {
    headers['x-cg-demo-api-key'] = serverEnv.COINGECKO_API_KEY
  }

  const response = await fetch(url, {
    headers,
    next: {
      revalidate,
    },
  })

  if (!response.ok) {
    console.error(response.statusText)
    throw new Error(
      `Failed to fetch: ${response.status} ${response.statusText}`,
    )
  }

  return response.json()
}

/**
 * Helper function to get coin list with platforms data
 */
async function _getCoinList(
  useProxy = true,
): Promise<CoinGeckoCoinListResponse> {
  const now = Date.now()

  // Use cache if available and not expired
  if (
    coinListCache &&
    coinListCacheTime > 0 &&
    now - coinListCacheTime < COIN_LIST_CACHE_TTL
  ) {
    return coinListCache
  }

  const url = useProxy
    ? new URL(`${PROXY_BASE_URL}/v1/coins/list`)
    : new URL(`${DIRECT_API_BASE_URL}/coins/list`)

  if (useProxy) {
    url.searchParams.set('include_platform', 'true')
  } else {
    url.searchParams.set('include_platform', 'true')
  }

  const coinList = useProxy
    ? await _fetchWithAuth<CoinGeckoCoinListResponse>(
        url,
        COINGECKO_REVALIDATION_TIMES.TOKEN_METADATA,
        'coinList',
      )
    : await _fetchDirect<CoinGeckoCoinListResponse>(
        url,
        COINGECKO_REVALIDATION_TIMES.TOKEN_METADATA,
        true,
      )

  // Update cache
  coinListCache = coinList
  coinListCacheTime = now

  return coinList
}

/**
 * Helper: Map symbols to coin IDs from coin list
 */
function _mapSymbolsToCoinIds(
  symbols: string[],
  coinList: Array<{ id: string; symbol: string; name: string }>,
): Record<string, string> {
  const result: Record<string, string> = {}
  for (const symbol of symbols) {
    const symbolLower = symbol.toLowerCase()

    // Check default token IDs first
    const symbolUpper = symbol.toUpperCase() as keyof typeof DEFAULT_TOKEN_IDS
    if (symbolUpper in DEFAULT_TOKEN_IDS) {
      const knownCoinId = DEFAULT_TOKEN_IDS[symbolUpper]
      // Verify the coin ID exists in the coin list
      const knownCoin = coinList.find(c => c.id === knownCoinId)
      if (knownCoin) {
        result[symbolLower] = knownCoinId
        continue
      }
    }

    // Find all coins with matching symbol
    const matchingCoins = coinList.filter(
      c => c.symbol.toLowerCase() === symbolLower,
    )

    if (matchingCoins.length === 0) {
      continue
    }

    // Prefer coin where coin ID exactly matches the symbol (e.g., "pepe" -> "pepe")
    const exactMatch = matchingCoins.find(
      c => c.id.toLowerCase() === symbolLower,
    )

    if (exactMatch) {
      result[symbolLower] = exactMatch.id
    } else {
      // If no exact match, use the first one found
      const coin = matchingCoins[0]
      result[symbolLower] = coin.id
    }
  }
  return result
}

/**
 * Helper function to get coin ids from symbols
 */
async function _getCoinIdsFromSymbols(
  symbols: string[],
  useProxy = true,
): Promise<Record<string, string>> {
  const now = Date.now()

  // Use cache if available and not expired
  if (
    coinListCache &&
    coinListCacheTime > 0 &&
    now - coinListCacheTime < COIN_LIST_CACHE_TTL
  ) {
    // Filter out coins without required fields for mapping
    const validCoins = coinListCache.filter(c => c.symbol && c.name) as Array<{
      id: string
      symbol: string
      name: string
    }>
    return _mapSymbolsToCoinIds(symbols, validCoins)
  }

  // Fetch coin list with platforms data
  const coinList = await _getCoinList(useProxy)

  // Filter out coins without required fields for mapping
  const validCoins = coinList.filter(c => c.symbol && c.name) as Array<{
    id: string
    symbol: string
    name: string
  }>
  return _mapSymbolsToCoinIds(symbols, validCoins)
}

/**
 * Helper function to get coin ID from contract address
 */
async function _getCoinIdFromAddress(
  symbol: string,
  useProxy = true,
): Promise<string | null> {
  try {
    if (!erc20TokenList?.tokens) {
      return null
    }

    // Find token in erc20.json by symbol and chainId 1 (ethereum)
    const token = erc20TokenList.tokens.find(
      t => t.symbol.toUpperCase() === symbol.toUpperCase() && t.chainId === 1,
    )

    if (!token?.address) {
      return null
    }

    // Get coin list and find coin ID by contract address
    const coinList = await _getCoinList(useProxy)
    const normalizedAddress = token.address.toLowerCase()

    // Find coin where platforms.ethereum matches the address
    const coin = coinList.find(
      c => c.platforms?.['ethereum']?.toLowerCase() === normalizedAddress,
    )

    if (!coin?.id) {
      return null
    }

    return coin.id
  } catch {
    return null
  }
}

/**
 * Helper function to get coin id from symbol
 */
export async function getCoinIdFromSymbol(
  symbol: string,
  useProxy = true,
): Promise<string | null> {
  const symbolLower = symbol.toLowerCase()

  // Check default token IDs first
  const symbolUpper = symbol.toUpperCase() as keyof typeof DEFAULT_TOKEN_IDS
  if (symbolUpper in DEFAULT_TOKEN_IDS) {
    const knownCoinId = DEFAULT_TOKEN_IDS[symbolUpper]
    // Verify the coin ID exists in the coin list
    const coinList = await _getCoinList(useProxy)
    const knownCoin = coinList.find(c => c.id === knownCoinId)
    if (knownCoin) {
      return knownCoinId
    }
  }

  // Try to get coin ID from contract address
  const coinIdFromAddress = await _getCoinIdFromAddress(symbol, useProxy)
  if (coinIdFromAddress) {
    return coinIdFromAddress
  }

  // Fallback to symbol-based lookup
  const coinIdMap = await _getCoinIdsFromSymbols([symbol], useProxy)
  return coinIdMap[symbolLower] || null
}

/**
 * @see https://docs.coingecko.com/reference/coins-id-market-chart
 *
 * Fetches token price history using CoinGecko API.
 */
export async function fetchTokenPriceHistory(
  symbol: string,
  days: '1' | '7' | '30' | '90' | '365' | 'all' = '1',
  revalidate: Revalidation = COINGECKO_REVALIDATION_TIMES.PRICE_HISTORY,
  useProxy = true,
): Promise<CoinGeckoMarketChartResponse> {
  const coinId = await getCoinIdFromSymbol(symbol, useProxy)
  if (!coinId) {
    throw new Error(`Coin not found for symbol: ${symbol}`)
  }

  // Map days to CoinGecko format
  const daysParam = days === 'all' ? 'max' : days

  const url = useProxy
    ? new URL(`${PROXY_BASE_URL}/v1/coins/${coinId}/market_chart`)
    : new URL(`${DIRECT_API_BASE_URL}/coins/${coinId}/market_chart`)

  url.searchParams.set('vs_currency', 'usd')
  url.searchParams.set('days', daysParam)

  return useProxy
    ? _fetchWithAuth<CoinGeckoMarketChartResponse>(
        url,
        revalidate,
        'fetchTokenPriceHistory',
      )
    : _fetchDirect<CoinGeckoMarketChartResponse>(url, revalidate)
}

/**
 * @see https://docs.coingecko.com/reference/coins-id
 *
 * Fetches token metadata using CoinGecko API.
 */
export async function fetchTokenMetadata(
  symbol: string,
  revalidate: Revalidation = COINGECKO_REVALIDATION_TIMES.TOKEN_METADATA,
  useProxy = true,
): Promise<CoinGeckoCoinDetailResponse> {
  const coinId = await getCoinIdFromSymbol(symbol, useProxy)
  if (!coinId) {
    throw new Error(`Coin not found for symbol: ${symbol}`)
  }

  const url = useProxy
    ? new URL(`${PROXY_BASE_URL}/v1/coins/${coinId}`)
    : new URL(`${DIRECT_API_BASE_URL}/coins/${coinId}`)

  url.searchParams.set('localization', 'true')
  url.searchParams.set('tickers', 'false')
  url.searchParams.set('market_data', 'true')
  url.searchParams.set('community_data', 'false')
  url.searchParams.set('developer_data', 'false')
  url.searchParams.set('sparkline', 'false')

  return useProxy
    ? _fetchWithAuth<CoinGeckoCoinDetailResponse>(
        url,
        revalidate,
        'fetchTokenMetadata',
      )
    : _fetchDirect<CoinGeckoCoinDetailResponse>(url, revalidate)
}

/**
 * @see https://docs.coingecko.com/reference/simple-price
 *
 * Fetches current prices for multiple tokens using CoinGecko API.
 */
export async function fetchTokensPrice(
  symbols: string[],
  revalidate: Revalidation = COINGECKO_REVALIDATION_TIMES.CURRENT_PRICE,
  useProxy = true,
): Promise<Record<string, CoinGeckoSimplePriceResponse[string]>> {
  if (symbols.length === 0) return {}

  try {
    const coinIdMap = await _getCoinIdsFromSymbols(symbols, useProxy)

    const coinIds = Object.values(coinIdMap).filter(Boolean)
    if (coinIds.length === 0) return {}

    const url = useProxy
      ? new URL(`${PROXY_BASE_URL}/v1/simple/price`)
      : new URL(`${DIRECT_API_BASE_URL}/simple/price`)

    url.searchParams.set('ids', coinIds.join(','))
    url.searchParams.set('vs_currencies', 'usd')
    url.searchParams.set('include_24hr_change', 'true')
    url.searchParams.set('include_market_cap', 'true')
    url.searchParams.set('include_24hr_vol', 'true')

    const priceData = useProxy
      ? await _fetchWithAuth<CoinGeckoSimplePriceResponse>(
          url,
          revalidate,
          'fetchTokensPrice',
        )
      : await _fetchDirect<CoinGeckoSimplePriceResponse>(url, revalidate, true)

    // Map by symbol for backward compatibility
    const data: Record<string, CoinGeckoSimplePriceResponse[string]> = {}

    for (const symbol of symbols) {
      const coinId = coinIdMap[symbol.toLowerCase()]
      if (!coinId || !priceData[coinId]) continue

      // Store with both original symbol and uppercase symbol for compatibility
      data[symbol] = priceData[coinId]
      data[symbol.toUpperCase()] = priceData[coinId]
    }

    return data
  } catch (error: unknown) {
    console.error('Failed to fetch prices:', error)
    return {}
  }
}

/**
 * Returns the price of tokens at a specific timestamp.
 * @see https://docs.coingecko.com/reference/coins-id-history
 */
export async function fetchTokensPriceForDate(
  symbols: string[],
  timestamp: number,
  revalidate: Revalidation = COINGECKO_REVALIDATION_TIMES.PRICE_FOR_DATE,
  useProxy = true,
): Promise<Record<string, { usd: number }>> {
  const data: Record<string, { usd: number }> = {}

  // Get coin ids from symbols
  const coinIdMap = await _getCoinIdsFromSymbols(symbols, useProxy)

  for (const symbol of symbols) {
    try {
      const coinId = coinIdMap[symbol.toLowerCase()]
      if (!coinId) {
        console.warn(`Coin not found for symbol: ${symbol}`)
        continue
      }

      // Convert timestamp to date
      const date = new Date(timestamp * 1000)
      const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD

      const url = useProxy
        ? new URL(`${PROXY_BASE_URL}/v1/coins/${coinId}/history`)
        : new URL(`${DIRECT_API_BASE_URL}/coins/${coinId}/history`)

      url.searchParams.set('date', dateStr)
      url.searchParams.set('localization', 'false')

      const historyData = useProxy
        ? await _fetchWithAuth<CoinGeckoCoinHistoryResponse>(
            url,
            revalidate,
            'fetchTokensPriceForDate',
          )
        : await _fetchDirect<CoinGeckoCoinHistoryResponse>(url, revalidate)

      if (historyData.market_data?.current_price?.usd) {
        data[symbol.toUpperCase()] = {
          usd: historyData.market_data.current_price.usd,
        }
      }
    } catch (err) {
      console.warn(`No price data for ${symbol}:`, String(err))
    }
  }

  return data
}

/**
 * @see https://docs.coingecko.com/reference/coins-list
 *
 * Returns coin list from CoinGecko API.
 */
export async function getCoinList(
  useProxy = true,
): Promise<CoinGeckoCoinListResponse> {
  return _getCoinList(useProxy)
}

/**
 * @see https://docs.coingecko.com/reference/simple-price
 *
 * Fetches native token price for a network.
 */
export const getNativeTokenPrice = async (network: NetworkType) => {
  const url = new URL(`${DIRECT_API_BASE_URL}/simple/price`)
  url.searchParams.set('ids', coingeckoNativeTokens[network])
  url.searchParams.set('vs_currencies', 'usd')
  url.searchParams.set('include_24hr_change', 'true')

  const prices = await _fetchDirect<CoinGeckoSimplePriceResponse>(
    url,
    COINGECKO_REVALIDATION_TIMES.CURRENT_PRICE,
    true,
  )

  return prices[coingeckoNativeTokens[network]]
}

/**
 * @see https://docs.coingecko.com/reference/coins-id-market-chart
 *
 * Fetches native token price chart data for a network.
 */
export const getNativeTokenPriceChartData = async (
  network: NetworkType,
  days: '1' | '7' | '30' | '90' | '365' | 'all' = '1',
) => {
  const url = new URL(
    `${DIRECT_API_BASE_URL}/coins/${coingeckoNativeTokens[network]}/market_chart`,
  )
  url.searchParams.set('vs_currency', 'usd')
  url.searchParams.set('days', days === 'all' ? 'max' : days)

  const chartData = await _fetchDirect<CoinGeckoMarketChartResponse>(
    url,
    COINGECKO_REVALIDATION_TIMES.PRICE_HISTORY,
  )

  return calculateHourlyPrices(chartData.prices)
}

/**
 * @see https://docs.coingecko.com/reference/coins-id-market-chart
 *
 * Fetches ERC20 token price chart data.
 */
export const getERC20TokenPriceChartData = async (
  address: string,
  network: NetworkType,
  days: '1' | '7' | '30' | '90' | '365' | 'all' = '1',
) => {
  const url = new URL(
    `${DIRECT_API_BASE_URL}/coins/${coingeckoNetworks[network]}/contract/${address}/market_chart`,
  )
  url.searchParams.set('vs_currency', 'usd')
  url.searchParams.set('days', days === 'all' ? 'max' : days)

  const chartData = await _fetchDirect<CoinGeckoMarketChartResponse>(
    url,
    COINGECKO_REVALIDATION_TIMES.PRICE_HISTORY,
  )

  return calculateHourlyPrices(chartData.prices)
}

/**
 * @see https://docs.coingecko.com/reference/coins-id
 *
 * Fetches native token metadata.
 */
export const getNativeTokenMetadata = async (
  network: NetworkType,
): Promise<CoinGeckoCoinDetailResponse> => {
  const url = new URL(
    `${DIRECT_API_BASE_URL}/coins/${coingeckoNativeTokens[network]}`,
  )
  url.searchParams.set('localization', 'false')
  url.searchParams.set('tickers', 'false')
  url.searchParams.set('market_data', 'true')
  url.searchParams.set('community_data', 'false')
  url.searchParams.set('developer_data', 'false')
  url.searchParams.set('sparkline', 'true')

  return _fetchDirect<CoinGeckoCoinDetailResponse>(
    url,
    COINGECKO_REVALIDATION_TIMES.TOKEN_METADATA,
  )
}

/**
 * @see https://docs.coingecko.com/reference/coins-id
 *
 * Fetches ERC20 token metadata by contract address.
 */
export const getERC20TokenMetadata = async (
  address: string,
  network: NetworkType,
): Promise<CoinGeckoCoinDetailResponse> => {
  const url = new URL(
    `${DIRECT_API_BASE_URL}/coins/${coingeckoNetworks[network]}/contract/${address}`,
  )
  url.searchParams.set('localization', 'false')
  url.searchParams.set('tickers', 'false')
  url.searchParams.set('market_data', 'true')
  url.searchParams.set('community_data', 'false')
  url.searchParams.set('developer_data', 'false')
  url.searchParams.set('sparkline', 'true')

  return _fetchDirect<CoinGeckoCoinDetailResponse>(
    url,
    COINGECKO_REVALIDATION_TIMES.TOKEN_METADATA,
  )
}

/**
 * @see https://docs.coingecko.com/reference/simple-token-price
 *
 * Fetches ERC20 tokens price by contract addresses.
 */
export const getERC20TokensPrice = async (
  addresses: string[],
  network: NetworkType,
): Promise<CoinGeckoSimplePriceResponse> => {
  const _addresses = addresses.filter(Boolean)

  if (!_addresses.length) {
    return {}
  }

  const response = await retry(
    async () => {
      const url = new URL(
        `${DIRECT_API_BASE_URL}/simple/token_price/${coingeckoNetworks[network]}`,
      )
      url.searchParams.set('contract_addresses', _addresses.join(','))
      url.searchParams.set('vs_currencies', 'usd')
      url.searchParams.set('include_24hr_change', 'true')

      const result = await _fetchDirect<CoinGeckoSimplePriceResponse>(
        url,
        COINGECKO_REVALIDATION_TIMES.CURRENT_PRICE,
        true,
      )

      return result
    },
    {
      retries: 3,
      factor: 2,
      minTimeout: 60000,
      maxTimeout: 60000,
      randomize: true,
    },
  )

  return response
}

/**
 * @see https://docs.coingecko.com/reference/coins-list
 *
 * Fetches token list from CoinGecko.
 */
export const getTokenList = async (): Promise<CoinGeckoCoinListResponse> => {
  const url = new URL(`${DIRECT_API_BASE_URL}/coins/list`)

  return _fetchDirect<CoinGeckoCoinListResponse>(
    url,
    COINGECKO_REVALIDATION_TIMES.TOKEN_METADATA,
    true,
  )
}

/**
 * @see https://docs.coingecko.com/v3.0.1/reference/nfts-contract-address
 *
 * Fetches NFT floor price.
 */
export const getNFTFloorPrice = async (
  contract: string,
  network: NetworkType,
): Promise<number> => {
  const url = new URL(
    `${DIRECT_API_BASE_URL}/nfts/${coingeckoNetworks[network]}/contract/${contract}`,
  )

  const body = await _fetchDirect<CoinGeckoNFTFloorPriceResponse>(
    url,
    COINGECKO_REVALIDATION_TIMES.TOKEN_METADATA,
    true,
  )

  return body.floor_price.native_currency
}

/**
 * Calculate hourly prices from price data
 */
const calculateHourlyPrices = (prices: [number, number][]) => {
  const hourlyPrices = prices.reduce(
    (acc: [number, number][], curr: [number, number]) => {
      const date = new Date(curr[0])
      date.setMinutes(0, 0, 0) // Set minutes, seconds, and milliseconds to 0
      const timestamp = date.getTime()

      // Check if we already have a price for this hour
      const existingIndex = acc.findIndex(item => item[0] === timestamp)

      if (existingIndex === -1) {
        // If no existing price for this hour, add it
        acc.push([timestamp, curr[1]])
      } else {
        // If we already have a price for this hour, update it only if the new timestamp is closer to the hour
        const existingDiff = Math.abs(acc[existingIndex][0] - timestamp)
        const newDiff = Math.abs(curr[0] - timestamp)
        if (newDiff < existingDiff) {
          acc[existingIndex] = [timestamp, curr[1]]
        }
      }

      return acc
    },
    [],
  )

  // Sort the hourly prices by timestamp
  return hourlyPrices.sort((a, b) => a[0] - b[0])
}

// Legacy function names for backward compatibility (will be removed)
export const legacy_fetchTokenPriceHistory = fetchTokenPriceHistory
export const legacy_fetchTokensPrice = fetchTokensPrice
export const legacy_research_fetchTokenMetadata = async (
  symbol: string,
  _revalidate: Revalidation = COINGECKO_REVALIDATION_TIMES.TOKEN_METADATA,
  useProxy = true,
) => {
  // _revalidate is kept for backward compatibility but not used
  void _revalidate
  const coinList = await _getCoinList(useProxy)
  const coin = coinList.find(
    c => c.symbol.toLowerCase() === symbol.toLowerCase(),
  )
  if (!coin) {
    throw new Error(`Coin not found for symbol: ${symbol}`)
  }
  return coin
}

// Export revalidation times with legacy name for backward compatibility
export const MARKET_PROXY_REVALIDATION_TIMES = COINGECKO_REVALIDATION_TIMES
