// import 'server-only'

import retry from 'async-retry'

import { serverEnv } from '../../config/env.server.mjs'

import type { NetworkType } from '../api/types'

export type Ticker = {
  base: string
  target: string
  market: {
    name: string
    identifier: string
    has_trading_incentive: boolean
    logo: string
  }
  last: number
  volume: number
  converted_last: {
    btc: number
    eth: number
    usd: number
  }
  converted_volume: {
    btc: number
    eth: number
    usd: number
  }
  trust_score: 'green' | 'yellow' | 'red' | null
  bid_ask_spread_percentage: number
  timestamp: string
  last_traded_at: string
  cost_to_move_up_usd: number
  cost_to_move_down_usd: number
  last_fetch_at: string
  is_anomaly: boolean
  is_stale: boolean
  trade_url: string
  token_info_url: string
  coin_id: string
  target_coin_id: string
}

export type Market = {
  name: string
  tickers: Ticker[]
}

export type Coin = {
  id: string
  symbol: string
  name: string
  platforms: Record<string, string>
}

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

export const getCoins = async (): Promise<Coin[]> => {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/list', {
    next: {
      revalidate: 3600, // 1 hour
    },
  })
  const coins = await response.json()

  return coins
}

export const getMarket = async (): Promise<Market> => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/coins/status/tickers?include_exchange_logo=true&order=volume_desc&depth=true',
    {
      next: {
        revalidate: 3600, // 1 hour
      },
    },
  )
  const market = await response.json()

  return market
}

export const getNativeTokenPrice = async (network: NetworkType) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoNativeTokens[network]}&vs_currencies=eur&include_24hr_change=true`,
    {
      headers: {
        'Content-Type': 'application/json',
        'x-cg-demo-api-key': serverEnv.COINGECKO_API_KEY,
        'Cache-Control': 'private, max-age=3600',
      },
      next: {
        revalidate: 3600,
      },
    },
  )

  if (!response.ok) {
    console.error(response.statusText)
    throw new Error(`Failed to fetch prices for native token`)
  }

  const prices = await response.json()

  return prices[coingeckoNativeTokens[network]]
}

export const getNativeTokenPriceChartData = async (
  network: NetworkType,
  days: '1' | '7' | '30' | '90' | '365' | 'all' = '1',
) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coingeckoNativeTokens[network]}/market_chart?vs_currency=eur&days=${days}`,
    {
      next: {
        revalidate: 3600,
      },
    },
  )

  if (!response.ok) {
    console.error(response.statusText)
    throw new Error(`Failed to fetch chart data for native token`)
  }

  const chartData = await response.json()
  const prices = chartData.prices

  return calculateHourlyPrices(prices)
}

export const getERC20TokenPriceChartData = async (
  address: string,
  network: NetworkType,
  days: '1' | '7' | '30' | '90' | '365' | 'all' = '1',
) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coingeckoNetworks[network]}/contract/${address}/market_chart?vs_currency=eur&days=${days}`,
    {
      next: {
        revalidate: 3600,
      },
    },
  )

  if (!response.ok) {
    console.error(response.statusText)
    throw new Error(`Failed to fetch chart data for erc20 token`)
  }

  const chartData = await response.json()
  const prices = chartData.prices

  return calculateHourlyPrices(prices)
}

// todo: rename to marketdata
export const getNativeTokenMetadata = async (network: NetworkType) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coingeckoNativeTokens[network]}?=localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`,
    {
      next: {
        revalidate: 3600,
      },
    },
  )

  if (!response.ok) {
    console.error(response.statusText)
    throw new Error(`Failed to fetch metadata for native token`)
  }

  const metadata = await response.json()

  return metadata
}

export const getERC20TokenMetadata = async (address: string) => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/id/contract/${address}?=localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`,
    {
      next: {
        revalidate: 3600,
      },
    },
  )

  if (!response.ok) {
    console.error(response.statusText)
    throw new Error(`Failed to fetch metadata for erc20 token`)
  }

  const metadata = await response.json()

  return metadata
}

export const getERC20TokensPrice = async (
  addresses: string[],
  network: NetworkType,
) => {
  const _addresses = addresses.filter(Boolean)

  if (!_addresses.length) {
    return {
      [network]: null,
    }
  }

  const response = await retry(
    async () => {
      const result = await fetch(
        `https://api.coingecko.com/api/v3/simple/token_price/${
          coingeckoNetworks[network]
        }?contract_addresses=${addresses.join(
          ',',
        )}&vs_currencies=eur&include_24hr_change=true`,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-cg-demo-api-key': serverEnv.COINGECKO_API_KEY,
            'Cache-Control': 'private, max-age=3600',
          },
          next: {
            revalidate: 3600,
          },
        },
      )

      if (result.ok) {
        return result
      }

      // `Too many requests` https://docs.coingecko.com/reference/common-errors-rate-limit
      if (result.status === 429) {
        throw new Error(result.statusText)
      }

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

  if (!response.ok) {
    console.error(response.statusText)
    throw new Error(`Failed to fetch prices for ${network}`)
  }

  const prices = await response.json()

  return prices
}

export const getTokenList = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/list', {
    next: {
      revalidate: 3600, // 1 hour
    },
    headers: {
      'x-cg-demo-api-key': serverEnv.COINGECKO_API_KEY,
    },
  })
  const tokens = await response.json()

  if (!response.ok) {
    console.error(response.statusText)
    throw new Error('Failed to fetch tokens')
  }

  return tokens
}

type NFTFloorPriceResponseBody = {
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
/**
 * @see https://docs.coingecko.com/v3.0.1/reference/nfts-contract-address
 */
export const getNFTFloorPrice = async (
  contract: string,
  network: NetworkType,
) => {
  const url = new URL(
    `https://api.coingecko.com/api/v3/nfts/${coingeckoNetworks[network]}/contract/${contract}`,
  )

  const response = await fetch(url, {
    headers: {
      'x-cg-demo-api-key': serverEnv.COINGECKO_API_KEY,
    },
    next: {
      revalidate: 3600,
    },
  })

  if (!response.ok) {
    console.error(response.statusText)
    throw new Error(`Failed to fetch nft floor price`)
  }

  const body: NFTFloorPriceResponseBody = await response.json()
  const data = body.floor_price.native_currency

  return data
}

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
