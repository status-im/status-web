/**
 * @see https://docs.coingecko.com/ for CoinGecko API documentation
 * @see https://test.market.status.im for proxy endpoint
 *
 * This module uses CoinGecko API through a proxy at https://test.market.status.im
 * Example: https://pro-api.coingecko.com/api/v3/coins/list -> https://test.market.status.im/v1/coins/list
 */

// import 'server-only'

import { serverEnv } from '../../../config/env.server.mjs'
import { markApiKeyAsRateLimited } from '../api-key-rotation'

import type {
  deprecated_TokensMetadataResponseBody,
  legacy_research_TokenMetadataResponseBody,
  legacy_TokenPriceHistoryResponseBody,
  legacy_TokensPriceResponseBody,
  TokenMetadataResponseBody,
} from './types'

const PROXY_BASE_URL = 'https://test.market.status.im'

const PROXY_AUTH = {
  username: serverEnv.MARKET_PROXY_AUTH_USERNAME,
  password: serverEnv.MARKET_PROXY_AUTH_PASSWORD,
}

export const MARKET_PROXY_REVALIDATION_TIMES = {
  TRADING_PRICE: 15,
  CURRENT_PRICE: 60,
  PRICE_HISTORY: 3600,
  PRICE_HISTORY_DAILY: 3600,
  TOKEN_METADATA: 3600,
  PRICE_FOR_DATE: 15,
} as const

const DEFAULT_NUMERIC_VALUE = 0
const DEFAULT_EMPTY_ARRAY: never[] = []
const DEFAULT_EMPTY_STRING = ''
const PERCENTAGE_MULTIPLIER = 0.01
const DESCRIPTION_SNIPPET_LENGTH = 200
const DESCRIPTION_SUMMARY_LENGTH = 500
const SEO_DESCRIPTION_LENGTH = 160
const DEFAULT_LANGUAGE_CODE = 'en'
const DEFAULT_CURRENCY_CODE = 'USD'
const PRICE_SOURCE = 'CoinGecko'
const CONVERSION_TYPE = 'direct'

type Revalidation =
  (typeof MARKET_PROXY_REVALIDATION_TIMES)[keyof typeof MARKET_PROXY_REVALIDATION_TIMES]

