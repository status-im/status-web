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

/**
 * NFT Floor Price Response
 * @see https://docs.coingecko.com/v3.0.1/reference/nfts-contract-address
 */
export type CoinGeckoNFTFloorPriceResponse = {
  id: string
  contract_address: string
  asset_platform_id: string
  name: string
  symbol: string
  image: {
    small: string
  }
  banner_image: string
  description: string
  native_currency: string
  native_currency_symbol: string
  floor_price: {
    native_currency: number
    usd: number
  }
  market_cap: {
    native_currency: number
    usd: number
  }
  volume_24h: {
    native_currency: number
    usd: number
  }
  floor_price_in_usd_24h_percentage_change: number
  floor_price_24h_percentage_change: {
    usd: number
    native_currency: number
  }
  market_cap_24h_percentage_change: {
    usd: number
    native_currency: number
  }
  volume_24h_percentage_change: {
    usd: number
    native_currency: number
  }
  number_of_unique_addresses: number
  number_of_unique_addresses_24h_percentage_change: number
  volume_in_usd_24h_percentage_change: number
  total_supply: number
  one_day_sales: number
  one_day_sales_24h_percentage_change: number
  one_day_average_sale_price: number
  one_day_average_sale_price_24h_percentage_change: number
  links: {
    homepage: string
    twitter: string
    discord: string
  }
  floor_price_7d_percentage_change: {
    usd: number
    native_currency: number
  }
  floor_price_14d_percentage_change: {
    usd: number
    native_currency: number
  }
  floor_price_30d_percentage_change: {
    usd: number
    native_currency: number
  }
  floor_price_60d_percentage_change: {
    usd: number
    native_currency: number
  }
  floor_price_1y_percentage_change: {
    usd: number
    native_currency: number
  }
  explorers: Array<{
    name: string
    link: string
  }>
  user_favorites_count: number
  ath: {
    native_currency: number
    usd: number
  }
  ath_change_percentage: {
    native_currency: number
    usd: number
  }
  ath_date: {
    native_currency: string
    usd: string
  }
}
