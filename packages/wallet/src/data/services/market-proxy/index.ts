/**
 * @see https://docs.coingecko.com/ for CoinGecko API documentation
 * @see https://test.market.status.im for proxy endpoint
 *
 * This module uses CoinGecko API through a proxy at https://test.market.status.im
 * Example: https://pro-api.coingecko.com/api/v3/coins/list -> https://test.market.status.im/v1/coins/list
 */

// import 'server-only'

import { markApiKeyAsRateLimited } from '../api-key-rotation'

import type {
  deprecated_TokensMetadataResponseBody,
  legacy_research_TokenMetadataResponseBody,
  legacy_TokenPriceHistoryResponseBody,
  legacy_TokensPriceResponseBody,
  TokenMetadataResponseBody,
} from './types'

const PROXY_BASE_URL = 'https://test.market.status.im'

// Get proxy auth from environment variables, fallback to 'test' for development
// Uses process.env directly to avoid TypeScript index signature issues with optional fields
const PROXY_AUTH = {
  username: process.env['MARKET_PROXY_AUTH_USERNAME'],
  password: process.env['MARKET_PROXY_AUTH_PASSWORD'],
}

export const CRYPTOCOMPARE_REVALIDATION_TIMES = {
  TRADING_PRICE: 15,
  CURRENT_PRICE: 60,
  PRICE_HISTORY: 3600,
  PRICE_HISTORY_DAILY: 3600,
  TOKEN_METADATA: 3600,
  PRICE_FOR_DATE: 15,
} as const

type Revalidation =
  (typeof CRYPTOCOMPARE_REVALIDATION_TIMES)[keyof typeof CRYPTOCOMPARE_REVALIDATION_TIMES]

/**
 * @see https://docs.coingecko.com/reference/coins-id-market-chart
 *
 * Fetches token price history using CoinGecko API through proxy.
 */
export async function legacy_fetchTokenPriceHistory(
  symbol: string,
  days: '1' | '7' | '30' | '90' | '365' | 'all' = '1',
  revalidate: Revalidation = CRYPTOCOMPARE_REVALIDATION_TIMES.PRICE_HISTORY,
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

  // Convert CoinGecko format to CryptoCompare format
  const data: legacy_TokenPriceHistoryResponseBody['Data']['Data'] =
    response.prices.map(([timestamp, price], index) => {
      const volume = response.total_volumes[index]?.[1] || 0

      return {
        time: Math.floor(timestamp / 1000), // Convert to seconds
        close: price,
        high: price, // CoinGecko doesn't provide high/low for hourly data
        low: price,
        open: price,
        volumefrom: volume,
        volumeto: volume * price,
        conversionType: 'direct',
        conversionSymbol: 'USD',
      }
    })

  return data
}

/**
 * @see https://docs.coingecko.com/reference/coins-id
 *
 * Fetches token metadata using CoinGecko API through proxy.
 */