// Default empty values for token metadata
const EMPTY_METADATA_DEFAULTS: Partial<TokenMetadataResponseBody['Data']> = {
  ID: 0,
  ID_LEGACY: 0,
  ID_PARENT_ASSET: null,
  ID_ASSET_ISSUER: 0,
  URI: '',
  ASSET_ISSUER_NAME: '',
  PARENT_ASSET_SYMBOL: null,
  CREATED_ON: 0,
  PUBLIC_NOTICE: null,
  LAUNCH_DATE: 0,
  PREVIOUS_ASSET_SYMBOLS: null,
  ASSET_ALTERNATIVE_IDS: [],
  ASSET_DECIMAL_POINTS: 18,
  SUPPORTED_PLATFORMS: [],
  ASSET_CUSTODIANS: [],
  CONTROLLED_ADDRESSES: null,
  ASSET_SECURITY_METRICS: [],
  SUPPLY_FUTURE: 0,
  SUPPLY_LOCKED: 0,
  SUPPLY_BURNT: 0,
  SUPPLY_STAKED: 0,
  LAST_BLOCK_MINT: 0,
  LAST_BLOCK_BURN: null,
  BURN_ADDRESSES: [],
  LOCKED_ADDRESSES: [],
  HAS_SMART_CONTRACT_CAPABILITIES: false,
  SMART_CONTRACT_SUPPORT_TYPE: '',
  TARGET_BLOCK_MINT: 0,
  TARGET_BLOCK_TIME: 0,
  LAST_BLOCK_NUMBER: 0,
  LAST_BLOCK_TIMESTAMP: 0,
  LAST_BLOCK_TIME: 0,
  LAST_BLOCK_SIZE: 0,
  LAST_BLOCK_ISSUER: '',
  LAST_BLOCK_TRANSACTION_FEE_TOTAL: 0,
  LAST_BLOCK_TRANSACTION_COUNT: 0,
  LAST_BLOCK_HASHES_PER_SECOND: 0,
  LAST_BLOCK_DIFFICULTY: 0,
  SUPPORTED_STANDARDS: [],
  LAYER_TWO_SOLUTIONS: [],
  PRIVACY_SOLUTIONS: [],
  CODE_REPOSITORIES: [],
  SUBREDDITS: [],
  TWITTER_ACCOUNTS: [],
  DISCORD_SERVERS: [],
  TELEGRAM_GROUPS: null,
  OTHER_SOCIAL_NETWORKS: [],
  HELD_TOKEN_SALE: false,
  TOKEN_SALES: [],
  HELD_EQUITY_SALE: false,
  BLOG_URL: '',
  OTHER_DOCUMENT_URLS: [],
  RPC_OPERATORS: [],
  IS_EXCLUDED_FROM_MKT_CAP_TOPLIST: null,
  ASSET_INDUSTRIES: [],
  CONSENSUS_MECHANISMS: [],
  CONSENSUS_ALGORITHM_TYPES: [],
  HASHING_ALGORITHM_TYPES: [],
  MKT_CAP_PENALTY: 0,
  SPOT_MOVING_24_HOUR_QUOTE_VOLUME_TOP_TIER_DIRECT_USD: 0,
  SPOT_MOVING_24_HOUR_QUOTE_VOLUME_DIRECT_USD: 0,
  SPOT_MOVING_24_HOUR_QUOTE_VOLUME_TOP_TIER_USD: 0,
  SPOT_MOVING_7_DAY_QUOTE_VOLUME_TOP_TIER_DIRECT_USD: 0,
  SPOT_MOVING_7_DAY_QUOTE_VOLUME_DIRECT_USD: 0,
  SPOT_MOVING_7_DAY_QUOTE_VOLUME_TOP_TIER_USD: 0,
  SPOT_MOVING_7_DAY_QUOTE_VOLUME_USD: 0,
  SPOT_MOVING_30_DAY_QUOTE_VOLUME_TOP_TIER_DIRECT_USD: 0,
  SPOT_MOVING_30_DAY_QUOTE_VOLUME_DIRECT_USD: 0,
  SPOT_MOVING_30_DAY_QUOTE_VOLUME_TOP_TIER_USD: 0,
  SPOT_MOVING_30_DAY_QUOTE_VOLUME_USD: 0,
  SPOT_MOVING_7_DAY_CHANGE_USD: 0,
  SPOT_MOVING_7_DAY_CHANGE_PERCENTAGE_USD: 0,
  SPOT_MOVING_30_DAY_CHANGE_USD: 0,
  SPOT_MOVING_30_DAY_CHANGE_PERCENTAGE_USD: 0,
  PROJECT_LEADERS: [],
  ASSOCIATED_CONTACT_DETAILS: [],
}

/**
 * @see https://docs.coingecko.com/reference/coins-id-market-chart
 *
 * Fetches token price history using CoinGecko API through proxy.
 */
export async function legacy_fetchTokenPriceHistory(
  symbol: string,
  days: '1' | '7' | '30' | '90' | '365' | 'all' = '1',
  revalidate: Revalidation = MARKET_PROXY_REVALIDATION_TIMES.PRICE_HISTORY,
) {
  // First, get coin id from symbol
  const coinId = await _getCoinIdFromSymbol(symbol)
  if (!coinId) {
    throw new Error(`Coin not found for symbol: ${symbol}`)
  }

  // Map days to CoinGecko format
  const daysParam = days === 'all' ? 'max' : days

  const url = new URL(`${PROXY_BASE_URL}/v1/coins/${coinId}/market_chart`)

  url.searchParams.set('vs_currency', 'usd')
  url.searchParams.set('days', daysParam)

  const response = await _fetchWithAuth<{
    prices: [number, number][]
    market_caps: [number, number][]
    total_volumes: [number, number][]
  }>(url, revalidate, 'legacy_fetchTokenPriceHistory')

  // Convert CoinGecko format to legacy format
  const data: legacy_TokenPriceHistoryResponseBody['Data']['Data'] =
    response.prices.map(([timestamp, price], index) => {
      const volume = response.total_volumes[index]?.[1] || DEFAULT_NUMERIC_VALUE

      return {
        time: Math.floor(timestamp / 1000), // Convert to seconds
        close: price,
        high: price, // CoinGecko doesn't provide high/low for hourly data
        low: price,
        open: price,
        volumefrom: volume,
        volumeto: volume * price,
        conversionType: CONVERSION_TYPE,
        conversionSymbol: DEFAULT_CURRENCY_CODE,
      }
    })

  return data
}

