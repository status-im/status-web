/**
 * Alchemy Prices + Token API service
 * Alternative to CryptoCompare for price and token metadata fetching
 *
 * @see https://www.alchemy.com/docs/reference/prices-api-quickstart for Prices API
 * @see https://www.alchemy.com/docs/reference/alchemy-gettokenmetadata for Token API
 * @see https://dashboard.alchemy.com for API key management
 */

// import 'server-only'

import retry from 'async-retry'

import { serverEnv } from '../../../config/env.server.mjs'
import {
  getRandomApiKey,
  markApiKeyAsRateLimited,
  markApiKeyAsSuccessful,
} from '../api-key-rotation'

import type { NetworkType } from '../../api/types'
import type {
  AlchemyHistoricalTokenPricesResponseBody,
  AlchemyTokenMetadataResponseBody,
  AlchemyTokenPricesBySymbolResponseBody,
  AlchemyTransformedHistoryResponse,
  AlchemyTransformedMetadataResponse,
  AlchemyTransformedPriceResponse,
  ERC20Token,
  ERC20TokenList,
} from './types'

// Revalidation time constants (matching CryptoCompare structure)
export const ALCHEMY_PRICES_REVALIDATION_TIMES = {
  CURRENT_PRICE: 60, // Current prices (portfolio view)
  TRADING_PRICE: 15, // Trading prices (detail view)
  PRICE_HISTORY: 3600, // Historical charts (1 hour)
  TOKEN_METADATA: 86400, // Token metadata (24 hours)
  PRICE_FOR_DATE: 86400, // Point-in-time prices (24 hours)
} as const

const API_KEY_COUNT = serverEnv.ALCHEMY_API_KEYS.split(',')
  .map(k => k.trim())
  .filter(Boolean).length

// Network mapping (reuse existing from main Alchemy service)
const alchemyNetworks = {
  ethereum: 'eth-mainnet',
  optimism: 'opt-mainnet',
  arbitrum: 'arb-mainnet',
  base: 'base-mainnet',
  polygon: 'polygon-mainnet',
  bsc: 'bnb-mainnet',
}

// Load ERC20 token list (cached)
let erc20TokenList: ERC20TokenList | null = null
let tokensBySymbol: Map<string, ERC20Token[]> | null = null

async function loadTokenList(): Promise<void> {
  if (erc20TokenList && tokensBySymbol) return

  try {
    // Try to import the token list directly (works in bundled environment)
    try {
      const tokenListModule = await import('../../../constants/erc20.json')
      erc20TokenList = tokenListModule.default
    } catch {
      // Fallback to file system read (for development)
      const { readFile } = await import('fs/promises')
      const path = await import('path')
      const { fileURLToPath } = await import('url')

      const __filename = fileURLToPath(import.meta.url)
      const __dirname = path.dirname(__filename)
      const tokenListPath = path.resolve(
        __dirname,
        '../../../constants/erc20.json',
      )
      const tokenListData = await readFile(tokenListPath, 'utf-8')
      erc20TokenList = JSON.parse(tokenListData)
    }

    // Create symbol lookup map
    tokensBySymbol = new Map()
    if (erc20TokenList) {
      for (const token of erc20TokenList.tokens) {
        if (!tokensBySymbol.has(token.symbol)) {
          tokensBySymbol.set(token.symbol, [])
        }
        tokensBySymbol.get(token.symbol)!.push(token)
      }
    }
  } catch (error) {
    console.warn('Could not load ERC20 token list:', error)
    erc20TokenList = {
      $schema: '',
      name: '',
      timestamp: '',
      version: { major: 1, minor: 0, patch: 0 },
      tokens: [],
    } as ERC20TokenList
    tokensBySymbol = new Map()
  }
}

function getTokenBySymbol(
  symbol: string,
  network: NetworkType = 'ethereum',
): ERC20Token | null {
  if (!tokensBySymbol) return null

  const tokens = tokensBySymbol.get(symbol) || []
  const networkId = getNetworkId(network)

  // Find token for specific network first
  let token = tokens.find(t => t.chainId === networkId)

  // Fallback to first available token
  if (!token && tokens.length > 0) {
    token = tokens[0]
  }

  return token || null
}

function getNetworkId(network: NetworkType): number {
  const networkIds = {
    ethereum: 1,
    optimism: 10,
    arbitrum: 42161,
    base: 8453,
    polygon: 137,
    bsc: 56,
  } as const
  return (networkIds as Record<NetworkType, number>)[network] || 1
}

/**
 * Fetch current token prices using Alchemy Prices API
 * Maps to CryptoCompare's legacy_fetchTokensPrice function
 */
