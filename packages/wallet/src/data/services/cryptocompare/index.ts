/**
 * @see https://developers.cryptocompare.com/settings/api-keys for usage
 * @see https://developers.cryptocompare.com/pricing for pricing
 * @see https://developers.cryptocompare.com/documentation/data-api/admin_v2_rate_limit for rate limits
 * @see https://status.cryptocompare.com for CryptoCompare status
 * @see https://developers.cryptocompare.com/documentation for documentation
 *
 * @see https://github.com/status-im/status-go/blob/3179532b645549c103266e007694d2c81a7091b4/services/wallet/thirdparty/cryptocompare/client.go for Go implementation
 */

// import 'server-only'

import { serverEnv } from '../../../config/env.server.mjs'
import {
  getRandomApiKey,
  markApiKeyAsRateLimited,
  markApiKeyAsSuccessful,
} from '../api-key-rotation'

import type {
  deprecated_TokensMetadataResponseBody,
  legacy_research_TokenMetadataResponseBody,
  legacy_TokenPriceHistoryResponseBody,
  legacy_TokensPriceResponseBody,
  TokenMetadataResponseBody,
} from './types'

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
 * @see https://min-api.cryptocompare.com/documentation?key=Historical&cat=dataHistoday
 * @see https://min-api.cryptocompare.com/documentation?key=Historical&cat=dataHistohour
 *
 * note: Tries to convert to USD if CCCAGG market does not exist for coin pair.
 */
export async function legacy_fetchTokenPriceHistory(
  symbol: string,
  days: '1' | '7' | '30' | '90' | '365' | 'all' = '1',
  revalidate: Revalidation = CRYPTOCOMPARE_REVALIDATION_TIMES.PRICE_HISTORY,
) {
  if (days === 'all') {
    const url = new URL('https://min-api.cryptocompare.com/data/v2/histoday')
    url.searchParams.set('fsym', symbol)
    url.searchParams.set('tsym', 'USD')
    url.searchParams.set('allData', 'true')
    url.searchParams.set('tryConversion', 'false')
    url.searchParams.set(
      'api_key',
      getRandomApiKey(serverEnv.CRYPTOCOMPARE_API_KEYS),
    )

    const body = await _fetch<legacy_TokenPriceHistoryResponseBody>(
      url,
      revalidate,
      'legacy_fetchTokenPriceHistory_today',
    )
    const data = body.Data.Data

    return data
  }

  // fixme: use date-fns
  const from =
    Math.floor(new Date().getTime() / 1000) - Number(days) * 24 * 60 * 60
  let to = Math.floor(Date.now() / 1000) // for historical data before this timestamp
  let _data: legacy_TokenPriceHistoryResponseBody['Data']['Data'] = []

  do {
    const url = new URL('https://min-api.cryptocompare.com/data/v2/histohour')
    url.searchParams.set('fsym', symbol)
    url.searchParams.set('tsym', 'USD')
    url.searchParams.set('toTs', to.toString())
    url.searchParams.set('limit', '2000')
    url.searchParams.set('tryConversion', 'false')
    url.searchParams.set(
      'api_key',
      getRandomApiKey(serverEnv.CRYPTOCOMPARE_API_KEYS),
    )

    const body = await _fetch<legacy_TokenPriceHistoryResponseBody>(
      url,
      revalidate,
      'legacy_fetchTokenPriceHistory_hour',
    )
    const data = body.Data.Data

    _data = [...data, ..._data]

    to = data[0].time
  } while (to >= from)

  const data = _data.filter(item => item.time >= from)

  return data
}

// todo?: use for current price as well (lacks USD)
// todo?: use https://developers.cryptocompare.com/documentation/data-api/asset_v1_summary_list if full metadata is not needed
// fixme?: use CCData id instead of symbol by extending token list
// todo?: use contract address lookup https://developers.cryptocompare.com/documentation/data-api/onchain_v2_data_by_address instead
/**
 * @see https://developers.cryptocompare.com/documentation/data-api/asset_v1_metadata
 */
export async function fetchTokenMetadata(
  symbol: string,
  revalidate: Revalidation = CRYPTOCOMPARE_REVALIDATION_TIMES.TOKEN_METADATA,
) {
  const url = new URL('https://data-api.cryptocompare.com/asset/v1/metadata')
  url.searchParams.set('asset', symbol)
  url.searchParams.set('asset_lookup_priority', 'SYMBOL')
  url.searchParams.set('quote_asset', 'USD')
  url.searchParams.set(
    'api_key',
    getRandomApiKey(serverEnv.CRYPTOCOMPARE_API_KEYS),
  )

  const body = await _fetch<TokenMetadataResponseBody>(
    url,
    revalidate,
    'fetchTokenMetadata',
  )
  const data = body.Data

  return data
}

// todo?: use https://min-api.cryptocompare.com/data/coin/generalinfo?fsyms=OP,ARB,SNT,USDT&tsym=USD instead (no docs)
/**
 * @see https://developers.cryptocompare.com/documentation/data-api/asset_v1_data_by_symbol
 */
export async function deprecated_fetchTokenMetadata(
  symbol: string,
  revalidate: Revalidation = CRYPTOCOMPARE_REVALIDATION_TIMES.TOKEN_METADATA,
) {
  const url = new URL(
    'https://data-api.cryptocompare.com/asset/v1/data/by/symbol',
  )
  url.searchParams.set('asset_symbol', symbol)
  url.searchParams.set(
    'api_key',
    getRandomApiKey(serverEnv.CRYPTOCOMPARE_API_KEYS),
  )

  const body = await _fetch<deprecated_TokensMetadataResponseBody>(
    url,
    revalidate,
    'deprecated_fetchTokenMetadata',
  )
  const data = body.Data[symbol]

  return data
}