/**
 * Helper: Extract description from CoinGecko description object
 */
function _getDescription(description: Record<string, string>): string {
  if (!description) return DEFAULT_EMPTY_STRING
  if (description[DEFAULT_LANGUAGE_CODE])
    return description[DEFAULT_LANGUAGE_CODE]

  const languages = [DEFAULT_LANGUAGE_CODE]

  for (const lang of languages) {
    if (description[lang]) return description[lang]
  }

  const firstDescription = Object.values(description)[0]
  return firstDescription || ''
}

/**
 * Helper: Convert CoinGecko coin data to token metadata format
 */
function _convertCoinGeckoToTokenMetadata(coinData: {
  id: string
  symbol: string
  name: string
  image: { small: string; large: string; thumb: string }
  market_cap_rank?: number | null
  market_data: {
    current_price: { usd: number }
    market_cap: { usd: number }
    market_cap_rank?: number | null
    total_volume: { usd: number }
    price_change_24h: number
    price_change_percentage_24h: number
    circulating_supply: number
    total_supply: number
    max_supply: number | null
  }
  description: Record<string, string>
  links: {
    homepage: string[]
    blockchain_site: string[]
    whitepaper: string | null
  }
}): TokenMetadataResponseBody['Data'] {
  const description =
    coinData.description?.[DEFAULT_LANGUAGE_CODE] ||
    _getDescription(coinData.description)
  const now = Date.now()
  const { market_data } = coinData

  const marketCapRank =
    coinData.market_cap_rank ?? market_data?.market_cap_rank ?? null

  const result = {
    ...EMPTY_METADATA_DEFAULTS,
    TYPE: 'CRYPTO',
    ASSET_TYPE: 'CRYPTO',
    SYMBOL: coinData.symbol.toUpperCase(),
    UPDATED_ON: now,
    NAME: coinData.name,
    LOGO_URL: coinData.image.large || coinData.image.small,
    ASSET_DESCRIPTION_SNIPPET: description.substring(
      0,
      DESCRIPTION_SNIPPET_LENGTH,
    ),
    SUPPLY_MAX: market_data?.max_supply || DEFAULT_NUMERIC_VALUE,
    SUPPLY_ISSUED: market_data?.total_supply || DEFAULT_NUMERIC_VALUE,
    SUPPLY_TOTAL: market_data?.total_supply || DEFAULT_NUMERIC_VALUE,
    SUPPLY_CIRCULATING:
      market_data?.circulating_supply || DEFAULT_NUMERIC_VALUE,
    WEBSITE_URL: coinData.links.homepage?.[0] || DEFAULT_EMPTY_STRING,
    WHITE_PAPER_URL: coinData.links.whitepaper || DEFAULT_EMPTY_STRING,
    EXPLORER_ADDRESSES:
      coinData.links.blockchain_site?.map(url => ({
        URL: url,
      })) || DEFAULT_EMPTY_ARRAY,
    PRICE_USD: market_data?.current_price?.usd || DEFAULT_NUMERIC_VALUE,
    PRICE_USD_SOURCE: PRICE_SOURCE,
    PRICE_USD_LAST_UPDATE_TS: now,
    CIRCULATING_MKT_CAP_USD:
      market_data?.market_cap?.usd || DEFAULT_NUMERIC_VALUE,
    TOTAL_MKT_CAP_USD: market_data?.market_cap?.usd || DEFAULT_NUMERIC_VALUE,
    SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD:
      market_data?.total_volume?.usd || DEFAULT_NUMERIC_VALUE,
    SPOT_MOVING_24_HOUR_CHANGE_USD:
      market_data?.price_change_24h || DEFAULT_NUMERIC_VALUE,
    SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD:
      market_data?.price_change_percentage_24h || DEFAULT_NUMERIC_VALUE,
    TOPLIST_BASE_RANK: {
      CREATED_ON: DEFAULT_NUMERIC_VALUE,
      LAUNCH_DATE: DEFAULT_NUMERIC_VALUE,
      CIRCULATING_MKT_CAP_USD:
        market_data?.market_cap?.usd || DEFAULT_NUMERIC_VALUE,
      TOTAL_MKT_CAP_USD: market_data?.market_cap?.usd || DEFAULT_NUMERIC_VALUE,
      SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD:
        market_data?.total_volume?.usd || DEFAULT_NUMERIC_VALUE,
      SPOT_MOVING_7_DAY_QUOTE_VOLUME_USD: DEFAULT_NUMERIC_VALUE,
      SPOT_MOVING_30_DAY_QUOTE_VOLUME_USD: DEFAULT_NUMERIC_VALUE,
      RANK: marketCapRank,
    },
    ASSET_DESCRIPTION: description,
    ASSET_DESCRIPTION_SUMMARY: description.substring(
      0,
      DESCRIPTION_SUMMARY_LENGTH,
    ),
    SEO_TITLE: coinData.name,
    SEO_DESCRIPTION: description.substring(0, SEO_DESCRIPTION_LENGTH),
  } as TokenMetadataResponseBody['Data']

  return result
}

