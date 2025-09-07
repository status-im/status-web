/**
 * Alchemy Prices API and Token API response types
 *
 * @see https://www.alchemy.com/docs/reference/prices-api-quickstart for Prices API
 * @see https://www.alchemy.com/docs/reference/alchemy-gettokenmetadata for Token API
 */

export type AlchemyTokenPricesBySymbolResponseBody = {
  data: Array<{
    symbol: string
    prices: Array<{
      currency: string
      value: string
      lastUpdatedAt: string
    }>
    error?: string
  }>
}

export type AlchemyTokenPricesByAddressResponseBody = {
  data: Array<{
    network: string
    address: string
    prices: Array<{
      currency: string
      value: string
      lastUpdatedAt: string
    }>
    error?: string
  }>
}

export type AlchemyHistoricalTokenPricesResponseBody = {
  symbol: string
  currency: string
  data: Array<{
    value: string
    timestamp: string
    marketCap?: string
    totalVolume?: string
  }>
}

// Token API Response Types

export type AlchemyTokenMetadataResponseBody = {
  name: string | null
  symbol: string | null
  decimals: number | null
  logo: string | null
}

// Error Response Type

export type AlchemyErrorResponse = {
  error: {
    code: number
    message: string
  }
}

// ERC20 Token List Types (existing token list structure)

export type ERC20Token = {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI?: string
  extensions?: {
    bridgeInfo?: Record<
      string,
      {
        tokenAddress: string
      }
    >
    l1Address?: string
    l2GatewayAddress?: string
    l1GatewayAddress?: string
  }
}

export type ERC20TokenList = {
  $schema: string
  name: string
  timestamp: string
  version: {
    major: number
    minor: number
    patch: number
  }
  tokens: ERC20Token[]
}

// Transformed Response Types (compatible with CryptoCompare)

export type AlchemyTransformedPriceResponse = {
  [symbol: string]: {
    USD: {
      TYPE: string
      MARKET: string
      FROMSYMBOL: string
      TOSYMBOL: string
      FLAGS: string
      PRICE: number
      LASTUPDATE: number
      MEDIAN: number
      LASTVOLUME: number
      LASTVOLUMETO: number
      LASTTRADEID: string
      VOLUMEDAY: number
      VOLUMEDAYTO: number
      VOLUME24HOUR: number
      VOLUME24HOURTO: number
      OPENDAY: number
      HIGHDAY: number
      LOWDAY: number
      OPEN24HOUR: number
      HIGH24HOUR: number
      LOW24HOUR: number
      LASTMARKET: string
      VOLUMEHOUR: number
      VOLUMEHOURTO: number
      OPENHOUR: number
      HIGHHOUR: number
      LOWHOUR: number
      TOPTIERVOLUME24HOUR: number
      TOPTIERVOLUME24HOURTO: number
      CHANGE24HOUR: number
      CHANGEPCT24HOUR: number
      CHANGEDAY: number
      CHANGEPCTDAY: number
      CHANGEHOUR: number
      CHANGEPCTHOUR: number
      CONVERSIONTYPE: string
      CONVERSIONSYMBOL: string
      CONVERSIONLASTUPDATE: number
      SUPPLY: number
      MKTCAP: number
      MKTCAPPENALTY: number
      CIRCULATINGSUPPLY: number
      CIRCULATINGSUPPLYMKTCAP: number
      TOTALVOLUME24H: number
      TOTALVOLUME24HTO: number
      TOTALTOPTIERVOLUME24H: number
      TOTALTOPTIERVOLUME24HTO: number
      IMAGEURL: string
    }
  }
}

export type AlchemyTransformedHistoryResponse = Array<{
  time: number
  close: number
  high: number
  low: number
  open: number
  volumefrom: number
  volumeto: number
  conversionType: string
  conversionSymbol: string
}>

export type AlchemyTransformedMetadataResponse = {
  ID: number
  TYPE: string
  SYMBOL: string
  NAME: string
  LOGO_URL: string
  ASSET_DESCRIPTION_SNIPPET: string
  ASSET_DECIMAL_POINTS: number
  PRICE_USD?: number
  PRICE_USD_LAST_UPDATE_TS?: number
}
