import { cache } from 'react'

import { z } from 'zod'

import erc20TokenList from '../../../constants/erc20.json'
import nativeTokenList from '../../../constants/native.json'
import { toChecksumAddress } from '../../../utils'
import {
  fetchTokenBalanceHistory,
  getERC20TokensBalance,
  getNativeTokenBalance,
} from '../../services/alchemy'
import {
  COINGECKO_REVALIDATION_TIMES,
  fetchTokenMarkets,
  fetchTokenMetadata,
  fetchTokenPriceHistory,
  fetchTokensPrice,
} from '../../services/coingecko/index'
import { nodesProcedure, router } from '../lib/trpc'

import type {
  CoinGeckoCoinDetailResponse,
  CoinGeckoMarketsResponse,
} from '../../services/coingecko/types'
import type { NetworkType } from '../types'

type ERC20Token = (typeof erc20TokenList)['tokens'][number]

const tokenMetadataSchema = z.object({
  market_cap: z.number(),
  fully_diluted: z.number(),
  circulation: z.number(),
  total_supply: z.number(),
  all_time_high: z.number(),
  all_time_low: z.number(),
  rank_by_market_cap: z.number().nullable(),
  about: z.string(),
  volume_24: z.number(),
})

type Asset = {
  networks: NetworkType[]
  icon: string
  name: string
  symbol: string
  price_eur: number
  price_percentage_24h_change: number
  balance: number
  total_eur: number
  decimals?: number
  metadata: {
    market_cap: number
    fully_diluted: number
    circulation: number
    total_supply: number
    all_time_high: number
    all_time_low: number
    rank_by_market_cap: number | null
    about: string
    volume_24: number
    // links: Record<
    //   'website' | 'twitter' | 'github' | 'reddit' | 'instagram',
    //   string
    // >
  }
} & (
  | {
      native: true
      contract: null
    }
  | {
      native: false
      contract: string
    }
)

const STATUS_NETWORKS: Record<number, NetworkType> = {
  1: 'ethereum',
}

export const DEFAULT_TOKEN_SYMBOLS = [
  'ETH',
  'SNT',
  'USDC',
  'USDT',
  'LINK',
  'PEPE',
  'UNI',
  'SHIB',
] as const

export type DefaultTokenSymbol = (typeof DEFAULT_TOKEN_SYMBOLS)[number]

export const DEFAULT_TOKEN_IDS: Record<string, string> = {
  ETH: 'ethereum',
  SNT: 'status',
  USDC: 'usd-coin',
  USDT: 'tether',
  LINK: 'chainlink',
  PEPE: 'pepe',
  UNI: 'uniswap',
  SHIB: 'shiba-inu',
}

function buildTokenSummary(
  assets: Asset[],
  defaultIcon: string,
  defaultName: string,
  defaultSymbol: string,
) {
  const summary = sum(assets)
  const firstAsset = assets[0]

  return {
    ...summary,
    icon: defaultIcon,
    name: defaultName,
    symbol: defaultSymbol,
    about: firstAsset?.metadata.about ?? '',
    contracts: assets.reduce(
      (acc, asset) => {
        if (asset.contract) {
          acc[asset.networks[0]] = asset.contract
        }
        return acc
      },
      {} as Record<NetworkType, string>,
    ),
  }
}

function filterTokensByNetworks<T extends { chainId: number }>(
  tokens: T[],
  networks: NetworkType[],
): T[] {
  return tokens.filter(token =>
    Object.entries(STATUS_NETWORKS)
      .filter(([, network]) => networks.includes(network))
      .map(([chainId]) => Number(chainId))
      .includes(token.chainId),
  )
}

/**
 * Fetch all CoinGecko data for a token (price, price history, markets, metadata)
 */
