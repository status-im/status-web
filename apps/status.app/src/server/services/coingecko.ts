import 'server-only'

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
    }
  )
  const market = await response.json()

  return market
}