/**
 * @see https://docs.coingecko.com/reference/coins-id
 *
 * Fetches token metadata using CoinGecko API through proxy.
 */
export async function fetchTokenMetadata(
  symbol: string,
  revalidate: Revalidation = MARKET_PROXY_REVALIDATION_TIMES.TOKEN_METADATA,
) {
  const coinId = await _getCoinIdFromSymbol(symbol)
  if (!coinId || coinId.toLowerCase() === symbol.toLowerCase()) {
    throw new Error(`Coin not found for symbol: ${symbol}`)
  }

  const url = new URL(`${PROXY_BASE_URL}/v1/coins/${coinId}`)
  url.searchParams.set('localization', 'true')
  url.searchParams.set('tickers', 'false')
  url.searchParams.set('market_data', 'true')
  url.searchParams.set('community_data', 'false')
  url.searchParams.set('developer_data', 'false')
  url.searchParams.set('sparkline', 'false')

  const coinData = await _fetchWithAuth<{
    id: string
    symbol: string
    name: string
    image: { small: string; large: string; thumb: string }
    market_cap_rank?: number | null
    market_data: {
      current_price: { usd: number }
      market_cap: { usd: number }
      market_cap_rank?: number | null
      total_volume: { usd: number }
      price_change_24h: number
      price_change_percentage_24h: number
      circulating_supply: number
      total_supply: number
      max_supply: number | null
    }
    description: Record<string, string>
    links: {
      homepage: string[]
      blockchain_site: string[]
      whitepaper: string | null
    }
  }>(url, revalidate, 'fetchTokenMetadata')

  return _convertCoinGeckoToTokenMetadata(coinData)
}

/**
 * @see https://docs.coingecko.com/reference/coins-id
 *
 * Deprecated: Use fetchTokenMetadata instead.
 */
