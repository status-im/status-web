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
  alchemy_fetchTokenMetadata,
  alchemy_fetchTokenPriceHistory,
  alchemy_fetchTokensPrice,
} from '../../services/alchemy-prices'
import {
  // CRYPTOCOMPARE_REVALIDATION_TIMES,
  // fetchTokenMetadata,
  legacy_fetchTokenPriceHistory,
  // legacy_fetchTokensPrice,
} from '../../services/cryptocompare'
import { publicProcedure, router } from '../lib/trpc'

import type { NetworkType } from '../types'

type ERC20Token = (typeof erc20TokenList)['tokens'][number]

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
    fully_dilluted: number
    circulation: number
    total_supply: number
    all_time_high: number
    all_time_low: number
    rank_by_market_cap: number
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

const DEFAULT_TOKEN_SYMBOLS = [
  'ETH',
  'SNT',
  'USDC',
  'USDT',
  'LINK',
  'PEPE',
  'UNI',
  'SHIB',
]

export const assetsRouter = router({
  all: publicProcedure
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
  nativeToken: publicProcedure
    .input(
      z.object({
        address: z.string(),
        networks: z.array(z.enum(['ethereum'])),
        symbol: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const inputHash = JSON.stringify(input)

      return await cachedNativeToken(inputHash)
    }),
  token: publicProcedure
    .input(
      z.object({
        address: z.string(),
        networks: z.array(z.enum(['ethereum'])),
        contract: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const inputHash = JSON.stringify(input)

      return await cachedToken(inputHash)
    }),
  nativeTokenPriceChart: publicProcedure
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
  tokenPriceChart: publicProcedure
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
  nativeTokenBalanceChart: publicProcedure
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
  tokenBalanceChart: publicProcedure
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

// const cachedAll = cache(async (address: string, networks: NetworkType[]) => {
//   return await all({ address, networks })
// })

// const cachedAll = cache((address: string, networks: NetworkType[]) => {
//   return all({ address, networks })
// })

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
  // await cachedDelay()
  // console.log(' DELAY all()')
  // await delay()

  try {
    const assets: Omit<Asset, 'metadata'>[] = []

    // note: https://docs.alchemy.com/reference/alchemy-gettokenbalances can now return native tokens together with ERC20 tokens
    // Native tokens
    const filteredNativeTokens = nativeTokenList.tokens.filter(token =>
      Object.entries(STATUS_NETWORKS)
        .filter(([, network]) => networks.includes(network))
        .map(([chainId]) => Number(chainId))
        .includes(token.chainId),
    )
    await Promise.all(
      filteredNativeTokens.map(async token => {
        const balance = await getNativeTokenBalance(
          address,
          STATUS_NETWORKS[token.chainId],
        )
        const price = (await alchemy_fetchTokensPrice([token.symbol]))[
          token.symbol
        ]

        if (!price || !price.USD) {
          console.warn(`Price data missing for native token: ${token.symbol}`)
        }

        const asset: Omit<Asset, 'metadata'> = {
          networks: [STATUS_NETWORKS[token.chainId]],
          native: true,
          contract: null,
          icon: token.logoURI,
          name: token.name,
          symbol: token.symbol,
          price_eur: price?.USD?.['PRICE'] ?? 0,
          price_percentage_24h_change: price?.USD?.['CHANGEPCT24HOUR'] ?? 0,
          balance: Number(balance) / 10 ** token.decimals,
          total_eur:
            (Number(balance) / 10 ** token.decimals) *
            (price?.USD?.['PRICE'] ?? 0),
          decimals: token.decimals,
        }

        assets.push(asset)
      }),
    )

    // ERC20 tokens
    const filteredERC20Tokens = new Map(
      erc20TokenList.tokens
        .filter(token =>
          Object.entries(STATUS_NETWORKS)
            .filter(([, network]) => networks.includes(network))
            .map(([chainId]) => Number(chainId))
            .includes(token.chainId),
        )
        .map(token => [toChecksumAddress(token.address), token]),
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
    }

    const batchSize = 300
    const partialAssetEntries = Array.from(partialERC20Assets.entries())
    for (let i = 0; i < partialAssetEntries.length; i += batchSize) {
      const batch = partialAssetEntries.slice(i, i + batchSize)
      const symbols = [...new Set(batch.map(([, asset]) => asset.symbol))]

      const prices = await alchemy_fetchTokensPrice(symbols)

      for (const [, partialAsset] of batch) {
        const price = prices[partialAsset.symbol]

        if (price && price.USD) {
          const asset: Omit<Asset, 'metadata'> = {
            ...partialAsset,
            price_eur: price['USD']['PRICE'] ?? 0,
            price_percentage_24h_change: price['USD']['CHANGEPCT24HOUR'] ?? 0,
            total_eur: partialAsset.balance * (price['USD']['PRICE'] ?? 0),
            decimals: partialAsset.decimals, // <-- Mantém decimals
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
      // const prices = await legacy_fetchTokensPrice(
      //   missingSymbols,
      //   CRYPTOCOMPARE_REVALIDATION_TIMES.CURRENT_PRICE,
      // )
      const prices = await alchemy_fetchTokensPrice(missingSymbols)

      for (const symbol of missingSymbols) {
        const token = erc20TokenList.tokens.find(
          t => t.symbol === symbol && t.chainId === 1,
        )
        if (token && prices[symbol]) {
          aggregatedAssets.push({
            networks: ['ethereum'],
            native: false,
            contract: token.address,
            icon: token.logoURI,
            name: token.name,
            symbol: token.symbol,
            price_eur: prices[symbol]?.USD?.PRICE ?? 0,
            price_percentage_24h_change:
              prices[symbol]?.USD?.CHANGEPCT24HOUR ?? 0,
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
}: {
  address: string
  networks: NetworkType[]
  symbol: string
}) {
  // console.log(' DELAY nativeToken()')
  // await delay()

  const filteredNativeTokens = nativeTokenList.tokens.filter(token => {
    if (token.symbol !== symbol) {
      return false
    }

    return Object.entries(STATUS_NETWORKS)
      .filter(([, network]) => networks.includes(network))
      .map(([chainId]) => Number(chainId))
      .includes(token.chainId)
  })

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

      // const price = (
      //   await legacy_fetchTokensPrice(
      //     [token.symbol],
      //     CRYPTOCOMPARE_REVALIDATION_TIMES.CURRENT_PRICE,
      //   )
      // )[token.symbol]
      // const priceHistory = await legacy_fetchTokenPriceHistory(
      //   token.symbol,
      //   'all',
      //   CRYPTOCOMPARE_REVALIDATION_TIMES.PRICE_HISTORY,
      // )
      const price = (await alchemy_fetchTokensPrice([token.symbol]))[
        token.symbol
      ]
      const priceHistory = await alchemy_fetchTokenPriceHistory(
        token.symbol,
        'all',
      )
      // const tokenMetadata = await fetchTokenMetadata(
      //   token.symbol,
      //   CRYPTOCOMPARE_REVALIDATION_TIMES.TOKEN_METADATA,
      // )
      const tokenMetadata = await alchemy_fetchTokenMetadata(token.symbol)

      if (!price || !price.USD) {
        console.warn(`Price data missing for native token: ${token.symbol}`)
      }

      const asset: Asset = map({
        token,
        balance,
        price,
        priceHistory,
        tokenMetadata,
      })
      assets[STATUS_NETWORKS[token.chainId]] = asset
    }),
  )

  const summary = sum(Object.values(assets).flat())

  return {
    summary: {
      ...summary,
      icon: filteredNativeTokens[0].logoURI,
      name: filteredNativeTokens[0].name,
      symbol: filteredNativeTokens[0].symbol,
      about: Object.values(assets)[0]?.metadata.about ?? '',
      contracts: Object.values(assets).reduce(
        (acc, asset) => {
          if (asset.contract) {
            acc[asset.networks[0]] = asset.contract
          }
          return acc
        },
        {} as Record<NetworkType, string>,
      ),
    },
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
}: {
  address: string
  networks: NetworkType[]
  contract: string
}) {
  // console.log(' DELAY token()')
  // await delay()

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

      // const price = (
      //   await legacy_fetchTokensPrice(
      //     [token.symbol],
      //     CRYPTOCOMPARE_REVALIDATION_TIMES.CURRENT_PRICE,
      //   )
      // )[token.symbol]
      // const priceHistory = await legacy_fetchTokenPriceHistory(
      //   token.symbol,
      //   'all',
      //   CRYPTOCOMPARE_REVALIDATION_TIMES.PRICE_HISTORY,
      // )
      const price = (await alchemy_fetchTokensPrice([token.symbol]))[
        token.symbol
      ]
      const priceHistory = await alchemy_fetchTokenPriceHistory(
        token.symbol,
        'all',
      )
      // const tokenMetadata = await fetchTokenMetadata(
      //   token.symbol,
      //   CRYPTOCOMPARE_REVALIDATION_TIMES.TOKEN_METADATA,
      // )
      const tokenMetadata = await alchemy_fetchTokenMetadata(token.symbol)

      if (!price || !price.USD) {
        console.warn(`Price data missing for ERC20 token: ${token.symbol}`)
      }

      const asset = map({
        token,
        balance: result.tokenBalances[0].tokenBalance,
        price,
        priceHistory,
        tokenMetadata,
      })
      assets[STATUS_NETWORKS[token.chainId]] = asset
    }),
  )

  const summary = sum(Object.values(assets).flat())

  return {
    summary: {
      ...summary,
      icon: erc20Token.logoURI,
      name: erc20Token.name,
      symbol: erc20Token.symbol,
      about: Object.values(assets)[0]?.metadata.about ?? '',
      contracts: Object.values(assets).reduce(
        (acc, asset) => {
          if (asset.contract) {
            acc[asset.networks[0]] = asset.contract
          }
          return acc
        },
        {} as Record<NetworkType, string>,
      ),
    },
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
  // console.log(' DELAY tokenPriceChart()')
  // await delay()

  // Use CryptoCompare for 24H charts since Alchemy only provides daily granularity
  const data =
    days === '1'
      ? await legacy_fetchTokenPriceHistory(symbol, days)
      : await alchemy_fetchTokenPriceHistory(symbol, days)

  const mappedData = data.map(({ time, close }) => ({
    date: new Date(time * 1000).toISOString(),
    price: close,
  }))

  return mappedData
}

const cachedNativeTokenPriceChart = cache(async (key: string) => {
  const { symbol, days } = JSON.parse(key)

  return await nativeTokenPriceChart({ symbol, days })
})

async function nativeTokenPriceChart({
  symbol,
  days,
}: {
  symbol: string
  days?: '1' | '7' | '30' | '90' | '365' | 'all'
}) {
  // console.log(' DELAY nativeTokenPriceChart()')
  // await delay()

  // Use CryptoCompare for 24H charts since Alchemy only provides daily granularity
  const data =
    days === '1'
      ? await legacy_fetchTokenPriceHistory(symbol, days)
      : await alchemy_fetchTokenPriceHistory(symbol, days)

  const mappedData = data.map(({ time, close }) => ({
    date: new Date(time * 1000).toISOString(),
    price: close,
  }))

  return mappedData
}

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
  // console.log(' DELAY nativeTokenBalanceChart()')
  // await delay()

  const currentTime = Math.floor(Date.now() / 1000)
  const responses = await Promise.all(
    networks.map(async network => {
      const data = await fetchTokenBalanceHistory(
        address,
        network,
        days,
        undefined,
        currentTime,
        18,
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
  // console.log(' DELAY tokenBalanceChart()')
  // await delay()

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

function map(data: {
  token:
    | (typeof nativeTokenList.tokens)[number]
    | (typeof erc20TokenList.tokens)[number]
  balance: string
  price: Awaited<ReturnType<typeof alchemy_fetchTokensPrice>>[string]
  priceHistory: Awaited<ReturnType<typeof alchemy_fetchTokenPriceHistory>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tokenMetadata: any
}): Asset {
  const { token, balance, price, priceHistory, tokenMetadata } = data

  const lows = priceHistory
    .map(({ low }: { low: number }) => low)
    .filter((low: number) => low > 0)

  return {
    networks: [STATUS_NETWORKS[token.chainId]],
    ...('address' in token
      ? { contract: token.address, native: false }
      : { native: true, contract: null }),
    icon: token.logoURI,
    name: token.name,
    symbol: token.symbol,
    price_eur: price?.USD?.['PRICE'] ?? 0,
    price_percentage_24h_change: price?.USD?.['CHANGEPCT24HOUR'] ?? 0,
    balance: Number(balance) / 10 ** token.decimals,
    total_eur:
      (Number(balance) / 10 ** token.decimals) * (price?.USD?.['PRICE'] ?? 0),
    decimals: token.decimals,
    metadata: {
      market_cap: price?.USD?.['MKTCAP'],
      fully_dilluted:
        (price?.USD?.['PRICE'] ?? 0) * (tokenMetadata?.['SUPPLY_TOTAL'] ?? 0),
      circulation: price?.USD?.['CIRCULATINGSUPPLY'] ?? 0,
      total_supply: tokenMetadata?.['SUPPLY_TOTAL'] ?? 0,
      all_time_high: priceHistory?.length
        ? Math.max(...priceHistory.map(({ high }: { high: number }) => high))
        : (price?.USD?.['PRICE'] ?? 0),
      all_time_low: lows.length
        ? Math.min(...lows)
        : (price?.USD?.['PRICE'] ?? 0),
      volume_24: price?.USD?.['TOTALVOLUME24HTO'] ?? 0,
      rank_by_market_cap:
        tokenMetadata?.['TOPLIST_BASE_RANK']?.['TOTAL_MKT_CAP_USD'] ?? 0,
      about: tokenMetadata?.['ASSET_DESCRIPTION'] ?? '',
    },
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

// async function delay() {
//   await new Promise(resolve => setTimeout(resolve, 3 * 1000))
// }

// const cachedDelay = cache(wait)
