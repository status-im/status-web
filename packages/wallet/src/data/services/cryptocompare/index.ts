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

import type {
  deprecated_TokensMetadataResponseBody,
  legacy_research_TokenMetadataResponseBody,
  legacy_TokenPriceHistoryResponseBody,
  legacy_TokensPriceResponseBody,
  TokenMetadataResponseBody,
} from './types'

/**
 * @see https://min-api.cryptocompare.com/documentation?key=Historical&cat=dataHistoday
 * @see https://min-api.cryptocompare.com/documentation?key=Historical&cat=dataHistohour
 *
 * note: Tries to convert to EUR if CCCAGG market does not exist for coin pair.
 */
export async function legacy_fetchTokenPriceHistory(
  symbol: string,
  days: '1' | '7' | '30' | '90' | '365' | 'all' = '1',
) {
  if (days === 'all') {
    const url = new URL('https://min-api.cryptocompare.com/data/v2/histoday')
    url.searchParams.set('fsym', symbol)
    url.searchParams.set('tsym', 'EUR')
    url.searchParams.set('allData', 'true')
    url.searchParams.set('tryConversion', 'true')
    url.searchParams.set('api_key', serverEnv.CRYPTOCOMPARE_API_KEY)

    const body = await _fetch<legacy_TokenPriceHistoryResponseBody>(url, 3600)
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
    url.searchParams.set('tsym', 'EUR')
    url.searchParams.set('toTs', to.toString())
    url.searchParams.set('limit', '2000')
    url.searchParams.set('tryConversion', 'true')
    url.searchParams.set('api_key', serverEnv.CRYPTOCOMPARE_API_KEY)

    const body = await _fetch<legacy_TokenPriceHistoryResponseBody>(url, 3600)
    const data = body.Data.Data

    _data = [...data, ..._data]

    to = data[0].time
  } while (to >= from)

  const data = _data.filter(item => item.time >= from)

  return data
}

// todo?: use for current price as well (lacks EUR)
// todo?: use https://developers.cryptocompare.com/documentation/data-api/asset_v1_summary_list if full metadata is not needed
// fixme?: use CCData id instead of symbol by extending token list
// todo?: use contract address lookup https://developers.cryptocompare.com/documentation/data-api/onchain_v2_data_by_address instead
/**
 * @see https://developers.cryptocompare.com/documentation/data-api/asset_v1_metadata
 */
export async function fetchTokenMetadata(symbol: string) {
  const url = new URL('https://data-api.cryptocompare.com/asset/v1/metadata')
  url.searchParams.set('asset', symbol)
  url.searchParams.set('asset_lookup_priority', 'SYMBOL')
  url.searchParams.set('quote_asset', 'EUR')
  url.searchParams.set('api_key', serverEnv.CRYPTOCOMPARE_API_KEY)

  const body = await _fetch<TokenMetadataResponseBody>(url, 3600)
  const data = body.Data

  return data
}

// todo?: use https://min-api.cryptocompare.com/data/coin/generalinfo?fsyms=OP,ARB,SNT,USDT&tsym=EUR instead (no docs)
/**
 * @see https://developers.cryptocompare.com/documentation/data-api/asset_v1_data_by_symbol
 */
export async function deprecated_fetchTokenMetadata(symbol: string) {
  const url = new URL(
    'https://data-api.cryptocompare.com/asset/v1/data/by/symbol',
  )
  url.searchParams.set('asset_symbol', symbol)
  url.searchParams.set('api_key', serverEnv.CRYPTOCOMPARE_API_KEY)

  const body = await _fetch<deprecated_TokensMetadataResponseBody>(url, 3600)
  const data = body.Data[symbol]

  return data
}

// note: not based on a full list
/**
 * Returns all the coins that CryptoCompare has added to the website. This is not the full list of coins we have in the system, it is just the list of coins we have done some research on.
 *
 * @see https://min-api.cryptocompare.com/documentation?key=Other&cat=allCoinsWithContentEndpoint
 */
export async function legacy_research_fetchTokenMetadata(symbol: string) {
  const url = new URL('https://min-api.cryptocompare.com/data/all/coinlist')
  url.searchParams.set('fsym', symbol)
  url.searchParams.set('api_key', serverEnv.CRYPTOCOMPARE_API_KEY)

  const body = await _fetch<legacy_research_TokenMetadataResponseBody>(
    url,
    3600,
  )
  const data = body.Data[symbol]

  return data
}

// todo?: use https://min-api.cryptocompare.com/documentation?key=Price&cat=multipleSymbolsPriceEndpoint insetad (not full)
/**
 * @see https://min-api.cryptocompare.com/documentation?key=Price&cat=multipleSymbolsFullPriceEndpoint
 */
export async function legacy_fetchTokensPrice(symbols: string[]) {
  const url = new URL('https://min-api.cryptocompare.com/data/pricemultifull')
  url.searchParams.set('fsyms', symbols.join(','))
  url.searchParams.set('tsyms', 'EUR')
  url.searchParams.set('relaxedValidation', 'true')
  url.searchParams.set('api_key', serverEnv.CRYPTOCOMPARE_API_KEY)

  const body = await _fetch<legacy_TokensPriceResponseBody>(url, 3600)
  const data = body.RAW

  return data
}

async function _fetch<
  T extends
    | legacy_TokensPriceResponseBody
    | deprecated_TokensMetadataResponseBody
    | legacy_research_TokenMetadataResponseBody
    | legacy_TokenPriceHistoryResponseBody
    | TokenMetadataResponseBody,
>(url: URL, revalidate: number): Promise<T> {
  const response = await fetch(url, {
    // why: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#reusing-data-across-multiple-functions
    // why: https://github.com/vercel/next.js/issues/70946
    cache: 'force-cache', // memoize
    next: {
      revalidate,
    },
  })

  if (!response.ok) {
    console.error(response.statusText)
    throw new Error('Failed to fetch.')
  }

  const body: T = await response.json()

  if ('Response' in body && body.Response !== 'Success') {
    console.error(body.Message)
    throw new Error('Failed to fetch.')
  }

  return body
}