export async function deprecated_fetchTokenMetadata(
  symbol: string,
  revalidate: Revalidation = MARKET_PROXY_REVALIDATION_TIMES.TOKEN_METADATA,
) {
  const metadata = await fetchTokenMetadata(symbol, revalidate)

  // Convert to deprecated format - most fields are the same, only SUPPORTED_PLATFORMS needs mapping
  return {
    ...metadata,
    ID: 0,
    ID_LEGACY: 0,
    ID_PARENT_ASSET: null,
    ID_ASSET_ISSUER: 0,
    PARENT_ASSET_SYMBOL: null,
    SUPPORTED_PLATFORMS: metadata.SUPPORTED_PLATFORMS.map(platform => ({
      ...platform,
      LAUNCH_DATE: platform.LAUNCH_DATE ?? 0,
    })),
  } as deprecated_TokensMetadataResponseBody['Data'][string]
}

const EMPTY_LEGACY_RESEARCH_DEFAULTS = {
  ContentCreatedOn: 0,
  Description: '',
  AssetTokenStatus: 'Active' as const,
  Algorithm: '',
  ProofType: '',
  SortOrder: '0',
  Sponsored: false,
  Taxonomy: {
    Access: '',
    FCA: '',
    FINMA: '',
    Industry: '',
    CollateralizedAsset: '',
    CollateralizedAssetType: '',
    CollateralType: '',
    CollateralInfo: '',
  },
  Rating: {
    Weiss: {
      Rating: '',
      TechnologyAdoptionRating: '',
      MarketPerformanceRating: '',
    },
  },
  IsTrading: true,
  TotalCoinsMined: 0,
  CirculatingSupply: 0,
  BlockNumber: 0,
  NetHashesPerSecond: 0,
  BlockReward: 0,
  BlockTime: 0,
  AssetLaunchDate: '',
  AssetWhitepaperUrl: '',
  AssetWebsiteUrl: '',
  MaxSupply: 0,
  MktCapPenalty: 0,
  IsUsedInDefi: 0,
  IsUsedInNft: 0,
  PlatformType: '',
  DecimalPoints: 18,
  AlgorithmType: '',
} as const

/**
 * @see https://docs.coingecko.com/reference/coins-list
 *
 * Returns token metadata from CoinGecko coins list.
 */
export async function legacy_research_fetchTokenMetadata(
  symbol: string,
  revalidate: Revalidation = MARKET_PROXY_REVALIDATION_TIMES.TOKEN_METADATA,
) {
  const url = new URL(`${PROXY_BASE_URL}/v1/coins/list`)

  const coins = await _fetchWithAuth<
    Array<{ id: string; symbol: string; name: string }>
  >(url, revalidate, 'legacy_research_fetchTokenMetadata')

  const coin = coins.find(c => c.symbol.toLowerCase() === symbol.toLowerCase())
  if (!coin) {
    throw new Error(`Coin not found for symbol: ${symbol}`)
  }

  return {
    ...EMPTY_LEGACY_RESEARCH_DEFAULTS,
    Id: coin.id,
    Url: `https://www.coingecko.com/en/coins/${coin.id}`,
    ImageUrl: `https://assets.coingecko.com/coins/images/${coin.id}/large/${coin.id}.png`,
    Name: coin.name,
    Symbol: coin.symbol.toUpperCase(),
    CoinName: coin.name,
    FullName: coin.name,
  } as legacy_research_TokenMetadataResponseBody['Data'][string]
}

/**
 * Helper: Convert CoinGecko price data to legacy format
 */