export async function alchemy_fetchTokensPrice(
  symbols: string[],
): Promise<AlchemyTransformedPriceResponse> {
  if (symbols.length === 0) return {}

  // Alchemy limits to 25 symbols per request
  const batches = []
  for (let i = 0; i < symbols.length; i += 25) {
    batches.push(symbols.slice(i, i + 25))
  }

  const results: AlchemyTransformedPriceResponse = {}

  for (const batch of batches) {
    try {
      const batchResult = await _fetchTokenPricesBatch(batch)
      Object.assign(results, batchResult)
    } catch (error) {
      console.warn(`Failed to fetch prices for batch:`, batch, error)
      // Add empty entries for failed symbols
      for (const symbol of batch) {
        results[symbol] = { USD: _createDefaultPriceResponse(symbol, 0) }
      }
    }
  }

  return results
}

async function _fetchTokenPricesBatch(
  symbols: string[],
): Promise<AlchemyTransformedPriceResponse> {
  const url = new URL(
    `https://api.g.alchemy.com/prices/v1/${getRandomApiKey(serverEnv.ALCHEMY_API_KEYS)}/tokens/by-symbol`,
  )
  // Use multiple symbols parameters instead of array format
  symbols.forEach(symbol => url.searchParams.append('symbols', symbol))

  const body = await _retryPricesAPI(async () =>
    _fetchPricesAPI<AlchemyTokenPricesBySymbolResponseBody>(
      url,
      'GET',
      ALCHEMY_PRICES_REVALIDATION_TIMES.CURRENT_PRICE,
    ),
  )

  return _transformPricesResponse(body)
}

/**
 * Fetch historical token prices using Alchemy Prices API
 * Maps to CryptoCompare's legacy_fetchTokenPriceHistory function
 */
export async function alchemy_fetchTokenPriceHistory(
  symbol: string,
  days: '1' | '7' | '30' | '90' | '365' | 'all' = '1',
): Promise<AlchemyTransformedHistoryResponse> {
  const { startTime, endTime } = _calculateDateRange(days)

  const url = new URL(
    `https://api.g.alchemy.com/prices/v1/${getRandomApiKey(serverEnv.ALCHEMY_API_KEYS)}/tokens/historical`,
  )

  const requestBody = {
    symbol,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  }

  const body = await _retryPricesAPI(async () =>
    _fetchPricesAPI<AlchemyHistoricalTokenPricesResponseBody>(
      url,
      'POST',
      ALCHEMY_PRICES_REVALIDATION_TIMES.PRICE_HISTORY,
      requestBody,
    ),
  )

  return _transformHistoryResponse(body)
}

/**
 * Fetch token metadata using hybrid approach:
 * 1. Primary: Load from existing erc20.json token list
 * 2. Enhanced: Optionally enrich with Alchemy Token API
 */
export async function alchemy_fetchTokenMetadata(
  symbol: string,
): Promise<AlchemyTransformedMetadataResponse> {
  await loadTokenList()

  // Start with local token data
  const localToken = getTokenBySymbol(symbol)

  let result: AlchemyTransformedMetadataResponse = {
    ID: 0,
    TYPE: 'ERC20',
    SYMBOL: symbol,
    NAME: localToken?.name || symbol,
    LOGO_URL: localToken?.logoURI || '',
    ASSET_DESCRIPTION_SNIPPET: '',
    ASSET_DECIMAL_POINTS: localToken?.decimals || 18,
  }

  // Optionally enhance with Alchemy Token API if we have contract address
  if (localToken) {
    try {
      const network =
        (Object.keys(alchemyNetworks).find(
          key => getNetworkId(key as NetworkType) === localToken.chainId,
        ) as NetworkType) || 'ethereum'

      const alchemyData = await _fetchTokenMetadataFromAPI(
        localToken.address,
        network,
      )

      if (alchemyData) {
        // Merge Alchemy data with local data
        result = {
          ...result,
          NAME: alchemyData.name || result.NAME,
          LOGO_URL: alchemyData.logo || result.LOGO_URL,
          ASSET_DECIMAL_POINTS:
            alchemyData.decimals || result.ASSET_DECIMAL_POINTS,
        }
      }
    } catch (error) {
      console.warn(`Could not fetch enhanced metadata for ${symbol}:`, error)
    }
  }

  return result
}

async function _fetchTokenMetadataFromAPI(
  contractAddress: string,
  network: NetworkType,
): Promise<AlchemyTokenMetadataResponseBody | null> {
  try {
    const url = new URL(
      `https://${alchemyNetworks[network]}.g.alchemy.com/v2/${getRandomApiKey(serverEnv.ALCHEMY_API_KEYS)}`,
    )

    const requestBody = {
      jsonrpc: '2.0',
      method: 'alchemy_getTokenMetadata',
      params: [contractAddress],
      id: 1,
    }

    const response = await _retryTokenAPI(async () =>
      _fetchTokenAPI<AlchemyTokenMetadataResponseBody>(
        url,
        'POST',
        ALCHEMY_PRICES_REVALIDATION_TIMES.TOKEN_METADATA,
        requestBody,
      ),
    )

    return response
  } catch (error) {
    console.warn(`Token API call failed for ${contractAddress}:`, error)
    return null
  }
}

