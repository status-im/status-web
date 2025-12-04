/**
 * CoinGecko API Response Types
 * @see https://docs.coingecko.com/ for CoinGecko API documentation
 */

/**
 * Market Chart Response
 * @see https://docs.coingecko.com/reference/coins-id-market-chart
 */
export type CoinGeckoMarketChartResponse = {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

/**
 * Coin Detail Response
 * @see https://docs.coingecko.com/reference/coins-id
 */
export type CoinGeckoCoinDetailResponse = {
  id: string
  symbol: string
  name: string
  image: {
    small: string
    large: string
    thumb: string
  }
  market_cap_rank?: number | null
  market_data: {
    current_price: {
      usd: number
      [key: string]: number
    }
    market_cap: {
      usd: number
      [key: string]: number
    }
    market_cap_rank?: number | null
    total_volume: {
      usd: number
      [key: string]: number
    }
    price_change_24h: number
    price_change_percentage_24h: number
    price_change_percentage_7d?: number
    price_change_percentage_30d?: number
    circulating_supply: number
    total_supply: number
    max_supply: number | null
    high_24h?: {
      usd: number
      [key: string]: number
    }
    low_24h?: {
      usd: number
      [key: string]: number
    }
  }
  description: Record<string, string>
  links: {
    homepage: string[]
    blockchain_site: string[]
    whitepaper: string | null
    official_forum_url?: string[]
    subreddit_url?: string
    repos_url?: {
      github?: string[]
      bitbucket?: string[]
    }
  }
  platforms?: Record<string, string>
  genesis_date?: string
  contract_address?: string
}

/**
 * Simple Price Response
 * @see https://docs.coingecko.com/reference/simple-price
 */
export type CoinGeckoSimplePriceResponse = Record<
  string,
  {
    usd: number
    usd_24h_change?: number
    usd_market_cap?: number
    usd_24h_vol?: number
    [key: string]: number | undefined
  }
>

/**
 * Coin List Response
 * @see https://docs.coingecko.com/reference/coins-list
 */
export type CoinGeckoCoinListResponse = Array<{
  id: string
  symbol: string
  name: string
  platforms?: Record<string, string>
}>

/**
 * Coin History Response
 * @see https://docs.coingecko.com/reference/coins-id-history
 */
export type CoinGeckoCoinHistoryResponse = {
  id: string
  symbol: string
  name: string
  image: {
    thumb: string
    small: string
  }
  market_data: {
    current_price: {
      usd: number
      [key: string]: number
    }
  }
  localization: Record<string, string>
}