function _convertCoinGeckoToLegacyPrice(
  symbol: string,
  coinId: string,
  price: {
    usd: number
    usd_24h_change?: number
    usd_market_cap?: number
    usd_24h_vol?: number
  },
): legacy_TokensPriceResponseBody['RAW'][string] {
  const now = Math.floor(Date.now() / 1000)
  const volume24h = price.usd_24h_vol || DEFAULT_NUMERIC_VALUE
  const volume24hTo = volume24h * price.usd
  const change24h =
    (price.usd_24h_change || DEFAULT_NUMERIC_VALUE) *
    price.usd *
    PERCENTAGE_MULTIPLIER

  return {
    USD: {
      TYPE: '5',
      MARKET: 'CCCAGG',
      FROMSYMBOL: symbol.toUpperCase(),
      TOSYMBOL: DEFAULT_CURRENCY_CODE,
      FLAGS: '4',
      PRICE: price.usd,
      LASTUPDATE: now,
      MEDIAN: price.usd,
      LASTVOLUME: DEFAULT_NUMERIC_VALUE,
      LASTVOLUMETO: DEFAULT_NUMERIC_VALUE,
      LASTTRADEID: DEFAULT_EMPTY_STRING,
      VOLUMEDAY: DEFAULT_NUMERIC_VALUE,
      VOLUMEDAYTO: DEFAULT_NUMERIC_VALUE,
      VOLUME24HOUR: volume24h,
      VOLUME24HOURTO: volume24hTo,
      OPENDAY: price.usd,
      HIGHDAY: price.usd,
      LOWDAY: price.usd,
      OPEN24HOUR: price.usd,
      HIGH24HOUR: price.usd,
      LOW24HOUR: price.usd,
      LASTMARKET: PRICE_SOURCE,
      VOLUMEHOUR: DEFAULT_NUMERIC_VALUE,
      VOLUMEHOURTO: DEFAULT_NUMERIC_VALUE,
      OPENHOUR: price.usd,
      HIGHHOUR: price.usd,
      LOWHOUR: price.usd,
      TOPTIERVOLUME24HOUR: volume24h,
      TOPTIERVOLUME24HOURTO: volume24hTo,
      CHANGE24HOUR: change24h,
      CHANGEPCT24HOUR: price.usd_24h_change || DEFAULT_NUMERIC_VALUE,
      CHANGEDAY: DEFAULT_NUMERIC_VALUE,
      CHANGEPCTDAY: DEFAULT_NUMERIC_VALUE,
      CHANGEHOUR: DEFAULT_NUMERIC_VALUE,
      CHANGEPCTHOUR: DEFAULT_NUMERIC_VALUE,
      CONVERSIONTYPE: CONVERSION_TYPE,
      CONVERSIONSYMBOL: DEFAULT_CURRENCY_CODE,
      CONVERSIONLASTUPDATE: now,
      SUPPLY: DEFAULT_NUMERIC_VALUE,
      MKTCAP: price.usd_market_cap || DEFAULT_NUMERIC_VALUE,
      MKTCAPPENALTY: DEFAULT_NUMERIC_VALUE,
      CIRCULATINGSUPPLY: DEFAULT_NUMERIC_VALUE,
      CIRCULATINGSUPPLYMKTCAP: price.usd_market_cap || DEFAULT_NUMERIC_VALUE,
      TOTALVOLUME24H: volume24h,
      TOTALVOLUME24HTO: volume24hTo,
      TOTALTOPTIERVOLUME24H: volume24h,
      TOTALTOPTIERVOLUME24HTO: volume24hTo,
      IMAGEURL: `https://assets.coingecko.com/coins/images/${coinId}/large/${coinId}.png`,
    },
  }
}

/**
 * @see https://docs.coingecko.com/reference/simple-price
 *
 * Fetches current prices for multiple tokens using CoinGecko API through proxy.
 */