/**
 * Fetch token prices for specific date using Alchemy historical API
 * Maps to CryptoCompare's fetchTokensPriceForDate function
 */
export async function alchemy_fetchTokensPriceForDate(
  symbols: string[],
  timestamp: number,
): Promise<Record<string, { USD: { PRICE: number } }>> {
  const results: Record<string, { USD: { PRICE: number } }> = {}

  // Convert timestamp to date range (timestamp ± 1 hour for point-in-time)
  const date = new Date(timestamp * 1000)
  const startTime = new Date(date.getTime() - 60 * 60 * 1000) // 1 hour before
  const endTime = new Date(date.getTime() + 60 * 60 * 1000) // 1 hour after

  for (const symbol of symbols) {
    try {
      const url = new URL(
        `https://api.g.alchemy.com/prices/v1/${getRandomApiKey(serverEnv.ALCHEMY_API_KEYS)}/tokens/historical`,
      )

      const requestBody = {
        symbol,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      }

      const body = await _retryPricesAPI(async () =>
        _fetchPricesAPI<AlchemyHistoricalTokenPricesResponseBody>(
          url,
          'POST',
          ALCHEMY_PRICES_REVALIDATION_TIMES.PRICE_FOR_DATE,
          requestBody,
        ),
      )

      // Get the closest price to our target timestamp
      if (body.data && body.data.length > 0) {
        const closestPrice = body.data.reduce((closest, current) => {
          const currentDiff = Math.abs(
            new Date(current.timestamp).getTime() - date.getTime(),
          )
          const closestDiff = Math.abs(
            new Date(closest.timestamp).getTime() - date.getTime(),
          )
          return currentDiff < closestDiff ? current : closest
        })

        results[symbol] = {
          USD: {
            PRICE: parseFloat(closestPrice.value),
          },
        }
      }
    } catch (error) {
      console.warn(
        `No price data for ${symbol} at timestamp ${timestamp}:`,
        error,
      )
    }
  }

  return results
}

// Helper Functions

function _calculateDateRange(days: string): { startTime: Date; endTime: Date } {
  const endTime = new Date()
  let startTime: Date

  if (days === 'all') {
    // Set to a very early date for "all" data
    startTime = new Date('2010-01-01')
  } else {
    const daysNum = parseInt(days)
    startTime = new Date(endTime.getTime() - daysNum * 24 * 60 * 60 * 1000)
  }

  return { startTime, endTime }
}

function _transformPricesResponse(
  response: AlchemyTokenPricesBySymbolResponseBody,
): AlchemyTransformedPriceResponse {
  const result: AlchemyTransformedPriceResponse = {}

  for (const item of response.data) {
    if (item.error) {
      console.warn(`Price error for ${item.symbol}:`, item.error)
      result[item.symbol] = {
        USD: _createDefaultPriceResponse(item.symbol, 0),
      }
      continue
    }

    const usdPrice = item.prices.find(p => p.currency === 'usd')
    if (usdPrice) {
      const price = parseFloat(usdPrice.value)
      result[item.symbol] = {
        USD: _createDefaultPriceResponse(
          item.symbol,
          price,
          new Date(usdPrice.lastUpdatedAt).getTime() / 1000,
        ),
      }
    } else {
      result[item.symbol] = {
        USD: _createDefaultPriceResponse(item.symbol, 0),
      }
    }
  }

  return result
}