// note: not based on a full list
/**
 * Returns all the coins that CryptoCompare has added to the website. This is not the full list of coins we have in the system, it is just the list of coins we have done some research on.
 *
 * @see https://min-api.cryptocompare.com/documentation?key=Other&cat=allCoinsWithContentEndpoint
 */
export async function legacy_research_fetchTokenMetadata(
  symbol: string,
  revalidate: Revalidation = CRYPTOCOMPARE_REVALIDATION_TIMES.TOKEN_METADATA,
) {
  const url = new URL('https://min-api.cryptocompare.com/data/all/coinlist')
  url.searchParams.set('fsym', symbol)
  url.searchParams.set(
    'api_key',
    getRandomApiKey(serverEnv.CRYPTOCOMPARE_API_KEYS),
  )

  const body = await _fetch<legacy_research_TokenMetadataResponseBody>(
    url,
    revalidate,
    'legacy_research_fetchTokenMetadata',
  )
  const data = body.Data[symbol]

  return data
}

// todo?: use https://min-api.cryptocompare.com/documentation?key=Price&cat=multipleSymbolsPriceEndpoint insetad (not full)
/**
 * @see https://min-api.cryptocompare.com/documentation?key=Price&cat=multipleSymbolsFullPriceEndpoint
 */
export async function legacy_fetchTokensPrice(
  symbols: string[],
  revalidate: Revalidation = CRYPTOCOMPARE_REVALIDATION_TIMES.CURRENT_PRICE,
) {
  const url = new URL('https://min-api.cryptocompare.com/data/pricemultifull')
  url.searchParams.set('fsyms', symbols.join(','))
  url.searchParams.set('tsyms', 'USD')
  url.searchParams.set('relaxedValidation', 'true')
  url.searchParams.set(
    'api_key',
    getRandomApiKey(serverEnv.CRYPTOCOMPARE_API_KEYS),
  )

  try {
    const body = await _fetch<legacy_TokensPriceResponseBody>(
      url,
      revalidate,
      'legacy_fetchTokensPrice',
    )
    const data = body.RAW

    return data
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes('market does not exist')
    ) {
      console.warn('Removed failing symbols, retrying without them')

      const errorMatch = error.message.match(/\((\w+)-USD\)/)
      if (errorMatch && errorMatch[1]) {
        const failedSymbol = errorMatch[1]
        const filteredSymbols = symbols.filter(s => s !== failedSymbol)

        if (filteredSymbols.length > 0) {
          return await legacy_fetchTokensPrice(filteredSymbols, revalidate)
        }
      }
    }

    console.error('Failed to fetch prices:', error)
    return {}
  }
}

/**
 * Returns the price of a tokens at a specific timestamp.
 * @see https://min-api.cryptocompare.com/documentation?key=Historical&cat=dataHistoday
 */
export async function fetchTokensPriceForDate(
  symbols: string[],
  timestamp: number,
  revalidate: Revalidation = CRYPTOCOMPARE_REVALIDATION_TIMES.PRICE_FOR_DATE,
) {
  const data: Record<string, { USD: { PRICE: number } }> = {}

  for (const symbol of symbols) {
    try {
      const url = new URL('https://min-api.cryptocompare.com/data/v2/histoday')
      url.searchParams.set('fsym', symbol)
      url.searchParams.set('tsym', 'USD')
      url.searchParams.set('toTs', timestamp.toString())
      url.searchParams.set('limit', '1')
      url.searchParams.set('tryConversion', 'false')
      url.searchParams.set(
        'api_key',
        getRandomApiKey(serverEnv.CRYPTOCOMPARE_API_KEYS),
      )

      const body = await _fetch<legacy_TokenPriceHistoryResponseBody>(
        url,
        revalidate,
        'fetchTokensPriceForDate',
      )
      const prices = body.Data.Data

      if (prices.length > 0) {
        data[symbol] = {
          USD: {
            PRICE: prices[0].close,
          },
        }
      }
    } catch (err) {
      console.warn(`No price data for ${symbol}:`, String(err))
    }
  }

  return data
}

async function _fetch<
  T extends
    | legacy_TokensPriceResponseBody
    | deprecated_TokensMetadataResponseBody
    | legacy_research_TokenMetadataResponseBody
    | legacy_TokenPriceHistoryResponseBody
    | TokenMetadataResponseBody,
>(url: URL, revalidate: number, tag: string): Promise<T> {
  const response = await fetch(url, {
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
    console.error(response.statusText)

    if (response.status === 429) {
      const apiKey = url.searchParams.get('api_key')
      if (apiKey) {
        markApiKeyAsRateLimited(apiKey)
      }
    }

    throw new Error('Failed to fetch.')
  }

  const body: T = await response.json()

  if ('Response' in body && body.Response !== 'Success') {
    console.error(body.Message)

    const message = 'Message' in body ? String(body.Message).toLowerCase() : ''
    if (message.includes('rate limit')) {
      const apiKey = url.searchParams.get('api_key')
      if (apiKey) {
        markApiKeyAsRateLimited(apiKey)
      }
    }

    throw new Error('Failed to fetch.')
  }

  const apiKey = url.searchParams.get('api_key')
  if (apiKey) {
    markApiKeyAsSuccessful(apiKey)
  }

  return body
}