async function fetchTokenData(
  symbol: string,
  options?: { skipMetadata?: boolean },
) {
  const { skipMetadata = false } = options ?? {}

  const pricePromise = fetchTokensPrice(
    [symbol],
    COINGECKO_REVALIDATION_TIMES.CURRENT_PRICE,
  ).then(prices => prices[symbol])

  const priceHistoryPromise = skipMetadata
    ? Promise.resolve({
        prices: [],
        market_caps: [],
        total_volumes: [],
      } as Awaited<ReturnType<typeof fetchTokenPriceHistory>>)
    : fetchTokenPriceHistory(
        symbol,
        'all',
        COINGECKO_REVALIDATION_TIMES.PRICE_HISTORY,
      )

  const tokenMarketsPromise = skipMetadata
    ? Promise.resolve(null)
    : fetchTokenMarkets(symbol, COINGECKO_REVALIDATION_TIMES.CURRENT_PRICE)

  const tokenMetadataPromise = skipMetadata
    ? Promise.resolve(null)
    : fetchTokenMetadata(
        symbol,
        COINGECKO_REVALIDATION_TIMES.TOKEN_METADATA,
      ).catch(() => null)

  const [price, priceHistory, tokenMarkets, tokenMetadata] = await Promise.all([
    pricePromise,
    priceHistoryPromise,
    tokenMarketsPromise,
    tokenMetadataPromise,
  ])

  return {
    price,
    priceHistory,
    tokenMarkets,
    tokenMetadata,
  }
}