export async function legacy_fetchTokensPrice(
  symbols: string[],
  revalidate: Revalidation = MARKET_PROXY_REVALIDATION_TIMES.CURRENT_PRICE,
) {
  if (symbols.length === 0) return {}

  try {
    const coinIdMap = await _getCoinIdsFromSymbols(symbols)

    const coinIds = Object.values(coinIdMap).filter(Boolean)
    if (coinIds.length === 0) return {}

    const url = new URL(`${PROXY_BASE_URL}/v1/simple/price`)
    url.searchParams.set('ids', coinIds.join(','))
    url.searchParams.set('vs_currencies', 'usd')
    url.searchParams.set('include_24hr_change', 'true')
    url.searchParams.set('include_market_cap', 'true')
    url.searchParams.set('include_24hr_vol', 'true')

    const priceData = await _fetchWithAuth<
      Record<
        string,
        {
          usd: number
          usd_24h_change?: number
          usd_market_cap?: number
          usd_24h_vol?: number
        }
      >
    >(url, revalidate, 'legacy_fetchTokensPrice')

    const data: legacy_TokensPriceResponseBody['RAW'] = {}

    for (const symbol of symbols) {
      const coinId = coinIdMap[symbol.toLowerCase()]
      if (!coinId || !priceData[coinId]) continue

      const priceDataEntry = _convertCoinGeckoToLegacyPrice(
        symbol,
        coinId,
        priceData[coinId],
      )

      // Store with both original symbol and uppercase symbol for compatibility
      data[symbol] = priceDataEntry
      data[symbol.toUpperCase()] = priceDataEntry
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
  revalidate: Revalidation = MARKET_PROXY_REVALIDATION_TIMES.PRICE_FOR_DATE,
) {
  const data: Record<string, { USD: { PRICE: number } }> = {}

  // Get coin ids from symbols
  const coinIdMap = await _getCoinIdsFromSymbols(symbols)

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

      const url = new URL(`${PROXY_BASE_URL}/v1/coins/${coinId}/history`)
      url.searchParams.set('date', dateStr)
      url.searchParams.set('localization', 'false')

      const historyData = await _fetchWithAuth<{
        market_data: {
          current_price: { usd: number }
        }
      }>(url, revalidate, 'fetchTokensPriceForDate')

      if (historyData.market_data?.current_price?.usd) {
        data[symbol.toUpperCase()] = {
          USD: {
            PRICE: historyData.market_data.current_price.usd,
          },
        }
      }
    } catch (err) {
      console.warn(`No price data for ${symbol}:`, String(err))
    }
  }

  return data
}

// Cache for coin list to avoid repeated API calls
let coinListCache: Array<{ id: string; symbol: string; name: string }> | null =
  null
let coinListCacheTime = 0
const COIN_LIST_CACHE_TTL = 3600 * 1000 // 1 hour

/**
 * Helper function to get coin id from symbol
 */
export async function _getCoinIdFromSymbol(
  symbol: string,
): Promise<string | null> {
  const coinIdMap = await _getCoinIdsFromSymbols([symbol])
  return coinIdMap[symbol.toLowerCase()] || null
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

    // Find all coins with matching symbol
    const matchingCoins = coinList.filter(
      c => c.symbol.toLowerCase() === symbolLower,
    )

    if (matchingCoins.length === 0) {
      continue
    }

    // Prefer coin where coin ID exactly matches the symbol (e.g., "pepe" -> "pepe")
    // This helps distinguish between PEPE and BABYPEPE when both have "pepe" symbol
    const exactMatch = matchingCoins.find(
      c => c.id.toLowerCase() === symbolLower,
    )

    if (exactMatch) {
      result[symbolLower] = exactMatch.id
    } else {
      // If no exact match, use the first one found
      const coin = matchingCoins[0]
      if (coin.id.toLowerCase() !== symbolLower) {
        result[symbolLower] = coin.id
      }
    }
  }
  return result
}

/**
 * Helper function to get coin ids from symbols
 */
async function _getCoinIdsFromSymbols(
  symbols: string[],
): Promise<Record<string, string>> {
  const now = Date.now()

  // Use cache if available and not expired
  if (
    coinListCache &&
    coinListCacheTime > 0 &&
    now - coinListCacheTime < COIN_LIST_CACHE_TTL
  ) {
    return _mapSymbolsToCoinIds(symbols, coinListCache)
  }

  // Fetch coin list
  const url = new URL(`${PROXY_BASE_URL}/v1/coins/list`)

  try {
    coinListCache = await _fetchWithAuth<
      Array<{ id: string; symbol: string; name: string }>
    >(url, MARKET_PROXY_REVALIDATION_TIMES.TOKEN_METADATA, 'coin_list_cache')
    coinListCacheTime = now

    return _mapSymbolsToCoinIds(symbols, coinListCache)
  } catch (error) {
    console.error('Failed to fetch coin list:', error)
    return {}
  }
}

/**
 * Fetch with Basic Auth
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
      // Rate limited - could mark API key if we had one
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