function _createDefaultPriceResponse(
  symbol: string,
  price: number,
  lastUpdate?: number,
) {
  return {
    TYPE: '5',
    MARKET: 'CCCAGG',
    FROMSYMBOL: symbol,
    TOSYMBOL: 'USD',
    FLAGS: '1',
    PRICE: price,
    LASTUPDATE: lastUpdate || Math.floor(Date.now() / 1000),
    MEDIAN: price,
    LASTVOLUME: 0,
    LASTVOLUMETO: 0,
    LASTTRADEID: '',
    VOLUMEDAY: 0,
    VOLUMEDAYTO: 0,
    VOLUME24HOUR: 0,
    VOLUME24HOURTO: 0,
    OPENDAY: price,
    HIGHDAY: price,
    LOWDAY: price,
    OPEN24HOUR: price,
    HIGH24HOUR: price,
    LOW24HOUR: price,
    LASTMARKET: 'Alchemy',
    VOLUMEHOUR: 0,
    VOLUMEHOURTO: 0,
    OPENHOUR: price,
    HIGHHOUR: price,
    LOWHOUR: price,
    TOPTIERVOLUME24HOUR: 0,
    TOPTIERVOLUME24HOURTO: 0,
    CHANGE24HOUR: 0,
    CHANGEPCT24HOUR: 0, // This is the key field that was missing
    CHANGEDAY: 0,
    CHANGEPCTDAY: 0,
    CHANGEHOUR: 0,
    CHANGEPCTHOUR: 0,
    CONVERSIONTYPE: 'direct',
    CONVERSIONSYMBOL: '',
    CONVERSIONLASTUPDATE: lastUpdate || Math.floor(Date.now() / 1000),
    SUPPLY: 0,
    MKTCAP: 0,
    MKTCAPPENALTY: 0,
    CIRCULATINGSUPPLY: 0,
    CIRCULATINGSUPPLYMKTCAP: 0,
    TOTALVOLUME24H: 0,
    TOTALVOLUME24HTO: 0,
    TOTALTOPTIERVOLUME24H: 0,
    TOTALTOPTIERVOLUME24HTO: 0,
    IMAGEURL: '',
  }
}

function _transformHistoryResponse(
  response: AlchemyHistoricalTokenPricesResponseBody,
): AlchemyTransformedHistoryResponse {
  return response.data.map(price => ({
    time: Math.floor(new Date(price.timestamp).getTime() / 1000),
    close: parseFloat(price.value),
    high: parseFloat(price.value), // Alchemy doesn't provide OHLC, using price as all values
    low: parseFloat(price.value),
    open: parseFloat(price.value),
    volumefrom: parseFloat(price.totalVolume || '0'),
    volumeto: parseFloat(price.totalVolume || '0'),
    conversionType: 'direct',
    conversionSymbol: '',
  }))
}

// API Fetch Functions

async function _fetchPricesAPI<T>(
  url: URL,
  method: 'GET' | 'POST',
  revalidate: number,
  body?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) }),
    cache: 'force-cache',
    next: {
      revalidate,
    },
  })

  if (!response.ok) {
    if (response.status === 429) {
      const apiKey = _extractPricesAPIKey(url)
      if (apiKey) {
        markApiKeyAsRateLimited(apiKey)
      }
    }
    throw new Error(`Prices API request failed: ${response.statusText}`)
  }

  const responseBody: T = await response.json()

  const apiKey = _extractPricesAPIKey(url)
  if (apiKey) {
    markApiKeyAsSuccessful(apiKey)
  }

  return responseBody
}

async function _fetchTokenAPI<T>(
  url: URL,
  method: 'GET' | 'POST',
  revalidate: number,
  body?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(body && { body: JSON.stringify(body) }),
    cache: 'force-cache',
    next: {
      revalidate,
    },
  })

  if (!response.ok) {
    if (response.status === 429) {
      const apiKey = _extractTokenAPIKey(url)
      if (apiKey) {
        markApiKeyAsRateLimited(apiKey)
      }
    }
    throw new Error(`Token API request failed: ${response.statusText}`)
  }

  const responseBody: T = await response.json()

  const apiKey = _extractTokenAPIKey(url)
  if (apiKey) {
    markApiKeyAsSuccessful(apiKey)
  }

  return responseBody
}

function _extractPricesAPIKey(url: URL): string | undefined {
  // Extract API key from Prices API URL: /prices/v1/{apiKey}/...
  const pathParts = url.pathname.split('/')
  return pathParts[3] // prices/v1/API_KEY/tokens/...
}

function _extractTokenAPIKey(url: URL): string | undefined {
  // Extract API key from Token API URL: /{network}.g.alchemy.com/v2/{apiKey}
  const pathParts = url.pathname.split('/')
  return pathParts[2] // /v2/API_KEY
}

// Retry Functions

async function _retryPricesAPI<T>(fetchFn: () => Promise<T>): Promise<T> {
  const result = await retry(
    async bail => {
      try {
        return await fetchFn()
      } catch (error) {
        if (error instanceof Error && error.message.includes('429')) {
          throw error // Retry on rate limit
        }
        return bail(error)
      }
    },
    {
      retries: API_KEY_COUNT,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 60000,
      randomize: true,
    },
  )

  if (!result) {
    throw new Error('Retry operation failed to return a result')
  }

  return result
}

async function _retryTokenAPI<T>(fetchFn: () => Promise<T>): Promise<T> {
  const result = await retry(
    async bail => {
      try {
        return await fetchFn()
      } catch (error) {
        if (error instanceof Error && error.message.includes('429')) {
          throw error // Retry on rate limit
        }
        return bail(error)
      }
    },
    {
      retries: API_KEY_COUNT,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 60000,
      randomize: true,
    },
  )

  if (!result) {
    throw new Error('Retry operation failed to return a result')
  }

  return result
}