export const assetsRouter = router({
  all: nodesProcedure
    .input(
      z.object({
        address: z.string(),
        networks: z.array(z.enum(['ethereum'])),
      }),
    )
    .query(async ({ input }) => {
      // return await all({
      //   address: input.address,
      //   networks: input.networks,
      // })

      // const inputHash = JSON.stringify({
      //   address: input.address,
      //   networks: input.networks,
      // })
      const inputHash = JSON.stringify(input)

      return await cachedAll(inputHash)
    }),
  nativeToken: nodesProcedure
    .input(
      z.object({
        address: z.string(),
        networks: z.array(z.enum(['ethereum'])),
        symbol: z.string(),
        skipMetadata: z.boolean().optional(),
        previousMetadata: tokenMetadataSchema.optional(),
      }),
    )
    .query(async ({ input }) => {
      const { skipMetadata, previousMetadata, ...rest } = input
      const inputHash = JSON.stringify(rest)

      if (skipMetadata) {
        return await nativeToken({
          ...rest,
          skipMetadata: true,
          previousMetadata,
        })
      }

      return await cachedNativeToken(inputHash)
    }),
  token: nodesProcedure
    .input(
      z.object({
        address: z.string(),
        networks: z.array(z.enum(['ethereum'])),
        contract: z.string(),
        skipMetadata: z.boolean().optional(),
        previousMetadata: tokenMetadataSchema.optional(),
      }),
    )
    .query(async ({ input }) => {
      const { skipMetadata, previousMetadata, ...rest } = input
      const inputHash = JSON.stringify(rest)

      if (skipMetadata) {
        return await token({
          ...rest,
          skipMetadata: true,
          previousMetadata,
        })
      }

      return await cachedToken(inputHash)
    }),
  nativeTokenPriceChart: nodesProcedure
    .input(
      z.object({
        symbol: z.string(),
        days: z.enum(['1', '7', '30', '90', '365', 'all']).optional(),
      }),
    )
    .query(async ({ input }) => {
      const inputHash = JSON.stringify(input)

      return await cachedNativeTokenPriceChart(inputHash)
    }),
  tokenPriceChart: nodesProcedure
    .input(
      z.object({
        symbol: z.string(),
        days: z.enum(['1', '7', '30', '90', '365', 'all']).optional(),
      }),
    )
    .query(async ({ input }) => {
      const inputHash = JSON.stringify(input)

      return await cachedTokenPriceChart(inputHash)
    }),
  nativeTokenBalanceChart: nodesProcedure
    .input(
      z.object({
        address: z.string(),
        networks: z.array(z.enum(['ethereum'])),
        days: z.enum(['1', '7', '30', '90', '365', 'all']).optional(),
      }),
    )
    .query(async ({ input }) => {
      const inputHash = JSON.stringify(input)

      return await cachedNativeTokenBalanceChart(inputHash)
    }),
  tokenBalanceChart: nodesProcedure
    .input(
      z.object({
        address: z.string(),
        networks: z.array(z.enum(['ethereum'])),
        days: z.enum(['1', '7', '30', '90', '365', 'all']).optional(),
        contract: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const inputHash = JSON.stringify(input)

      return await cachedTokenBalanceChart(inputHash)
    }),
})

const cachedAll = cache(async (key: string) => {
  const { address, networks } = JSON.parse(key)

  return await all({ address, networks })
})

async function all({
  address,
  networks,
}: {
  address: string
  networks: NetworkType[]
}) {
  try {
    const assets: Omit<Asset, 'metadata'>[] = []

    // Native tokens
    const filteredNativeTokens = filterTokensByNetworks(
      nativeTokenList.tokens,
      networks,
    )

    await Promise.all(
      filteredNativeTokens.map(async token => {
        const balance = await getNativeTokenBalance(
          address,
          STATUS_NETWORKS[token.chainId],
        )

        const price = (await fetchTokensPrice([token.symbol]))[token.symbol]

        // Skip if price data is not available
        if (!price || price.usd === undefined) {
          console.warn(
            `Price data not available for token ${token.symbol}, skipping`,
          )
          return
        }

        const asset: Omit<Asset, 'metadata'> = {
          networks: [STATUS_NETWORKS[token.chainId]],
          native: true,
          contract: null,
          icon: token.logoURI,
          name: token.name,
          symbol: token.symbol,
          price_eur: price.usd,
          price_percentage_24h_change: price.usd_24h_change ?? 0,
          balance: Number(balance) / 10 ** token.decimals,
          total_eur: (Number(balance) / 10 ** token.decimals) * price.usd,
          decimals: token.decimals,
        }

        assets.push(asset)
      }),
    )

    // ERC20 tokens
    const filteredERC20Tokens = new Map(
      filterTokensByNetworks(erc20TokenList.tokens, networks).map(token => [
        toChecksumAddress(token.address),
        token,
      ]),
    )

    const ERC20TokensByNetwork = Array.from(
      filteredERC20Tokens.values(),
    ).reduce(
      (acc, token) => {
        const network = STATUS_NETWORKS[token.chainId]
        if (!acc[network]) acc[network] = []
        acc[network].push(token)
        return acc
      },
      {} as Record<NetworkType, ERC20Token[]>,
    )

    const partialERC20Assets: Map<
      string,
      Omit<
        Asset,
        'metadata' | 'price_eur' | 'price_percentage_24h_change' | 'total_eur'
      >
    > = new Map()

    for (const [network] of Object.entries(ERC20TokensByNetwork) as Array<
      [string, ERC20Token[]]
    >) {
      let pageKey: string | undefined

      try {
        do {
          const result = await getERC20TokensBalance(
            address,
            network as NetworkType,
            undefined,
            pageKey,
          )

          for (const balance of result.tokenBalances) {
            const tokenBalance = Number(balance.tokenBalance)

            if (tokenBalance > 0) {
              const token = filteredERC20Tokens.get(
                toChecksumAddress(balance.contractAddress),
              )
              if (token) {
                const checksummedAddress = toChecksumAddress(
                  balance.contractAddress,
                )
                partialERC20Assets.set(checksummedAddress, {
                  networks: [network as NetworkType],
                  native: false,
                  contract: checksummedAddress,
                  icon: token.logoURI,
                  name: token.name,
                  symbol: token.symbol,
                  balance: tokenBalance / 10 ** token.decimals,
                  decimals: token.decimals,
                })
              }
            }
          }

          pageKey = result.pageKey
        } while (pageKey)
      } catch (error) {
        console.error(
          `[assets.all] Failed to fetch ERC20 token balances for ${network}:`,
          error,
        )
      }
    }

    const batchSize = 300
    const partialAssetEntries = Array.from(partialERC20Assets.entries())

    for (let i = 0; i < partialAssetEntries.length; i += batchSize) {
      const batch = partialAssetEntries.slice(i, i + batchSize)
      const symbols = [...new Set(batch.map(([, asset]) => asset.symbol))]

      const prices = await fetchTokensPrice(symbols)

      for (const [, partialAsset] of batch) {
        const price = prices[partialAsset.symbol]

        if (price && price.usd !== undefined) {
          const asset: Omit<Asset, 'metadata'> = {
            ...partialAsset,
            price_eur: price.usd,
            price_percentage_24h_change: price.usd_24h_change ?? 0,
            total_eur: partialAsset.balance * price.usd,
            decimals: partialAsset.decimals,
          }

          assets.push(asset)
        }
      }
    }

    const aggregatedAssets = assets.reduce(
      (acc, asset) => {
        const existingAsset = acc.find(_asset => _asset.symbol === asset.symbol)

        if (!existingAsset) {
          return [...acc, asset]
        }

        existingAsset.networks.push(asset.networks[0])

        existingAsset.balance += asset.balance

        existingAsset.total_eur += asset.total_eur

        existingAsset.price_eur =
          (existingAsset.price_eur + asset.price_eur) / 2

        existingAsset.price_percentage_24h_change =
          (existingAsset.price_percentage_24h_change +
            asset.price_percentage_24h_change) /
          2

        return acc
      },
      [] as Omit<Asset, 'metadata'>[],
    )

    const existingSymbols = aggregatedAssets.map(a => a.symbol)

    const missingSymbols = DEFAULT_TOKEN_SYMBOLS.filter(
      s => !existingSymbols.includes(s),
    )

    if (missingSymbols.length > 0) {
      const prices = await fetchTokensPrice(
        missingSymbols,
        COINGECKO_REVALIDATION_TIMES.CURRENT_PRICE,
      )

      for (const symbol of missingSymbols) {
        const token = erc20TokenList.tokens.find(
          t => t.symbol === symbol && t.chainId === 1,
        )

        if (token && prices[symbol] && prices[symbol].usd !== undefined) {
          aggregatedAssets.push({
            networks: ['ethereum'],
            native: false,
            contract: token.address,
            icon: token.logoURI,
            name: token.name,
            symbol: token.symbol,
            price_eur: prices[symbol].usd,
            price_percentage_24h_change: prices[symbol].usd_24h_change ?? 0,
            balance: 0,
            total_eur: 0,
            decimals: token.decimals,
          })
        }
      }
    }

    aggregatedAssets.sort((a, b) => b.total_eur - a.total_eur)

    const summary = sum(aggregatedAssets)

    return {
      address,
      networks,
      assets: aggregatedAssets,
      summary,
    }
  } catch (error) {
    console.error('[assets.all] Error:', error)
    throw error
  }
}

const cachedNativeToken = cache(async (key: string) => {
  const { address, networks, symbol } = JSON.parse(key)

  return await nativeToken({ address, networks, symbol })
})

async function nativeToken({
  address,
  networks,
  symbol,
  skipMetadata = false,
  previousMetadata,
}: {
  address: string
  networks: NetworkType[]
  symbol: string
  skipMetadata?: boolean
  previousMetadata?: Asset['metadata']
}) {
  const filteredNativeTokens = filterTokensByNetworks(
    nativeTokenList.tokens,
    networks,
  ).filter(token => token.symbol === symbol)

  if (!filteredNativeTokens.length) {
    throw new Error('Token not found')
  }

  const assets: Partial<Record<NetworkType, Asset>> = {}

  // fixme: not found contract but at least 1 other returns
  await Promise.allSettled(
    filteredNativeTokens.map(async token => {
      const balance = await getNativeTokenBalance(
        address,
        STATUS_NETWORKS[token.chainId],
      )

      if (!Number(balance) && token.symbol.toUpperCase() !== 'ETH') {
        throw new Error('Balance not found')
      }

      const { price, priceHistory, tokenMarkets, tokenMetadata } =
        await fetchTokenData(token.symbol, { skipMetadata })

      const asset: Asset = map({
        token,
        balance,
        price,
        priceHistory,
        tokenMarkets,
        tokenMetadata,
        previousMetadata: skipMetadata ? previousMetadata : undefined,
      })
      assets[STATUS_NETWORKS[token.chainId]] = asset
    }),
  )

  const assetsArray = Object.values(assets).flat()

  return {
    summary: buildTokenSummary(
      assetsArray,
      filteredNativeTokens[0].logoURI,
      filteredNativeTokens[0].name,
      filteredNativeTokens[0].symbol,
    ),
    assets,
  }
}

const cachedToken = cache(async (key: string) => {
  const { address, networks, contract } = JSON.parse(key)

  return await token({ address, networks, contract })
})

async function token({
  address,
  networks,
  contract,
  skipMetadata = false,
  previousMetadata,
}: {
  address: string
  networks: NetworkType[]
  contract: string
  skipMetadata?: boolean
  previousMetadata?: Asset['metadata']
}) {
  const erc20Token = erc20TokenList.tokens.find(
    token =>
      token.address === contract &&
      networks.includes(STATUS_NETWORKS[token.chainId]),
  )

  if (!erc20Token) {
    throw new Error('Token not found')
  }

  const bridgedERC20Tokens = getBridgedERC20Tokens(erc20Token, networks)

  const filteredERC20Tokens = bridgedERC20Tokens.length
    ? bridgedERC20Tokens
    : [erc20Token]

  const assets: Partial<Record<NetworkType, Asset>> = {}

  // fixme: not found contract but at least 1 other returns
  await Promise.allSettled(
    filteredERC20Tokens.map(async token => {
      const result = await getERC20TokensBalance(
        address,
        STATUS_NETWORKS[token.chainId],
        [token.address],
      )

      if (
        !Number(result.tokenBalances[0].tokenBalance) &&
        !DEFAULT_TOKEN_SYMBOLS.includes(token.symbol)
      ) {
        throw new Error(`Balance not found for token ${token.symbol}`)
      }

      const { price, priceHistory, tokenMarkets, tokenMetadata } =
        await fetchTokenData(token.symbol, { skipMetadata })

      const asset = map({
        token,
        balance: result.tokenBalances[0].tokenBalance,
        price,
        priceHistory,
        tokenMarkets,
        tokenMetadata,
        previousMetadata: skipMetadata ? previousMetadata : undefined,
      })
      assets[STATUS_NETWORKS[token.chainId]] = asset
    }),
  )

  const assetsArray = Object.values(assets).flat()

  return {
    summary: buildTokenSummary(
      assetsArray,
      erc20Token.logoURI,
      erc20Token.name,
      erc20Token.symbol,
    ),
    assets,
  }
}

const cachedTokenPriceChart = cache(async (key: string) => {
  const { symbol, days } = JSON.parse(key)

  return await tokenPriceChart({ symbol, days })
})

async function tokenPriceChart({
  symbol,
  days,
}: {
  symbol: string
  days?: '1' | '7' | '30' | '90' | '365' | 'all'
}) {
  const data = await fetchTokenPriceHistory(symbol, days)

  return data.prices.map(([timestamp, price]: [number, number]) => ({
    date: new Date(timestamp).toISOString(),
    price: price,
  }))
}

const cachedNativeTokenPriceChart = cache(async (key: string) => {
  const { symbol, days } = JSON.parse(key)

  return await tokenPriceChart({ symbol, days })
})

const cachedNativeTokenBalanceChart = cache(async (key: string) => {
  const { address, networks, days } = JSON.parse(key)

  return await nativeTokenBalanceChart({ address, networks, days })
})

async function nativeTokenBalanceChart({
  address,
  networks,
  days,
}: {
  address: string
  networks: NetworkType[]
  days?: '1' | '7' | '30' | '90' | '365' | 'all'
}) {
  const currentTime = Math.floor(Date.now() / 1000)
  const decimals = 18

  const responses = await Promise.all(
    networks.map(async network => {
      const data = await fetchTokenBalanceHistory(
        address,
        network,
        days,
        undefined,
        currentTime,
        decimals,
      )

      return { [network]: data } as Record<
        NetworkType,
        { date: string; price: number }[]
      >
    }),
  )

  const result = aggregateTokenBalanceHistory(responses)

  result.reverse()

  return result
}

const cachedTokenBalanceChart = cache(async (key: string) => {
  const { address, networks, contract, days } = JSON.parse(key)

  return await tokenBalanceChart({ address, networks, contract, days })
})

async function tokenBalanceChart({
  address,
  networks,
  contract,
  days,
}: {
  address: string
  networks: NetworkType[]
  contract: string
  days?: '1' | '7' | '30' | '90' | '365' | 'all'
}) {
  const erc20Token = erc20TokenList.tokens.find(
    token =>
      token.address === contract &&
      networks.includes(STATUS_NETWORKS[token.chainId]),
  )

  if (!erc20Token) {
    throw new Error('Token not found')
  }

  const bridgedERC20Tokens = getBridgedERC20Tokens(erc20Token, networks)

  const filteredERC20Tokens = bridgedERC20Tokens.length
    ? bridgedERC20Tokens
    : [erc20Token]

  const currentTime = Math.floor(Date.now() / 1000)

  const responses = await Promise.all(
    filteredERC20Tokens.map(async token => {
      const data = await fetchTokenBalanceHistory(
        address,
        STATUS_NETWORKS[token.chainId],
        days,
        token.address,
        currentTime,
        token.decimals,
      )

      return { [STATUS_NETWORKS[token.chainId]]: data } as Record<
        NetworkType,
        { date: string; price: number }[]
      >
    }),
  )

  const result = aggregateTokenBalanceHistory(responses)

  result.reverse()

  return result
}

function getBridgedERC20Tokens(
  erc20Token: ERC20Token,
  networks: NetworkType[],
) {
  let bridgedERC20Tokens = []

  if (STATUS_NETWORKS[erc20Token.chainId] === 'ethereum') {
    bridgedERC20Tokens = erc20TokenList.tokens.filter(token => {
      if (!networks.includes(STATUS_NETWORKS[token.chainId])) {
        return false
      }

      if (
        erc20Token.extensions?.bridgeInfo?.[
          token.chainId.toString() as keyof typeof erc20Token.extensions.bridgeInfo
        ]?.tokenAddress === token.address
      ) {
        return true
      }

      return false
    })

    bridgedERC20Tokens.push(erc20Token)
  } else {
    const erc20TokenOnEthereum = erc20TokenList.tokens.find(
      token =>
        token.address === erc20Token.extensions?.bridgeInfo?.[1]?.tokenAddress,
    )

    bridgedERC20Tokens = erc20TokenList.tokens.filter(token => {
      if (!networks.includes(STATUS_NETWORKS[token.chainId])) {
        return false
      }

      if (
        erc20TokenOnEthereum?.extensions?.bridgeInfo?.[
          token.chainId.toString() as keyof typeof erc20TokenOnEthereum.extensions.bridgeInfo
        ]?.tokenAddress === token.address
      ) {
        return true
      }

      return false
    })

    if (erc20TokenOnEthereum) {
      bridgedERC20Tokens.push(erc20TokenOnEthereum)
    }
  }

  return bridgedERC20Tokens
}

function aggregateTokenBalanceHistory(
  responses: Array<Record<NetworkType, Array<{ date: string; price: number }>>>,
) {
  const aggregate = responses.reduce(
    (acc, response) => {
      const data = Object.values(response)[0]

      data.forEach(item => {
        const key = item.date

        if (!acc[key]) {
          acc[key] = {
            date: key,
            price: 0,
          }
        }

        acc[key].price += item.price
      })

      return acc
    },
    {} as Record<string, { date: string; price: number }>,
  )

  return Object.values(aggregate).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
}

/**
 * Calculate fully diluted market cap
 * Fully diluted = price * maxSupply (or totalSupply if maxSupply is not available)
 */
function calculateFullyDiluted(
  priceUsd: number,
  maxSupply: number | null,
  totalSupply: number,
): number {
  if (maxSupply && maxSupply > 0) {
    return priceUsd * maxSupply
  }

  if (totalSupply > 0) {
    return priceUsd * totalSupply
  }

  return 0
}

/**
 * Extract token description from CoinGecko metadata
 * Prefers English description, falls back to any available language
 */
function extractTokenDescription(
  tokenMetadata: CoinGeckoCoinDetailResponse | null,
): string {
  if (!tokenMetadata?.description) {
    return ''
  }

  return (
    tokenMetadata.description['en'] ||
    Object.values(tokenMetadata.description)[0] ||
    ''
  )
}

function map(data: {
  token:
    | (typeof nativeTokenList.tokens)[number]
    | (typeof erc20TokenList.tokens)[number]
  balance: string
  price: Awaited<ReturnType<typeof fetchTokensPrice>>[string]
  priceHistory: Awaited<ReturnType<typeof fetchTokenPriceHistory>>
  tokenMarkets: CoinGeckoMarketsResponse[number] | null
  tokenMetadata: CoinGeckoCoinDetailResponse | null
  previousMetadata?: Asset['metadata']
}): Asset {
  const {
    token,
    balance,
    price,
    priceHistory,
    tokenMarkets,
    tokenMetadata,
    previousMetadata,
  } = data

  // CoinGecko price history format: prices is [timestamp, price][]
  const prices = priceHistory.prices
    .map(([, price]: [number, number]) => price)
    .filter((p: number) => p > 0)

  // Get price from /simple/price
  const priceUsd = price.usd

  // Get market data from /coins/markets
  const maxSupply = tokenMarkets?.max_supply ?? null
  const totalSupply = tokenMarkets?.total_supply ?? null
  const circulation = tokenMarkets?.circulating_supply ?? null
  const volume24 = tokenMarkets?.total_volume ?? null

  // Use /simple/price market_cap first (updated every 60s) as it's more real-time
  const marketCap = price.usd_market_cap ?? tokenMarkets?.market_cap ?? 0
  const rankByMarketCap = tokenMarkets?.market_cap_rank ?? null

  // Use markets data or fallback to calculated values
  const finalTotalSupply =
    totalSupply ?? (marketCap > 0 && priceUsd > 0 ? marketCap / priceUsd : 0)

  const finalCirculation =
    circulation ?? (marketCap > 0 && priceUsd > 0 ? marketCap / priceUsd : 0)

  const finalVolume24 = volume24 ?? price.usd_24h_vol ?? 0

  const fullyDiluted = calculateFullyDiluted(
    priceUsd,
    maxSupply,
    finalTotalSupply,
  )

  const about =
    previousMetadata?.about ?? extractTokenDescription(tokenMetadata)

  // Build base metadata with dynamic fields
  const baseMetadata = {
    market_cap: marketCap,
    volume_24: finalVolume24,
    rank_by_market_cap:
      rankByMarketCap ?? previousMetadata?.rank_by_market_cap ?? null,
  }

  // If previousMetadata exists, merge with base (preserving static fields)
  // Otherwise, create full metadata with all fields
  const metadata = previousMetadata
    ? {
        ...previousMetadata,
        ...baseMetadata,
      }
    : {
        ...baseMetadata,
        fully_diluted: fullyDiluted,
        circulation: finalCirculation,
        total_supply: finalTotalSupply,
        all_time_high: prices.length ? Math.max(...prices) : priceUsd,
        all_time_low: prices.length ? Math.min(...prices) : priceUsd,
        about,
      }

  return {
    networks: [STATUS_NETWORKS[token.chainId]],
    ...('address' in token
      ? { contract: token.address, native: false }
      : { native: true, contract: null }),
    icon: token.logoURI,
    name: token.name,
    symbol: token.symbol,
    price_eur: price.usd,
    price_percentage_24h_change: price.usd_24h_change ?? 0,
    balance: Number(balance) / 10 ** token.decimals,
    total_eur: (Number(balance) / 10 ** token.decimals) * price.usd,
    decimals: token.decimals,
    metadata,
  }
}

function sum(assets: Asset[] | Omit<Asset, 'metadata'>[]) {
  const total_balance = assets.reduce((acc, asset) => acc + asset.balance, 0)

  const total_eur = assets.reduce((acc, asset) => acc + asset.total_eur, 0)

  const total_eur_24h_change = assets.reduce(
    (acc, asset) =>
      acc + asset.total_eur * (asset.price_percentage_24h_change / 100),
    0,
  )
  const total_percentage_24h_change = total_eur
    ? (total_eur_24h_change / total_eur) * 100
    : 0

  return {
    total_balance,
    total_eur,
    total_eur_24h_change,
    total_percentage_24h_change,
  }
}