export async function fetchTokenMetadata(
  symbol: string,
  revalidate: Revalidation = CRYPTOCOMPARE_REVALIDATION_TIMES.TOKEN_METADATA,
) {
  // First, get coin id from symbol
  const coinId = await _getCoinIdFromSymbol(symbol)
  if (!coinId) {
    throw new Error(`Coin not found for symbol: ${symbol}`)
  }

  // Validate coin id is not the same as symbol (which would indicate a lookup issue)
  // Note: For SNT, coin ID is "status" which is different from symbol "SNT", so this check passes
  if (coinId.toLowerCase() === symbol.toLowerCase()) {
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
    market_data: {
      current_price: { usd: number }
      market_cap: { usd: number }
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

  // Get description in preferred order: en, then any other language
  const getDescription = (): string => {
    if (!coinData.description) {
      return ''
    }

    if (coinData.description['en']) {
      return coinData.description['en']
    }
    // Try other common languages
    const languages = ['ko', 'ja', 'zh', 'es', 'fr', 'de', 'pt', 'ru']
    for (const lang of languages) {
      if (coinData.description[lang]) {
        return coinData.description[lang]
      }
    }
    // Return first available description
    const firstDescription = Object.values(coinData.description)[0] as
      | string
      | undefined
    if (firstDescription) {
      return firstDescription
    }

    return ''
  }

  const description = getDescription()

  // Convert CoinGecko format to CryptoCompare format
  const data: TokenMetadataResponseBody['Data'] = {
    ID: 0, // CoinGecko doesn't have numeric ID
    TYPE: 'CRYPTO',
    ID_LEGACY: 0,
    ID_PARENT_ASSET: null,
    ID_ASSET_ISSUER: 0,
    SYMBOL: coinData.symbol.toUpperCase(),
    URI: '',
    ASSET_TYPE: 'CRYPTO',
    ASSET_ISSUER_NAME: '',
    PARENT_ASSET_SYMBOL: null,
    CREATED_ON: 0,
    UPDATED_ON: Date.now(),
    PUBLIC_NOTICE: null,
    NAME: coinData.name,
    LOGO_URL: coinData.image.large || coinData.image.small,
    LAUNCH_DATE: 0,
    PREVIOUS_ASSET_SYMBOLS: null,
    ASSET_ALTERNATIVE_IDS: [],
    ASSET_DESCRIPTION_SNIPPET: description?.substring(0, 200) || '',
    ASSET_DECIMAL_POINTS: 18,
    SUPPORTED_PLATFORMS: [] as Array<{
      BLOCKCHAIN: string
      TOKEN_STANDARD: string
      BRIDGE_OPERATOR: string
      EXPLORER_URL: string
      SMART_CONTRACT_ADDRESS: string
      LAUNCH_DATE: number
      RETIRE_DATE?: number
      TRADING_AS: string
      DECIMALS: number
      IS_INHERITED: boolean
    }>,
    ASSET_CUSTODIANS: [],
    CONTROLLED_ADDRESSES: null,
    ASSET_SECURITY_METRICS: [],
    SUPPLY_MAX: coinData.market_data.max_supply || 0,
    SUPPLY_ISSUED: coinData.market_data.total_supply || 0,
    SUPPLY_TOTAL: coinData.market_data.total_supply || 0,
    SUPPLY_CIRCULATING: coinData.market_data.circulating_supply || 0,
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
    WEBSITE_URL: coinData.links.homepage?.[0] || '',
    BLOG_URL: '',
    WHITE_PAPER_URL: coinData.links.whitepaper || '',
    OTHER_DOCUMENT_URLS: [],
    EXPLORER_ADDRESSES: coinData.links.blockchain_site.map(url => ({
      URL: url,
    })),
    RPC_OPERATORS: [],
    IS_EXCLUDED_FROM_MKT_CAP_TOPLIST: null,
    ASSET_INDUSTRIES: [],
    CONSENSUS_MECHANISMS: [],
    CONSENSUS_ALGORITHM_TYPES: [],
    HASHING_ALGORITHM_TYPES: [],
    PRICE_USD: coinData.market_data.current_price.usd,
    PRICE_USD_SOURCE: 'CoinGecko',
    PRICE_USD_LAST_UPDATE_TS: Date.now(),
    MKT_CAP_PENALTY: 0,
    CIRCULATING_MKT_CAP_USD: coinData.market_data.market_cap.usd,
    TOTAL_MKT_CAP_USD: coinData.market_data.market_cap.usd,
    SPOT_MOVING_24_HOUR_QUOTE_VOLUME_TOP_TIER_DIRECT_USD: 0,
    SPOT_MOVING_24_HOUR_QUOTE_VOLUME_DIRECT_USD: 0,
    SPOT_MOVING_24_HOUR_QUOTE_VOLUME_TOP_TIER_USD: 0,
    SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD: coinData.market_data.total_volume.usd,
    SPOT_MOVING_7_DAY_QUOTE_VOLUME_TOP_TIER_DIRECT_USD: 0,
    SPOT_MOVING_7_DAY_QUOTE_VOLUME_DIRECT_USD: 0,
    SPOT_MOVING_7_DAY_QUOTE_VOLUME_TOP_TIER_USD: 0,
    SPOT_MOVING_7_DAY_QUOTE_VOLUME_USD: 0,
    SPOT_MOVING_30_DAY_QUOTE_VOLUME_TOP_TIER_DIRECT_USD: 0,
    SPOT_MOVING_30_DAY_QUOTE_VOLUME_DIRECT_USD: 0,
    SPOT_MOVING_30_DAY_QUOTE_VOLUME_TOP_TIER_USD: 0,
    SPOT_MOVING_30_DAY_QUOTE_VOLUME_USD: 0,
    SPOT_MOVING_24_HOUR_CHANGE_USD: coinData.market_data.price_change_24h,
    SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD:
      coinData.market_data.price_change_percentage_24h,
    SPOT_MOVING_7_DAY_CHANGE_USD: 0,
    SPOT_MOVING_7_DAY_CHANGE_PERCENTAGE_USD: 0,
    SPOT_MOVING_30_DAY_CHANGE_USD: 0,
    SPOT_MOVING_30_DAY_CHANGE_PERCENTAGE_USD: 0,
    TOPLIST_BASE_RANK: {
      CREATED_ON: 0,
      LAUNCH_DATE: 0,
      CIRCULATING_MKT_CAP_USD: coinData.market_data.market_cap.usd,
      TOTAL_MKT_CAP_USD: coinData.market_data.market_cap.usd,
      SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD:
        coinData.market_data.total_volume.usd,
      SPOT_MOVING_7_DAY_QUOTE_VOLUME_USD: 0,
      SPOT_MOVING_30_DAY_QUOTE_VOLUME_USD: 0,
    },
    ASSET_DESCRIPTION: description,
    ASSET_DESCRIPTION_SUMMARY: description?.substring(0, 500) || '',
    PROJECT_LEADERS: [],
    ASSOCIATED_CONTACT_DETAILS: [],
    SEO_TITLE: coinData.name,
    SEO_DESCRIPTION: description?.substring(0, 160) || '',
  }

  return data
}

/**
 * @see https://docs.coingecko.com/reference/coins-id
 *
 * Deprecated: Use fetchTokenMetadata instead.
 */
export async function deprecated_fetchTokenMetadata(
  symbol: string,
  revalidate: Revalidation = CRYPTOCOMPARE_REVALIDATION_TIMES.TOKEN_METADATA,
) {
  const metadata = await fetchTokenMetadata(symbol, revalidate)

  // Convert to deprecated format
  const data: deprecated_TokensMetadataResponseBody['Data'][string] = {
    ID: 0,
    TYPE: metadata.TYPE,
    ID_LEGACY: 0,
    ID_PARENT_ASSET: null,
    ID_ASSET_ISSUER: 0,
    SYMBOL: metadata.SYMBOL,
    URI: metadata.URI,
    ASSET_TYPE: metadata.ASSET_TYPE,
    ASSET_ISSUER_NAME: metadata.ASSET_ISSUER_NAME,
    PARENT_ASSET_SYMBOL: null,
    CREATED_ON: metadata.CREATED_ON,
    UPDATED_ON: metadata.UPDATED_ON,
    PUBLIC_NOTICE: metadata.PUBLIC_NOTICE,
    NAME: metadata.NAME,
    LOGO_URL: metadata.LOGO_URL,
    LAUNCH_DATE: metadata.LAUNCH_DATE,
    PREVIOUS_ASSET_SYMBOLS: metadata.PREVIOUS_ASSET_SYMBOLS,
    ASSET_ALTERNATIVE_IDS: metadata.ASSET_ALTERNATIVE_IDS,
    ASSET_DESCRIPTION_SNIPPET: metadata.ASSET_DESCRIPTION_SNIPPET,
    ASSET_DECIMAL_POINTS: metadata.ASSET_DECIMAL_POINTS,
    SUPPORTED_PLATFORMS: metadata.SUPPORTED_PLATFORMS.map(platform => ({
      BLOCKCHAIN: platform.BLOCKCHAIN,
      TOKEN_STANDARD: platform.TOKEN_STANDARD,
      BRIDGE_OPERATOR: platform.BRIDGE_OPERATOR,
      EXPLORER_URL: platform.EXPLORER_URL,
      SMART_CONTRACT_ADDRESS: platform.SMART_CONTRACT_ADDRESS,
      LAUNCH_DATE: platform.LAUNCH_DATE ?? 0,
      RETIRE_DATE: platform.RETIRE_DATE,
      TRADING_AS: platform.TRADING_AS,
      DECIMALS: platform.DECIMALS,
      IS_INHERITED: platform.IS_INHERITED,
    })),
    ASSET_CUSTODIANS: metadata.ASSET_CUSTODIANS,
    CONTROLLED_ADDRESSES: metadata.CONTROLLED_ADDRESSES,
    ASSET_SECURITY_METRICS: metadata.ASSET_SECURITY_METRICS,
    SUPPLY_MAX: metadata.SUPPLY_MAX,
    SUPPLY_ISSUED: metadata.SUPPLY_ISSUED,
    SUPPLY_TOTAL: metadata.SUPPLY_TOTAL,
    SUPPLY_CIRCULATING: metadata.SUPPLY_CIRCULATING,
    SUPPLY_FUTURE: metadata.SUPPLY_FUTURE,
    SUPPLY_LOCKED: metadata.SUPPLY_LOCKED,
    SUPPLY_BURNT: metadata.SUPPLY_BURNT,
    SUPPLY_STAKED: metadata.SUPPLY_STAKED,
    LAST_BLOCK_MINT: metadata.LAST_BLOCK_MINT,
    LAST_BLOCK_BURN: metadata.LAST_BLOCK_BURN,
    BURN_ADDRESSES: metadata.BURN_ADDRESSES,
    LOCKED_ADDRESSES: metadata.LOCKED_ADDRESSES,
    HAS_SMART_CONTRACT_CAPABILITIES: metadata.HAS_SMART_CONTRACT_CAPABILITIES,
    SMART_CONTRACT_SUPPORT_TYPE: metadata.SMART_CONTRACT_SUPPORT_TYPE,
    TARGET_BLOCK_MINT: metadata.TARGET_BLOCK_MINT,
    TARGET_BLOCK_TIME: metadata.TARGET_BLOCK_TIME,
    LAST_BLOCK_NUMBER: metadata.LAST_BLOCK_NUMBER,
    LAST_BLOCK_TIMESTAMP: metadata.LAST_BLOCK_TIMESTAMP,
    LAST_BLOCK_TIME: metadata.LAST_BLOCK_TIME,
    LAST_BLOCK_SIZE: metadata.LAST_BLOCK_SIZE,
    LAST_BLOCK_ISSUER: metadata.LAST_BLOCK_ISSUER,
    LAST_BLOCK_TRANSACTION_FEE_TOTAL: metadata.LAST_BLOCK_TRANSACTION_FEE_TOTAL,
    LAST_BLOCK_TRANSACTION_COUNT: metadata.LAST_BLOCK_TRANSACTION_COUNT,
    LAST_BLOCK_HASHES_PER_SECOND: metadata.LAST_BLOCK_HASHES_PER_SECOND,
    LAST_BLOCK_DIFFICULTY: metadata.LAST_BLOCK_DIFFICULTY,
    SUPPORTED_STANDARDS: metadata.SUPPORTED_STANDARDS,
    LAYER_TWO_SOLUTIONS: metadata.LAYER_TWO_SOLUTIONS,
    PRIVACY_SOLUTIONS: metadata.PRIVACY_SOLUTIONS,
    CODE_REPOSITORIES: metadata.CODE_REPOSITORIES,
    SUBREDDITS: metadata.SUBREDDITS,
    TWITTER_ACCOUNTS: metadata.TWITTER_ACCOUNTS,
    DISCORD_SERVERS: metadata.DISCORD_SERVERS,
    TELEGRAM_GROUPS: metadata.TELEGRAM_GROUPS,
    OTHER_SOCIAL_NETWORKS: metadata.OTHER_SOCIAL_NETWORKS,
    HELD_TOKEN_SALE: metadata.HELD_TOKEN_SALE,
    TOKEN_SALES: metadata.TOKEN_SALES,
    HELD_EQUITY_SALE: metadata.HELD_EQUITY_SALE,
    WEBSITE_URL: metadata.WEBSITE_URL,
    BLOG_URL: metadata.BLOG_URL,
    WHITE_PAPER_URL: metadata.WHITE_PAPER_URL,
    OTHER_DOCUMENT_URLS: metadata.OTHER_DOCUMENT_URLS,
    EXPLORER_ADDRESSES: metadata.EXPLORER_ADDRESSES,
    RPC_OPERATORS: metadata.RPC_OPERATORS,
    IS_EXCLUDED_FROM_MKT_CAP_TOPLIST: metadata.IS_EXCLUDED_FROM_MKT_CAP_TOPLIST,
    ASSET_INDUSTRIES: metadata.ASSET_INDUSTRIES,
    CONSENSUS_MECHANISMS: metadata.CONSENSUS_MECHANISMS,
    CONSENSUS_ALGORITHM_TYPES: metadata.CONSENSUS_ALGORITHM_TYPES,
    HASHING_ALGORITHM_TYPES: metadata.HASHING_ALGORITHM_TYPES,
    PRICE_USD: metadata.PRICE_USD,
    PRICE_USD_SOURCE: metadata.PRICE_USD_SOURCE,
    PRICE_USD_LAST_UPDATE_TS: metadata.PRICE_USD_LAST_UPDATE_TS,
    MKT_CAP_PENALTY: metadata.MKT_CAP_PENALTY,
    CIRCULATING_MKT_CAP_USD: metadata.CIRCULATING_MKT_CAP_USD,
    TOTAL_MKT_CAP_USD: metadata.TOTAL_MKT_CAP_USD,
    SPOT_MOVING_24_HOUR_QUOTE_VOLUME_TOP_TIER_DIRECT_USD:
      metadata.SPOT_MOVING_24_HOUR_QUOTE_VOLUME_TOP_TIER_DIRECT_USD,
    SPOT_MOVING_24_HOUR_QUOTE_VOLUME_DIRECT_USD:
      metadata.SPOT_MOVING_24_HOUR_QUOTE_VOLUME_DIRECT_USD,
    SPOT_MOVING_24_HOUR_QUOTE_VOLUME_TOP_TIER_USD:
      metadata.SPOT_MOVING_24_HOUR_QUOTE_VOLUME_TOP_TIER_USD,
    SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD:
      metadata.SPOT_MOVING_24_HOUR_QUOTE_VOLUME_USD,
    SPOT_MOVING_7_DAY_QUOTE_VOLUME_TOP_TIER_DIRECT_USD:
      metadata.SPOT_MOVING_7_DAY_QUOTE_VOLUME_TOP_TIER_DIRECT_USD,
    SPOT_MOVING_7_DAY_QUOTE_VOLUME_DIRECT_USD:
      metadata.SPOT_MOVING_7_DAY_QUOTE_VOLUME_DIRECT_USD,
    SPOT_MOVING_7_DAY_QUOTE_VOLUME_TOP_TIER_USD:
      metadata.SPOT_MOVING_7_DAY_QUOTE_VOLUME_TOP_TIER_USD,
    SPOT_MOVING_7_DAY_QUOTE_VOLUME_USD:
      metadata.SPOT_MOVING_7_DAY_QUOTE_VOLUME_USD,
    SPOT_MOVING_30_DAY_QUOTE_VOLUME_TOP_TIER_DIRECT_USD:
      metadata.SPOT_MOVING_30_DAY_QUOTE_VOLUME_TOP_TIER_DIRECT_USD,
    SPOT_MOVING_30_DAY_QUOTE_VOLUME_DIRECT_USD:
      metadata.SPOT_MOVING_30_DAY_QUOTE_VOLUME_DIRECT_USD,
    SPOT_MOVING_30_DAY_QUOTE_VOLUME_TOP_TIER_USD:
      metadata.SPOT_MOVING_30_DAY_QUOTE_VOLUME_TOP_TIER_USD,
    SPOT_MOVING_30_DAY_QUOTE_VOLUME_USD:
      metadata.SPOT_MOVING_30_DAY_QUOTE_VOLUME_USD,
    SPOT_MOVING_24_HOUR_CHANGE_USD: metadata.SPOT_MOVING_24_HOUR_CHANGE_USD,
    SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD:
      metadata.SPOT_MOVING_24_HOUR_CHANGE_PERCENTAGE_USD,
    SPOT_MOVING_7_DAY_CHANGE_USD: metadata.SPOT_MOVING_7_DAY_CHANGE_USD,
    SPOT_MOVING_7_DAY_CHANGE_PERCENTAGE_USD:
      metadata.SPOT_MOVING_7_DAY_CHANGE_PERCENTAGE_USD,
    SPOT_MOVING_30_DAY_CHANGE_USD: metadata.SPOT_MOVING_30_DAY_CHANGE_USD,
    SPOT_MOVING_30_DAY_CHANGE_PERCENTAGE_USD:
      metadata.SPOT_MOVING_30_DAY_CHANGE_PERCENTAGE_USD,
    TOPLIST_BASE_RANK: metadata.TOPLIST_BASE_RANK,
    ASSET_DESCRIPTION: metadata.ASSET_DESCRIPTION,
    ASSET_DESCRIPTION_SUMMARY: metadata.ASSET_DESCRIPTION_SUMMARY,
    PROJECT_LEADERS: metadata.PROJECT_LEADERS,
    ASSOCIATED_CONTACT_DETAILS: metadata.ASSOCIATED_CONTACT_DETAILS,
    SEO_TITLE: metadata.SEO_TITLE,
    SEO_DESCRIPTION: metadata.SEO_DESCRIPTION,
  }

  return data
}

/**
 * @see https://docs.coingecko.com/reference/coins-list
 *
 * Returns token metadata from CoinGecko coins list.
 */
export async function legacy_research_fetchTokenMetadata(
  symbol: string,
  revalidate: Revalidation = CRYPTOCOMPARE_REVALIDATION_TIMES.TOKEN_METADATA,
) {
  const url = new URL(`${PROXY_BASE_URL}/v1/coins/list`)
  // Note: include_platform parameter removed - API only accepts 'true' as valid boolean

  const coins = await _fetchWithAuth<
    Array<{ id: string; symbol: string; name: string }>
  >(url, revalidate, 'legacy_research_fetchTokenMetadata')

  const coin = coins.find(c => c.symbol.toLowerCase() === symbol.toLowerCase())

  if (!coin) {
    throw new Error(`Coin not found for symbol: ${symbol}`)
  }

  // Convert to legacy format
  const data: legacy_research_TokenMetadataResponseBody['Data'][string] = {
    Id: coin.id,
    Url: `https://www.coingecko.com/en/coins/${coin.id}`,
    ImageUrl: `https://assets.coingecko.com/coins/images/${coin.id}/large/${coin.id}.png`,
    ContentCreatedOn: 0,
    Name: coin.name,
    Symbol: coin.symbol.toUpperCase(),
    CoinName: coin.name,
    FullName: coin.name,
    Description: '',
    AssetTokenStatus: 'Active',
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
  }

  return data
}

/**
 * @see https://docs.coingecko.com/reference/simple-price
 *
 * Fetches current prices for multiple tokens using CoinGecko API through proxy.
 */
export async function legacy_fetchTokensPrice(
  symbols: string[],
  revalidate: Revalidation = CRYPTOCOMPARE_REVALIDATION_TIMES.CURRENT_PRICE,
) {
  if (symbols.length === 0) {
    return {}
  }

  try {
    // Get coin ids from symbols
    const coinIdMap = await _getCoinIdsFromSymbols(symbols)
    const coinIds = Object.values(coinIdMap).filter(Boolean)

    if (coinIds.length === 0) {
      return {}
    }

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

    // Convert to CryptoCompare format
    const data: legacy_TokensPriceResponseBody['RAW'] = {}

    for (const symbol of symbols) {
      const coinId = coinIdMap[symbol.toLowerCase()]
      if (!coinId || !priceData[coinId]) {
        continue
      }

      const price = priceData[coinId]
      const now = Math.floor(Date.now() / 1000)

      const priceDataEntry = {
        USD: {
          TYPE: '5',
          MARKET: 'CCCAGG',
          FROMSYMBOL: symbol.toUpperCase(),
          TOSYMBOL: 'USD',
          FLAGS: '4',
          PRICE: price.usd,
          LASTUPDATE: now,
          MEDIAN: price.usd,
          LASTVOLUME: 0,
          LASTVOLUMETO: 0,
          LASTTRADEID: '',
          VOLUMEDAY: 0,
          VOLUMEDAYTO: 0,
          VOLUME24HOUR: price.usd_24h_vol || 0,
          VOLUME24HOURTO: (price.usd_24h_vol || 0) * price.usd,
          OPENDAY: price.usd,
          HIGHDAY: price.usd,
          LOWDAY: price.usd,
          OPEN24HOUR: price.usd,
          HIGH24HOUR: price.usd,
          LOW24HOUR: price.usd,
          LASTMARKET: 'CoinGecko',
          VOLUMEHOUR: 0,
          VOLUMEHOURTO: 0,
          OPENHOUR: price.usd,
          HIGHHOUR: price.usd,
          LOWHOUR: price.usd,
          TOPTIERVOLUME24HOUR: price.usd_24h_vol || 0,
          TOPTIERVOLUME24HOURTO: (price.usd_24h_vol || 0) * price.usd,
          CHANGE24HOUR: (price.usd_24h_change || 0) * price.usd * 0.01,
          CHANGEPCT24HOUR: price.usd_24h_change || 0,
          CHANGEDAY: 0,
          CHANGEPCTDAY: 0,
          CHANGEHOUR: 0,
          CHANGEPCTHOUR: 0,
          CONVERSIONTYPE: 'direct',
          CONVERSIONSYMBOL: 'USD',
          CONVERSIONLASTUPDATE: now,
          SUPPLY: 0,
          MKTCAP: price.usd_market_cap || 0,
          MKTCAPPENALTY: 0,
          CIRCULATINGSUPPLY: 0,
          CIRCULATINGSUPPLYMKTCAP: price.usd_market_cap || 0,
          TOTALVOLUME24H: price.usd_24h_vol || 0,
          TOTALVOLUME24HTO: (price.usd_24h_vol || 0) * price.usd,
          TOTALTOPTIERVOLUME24H: price.usd_24h_vol || 0,
          TOTALTOPTIERVOLUME24HTO: (price.usd_24h_vol || 0) * price.usd,
          IMAGEURL: `https://assets.coingecko.com/coins/images/${coinId}/large/${coinId}.png`,
        },
      }

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
  revalidate: Revalidation = CRYPTOCOMPARE_REVALIDATION_TIMES.PRICE_FOR_DATE,
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
    const result: Record<string, string> = {}
    for (const symbol of symbols) {
      const coin = coinListCache.find(
        c => c.symbol.toLowerCase() === symbol.toLowerCase(),
      )
      if (coin) {
        // Only add if coin id is different from symbol (to avoid false matches)
        // Note: For SNT, coin ID is "status" which is different from symbol "SNT", so this check passes
        if (coin.id.toLowerCase() !== symbol.toLowerCase()) {
          result[symbol.toLowerCase()] = coin.id
        }
      }
    }
    return result
  }

  // Fetch coin list
  const url = new URL(`${PROXY_BASE_URL}/v1/coins/list`)
  // Note: include_platform parameter removed - API only accepts 'true' as valid boolean

  try {
    coinListCache = await _fetchWithAuth<
      Array<{ id: string; symbol: string; name: string }>
    >(url, CRYPTOCOMPARE_REVALIDATION_TIMES.TOKEN_METADATA, 'coin_list_cache')
    coinListCacheTime = now

    const result: Record<string, string> = {}
    for (const symbol of symbols) {
      const coin = coinListCache.find(
        c => c.symbol.toLowerCase() === symbol.toLowerCase(),
      )
      if (coin) {
        // Only add if coin id is different from symbol (to avoid false matches)
        // Note: For SNT, coin ID is "status" which is different from symbol "SNT", so this check passes
        if (coin.id.toLowerCase() !== symbol.toLowerCase()) {
          result[symbol.toLowerCase()] = coin.id
        }
      }
    }
    return result
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
    // why: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#reusing-data-across-multiple-functions
    // why: https://github.com/vercel/next.js/issues/70946
    cache: 'force-cache',
    next: {
      revalidate,
      // todo?: revalidate on error
      // @see https://github.com/vercel/next.js/discussions/57792 for vercel caching error response
      tags: [tag],
    },
  })

  if (!response.ok) {
    // Try to read error response body for better error messages
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

    // For 404 errors, it might be a proxy server issue or coin not found
    // We'll let the caller handle it (they can catch and use fallback)

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
