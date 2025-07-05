import { cache } from 'react'

import { format } from 'date-fns'
import { z } from 'zod'

import erc20TokenList from '../../../constants/erc20.json'
import { groupBy } from '../../../utils/group-by'
import { getAssetTransfers, getTransactionStatus } from '../../services/alchemy'
import { fetchTokensPriceForDate } from '../../services/cryptocompare'
import { publicProcedure, router } from '../lib/trpc'

import type { AssetTransfer } from '../../services/alchemy/types'
import type { NetworkType } from '../types'

export type Activity = AssetTransfer & {
  network: NetworkType
  status: 'pending' | 'success' | 'failed' | 'unknown'
  eurRate?: number
}

const MAX_CONCURRENT_REQUESTS = 5

function checkToken(symbol: string, contractAddress?: string | null): boolean {
  if (symbol === 'ETH') return true
  if (!contractAddress) return false

  const knownToken = erc20TokenList.tokens.find(
    token =>
      token.symbol === symbol &&
      token.address.toLowerCase() === contractAddress.toLowerCase(),
  )

  return Boolean(knownToken)
}

const cachedPriceData = cache(async (key: string) => {
  const { symbols, timestamp } = JSON.parse(key)

  if (symbols.length === 0) return {}

  return await fetchTokensPriceForDate(symbols, timestamp)
})

type PriceDataResponse = Record<string, { EUR?: { PRICE: number } }>

const batchPriceRequests = async (
  priceRequests: Array<{ symbols: string[]; timestamp: number }>,
): Promise<Record<string, PriceDataResponse>> => {
  const BATCH_SIZE = 5
  const results: Record<string, PriceDataResponse> = {}

  for (let i = 0; i < priceRequests.length; i += BATCH_SIZE) {
    const batch = priceRequests.slice(i, i + BATCH_SIZE)

    const batchPromises = batch.map(async ({ symbols, timestamp }) => {
      const key = JSON.stringify({ symbols, timestamp })
      const data = await cachedPriceData(key)
      return { key, data }
    })

    const batchResults = await Promise.all(batchPromises)
    batchResults.forEach(({ key, data }) => {
      results[key] = data
    })
  }

  return results
}

const cachedActivity = cache(async (key: string) => {
  const { address, network } = JSON.parse(key)
  return await activity(address, network)
})

async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number,
): Promise<T[]> {
  const results: T[] = []
  let index = 0

  async function worker() {
    while (index < tasks.length) {
      const current = index++
      results[current] = await tasks[current]()
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker())
  await Promise.all(workers)

  return results
}

export const activitiesRouter = router({
  page: publicProcedure
    .input(
      z.object({
        address: z.string(),
        networks: z.array(
          z.enum([
            'ethereum',
            'optimism',
            'arbitrum',
            'base',
            'polygon',
            'bsc',
          ]),
        ),
        limit: z.number().optional(),
        pageKeys: z.record(z.string()).optional(),
      }),
    )
    .query(async ({ input }) => {
      const key = JSON.stringify(input)
      return await cachedPage(key)
    }),

  activities: publicProcedure
    .input(
      z.object({
        address: z.string(),
        network: z.enum([
          'ethereum',
          'optimism',
          'arbitrum',
          'base',
          'polygon',
          'bsc',
        ]),
      }),
    )
    .query(async ({ input }) => {
      const key = JSON.stringify(input)
      return await cachedActivity(key)
    }),
})

const cachedPage = cache(async (key: string) => {
  const { address, networks, limit, pageKeys } = JSON.parse(key)
  return await page({ address, networks, limit, pageKeys })
})

export async function page({
  address,
  networks,
  limit = 20,
  pageKeys = {},
}: {
  address: string
  networks: NetworkType[]
  limit?: number
  pageKeys?: Partial<Record<NetworkType, string>>
}) {
  const activities: Activity[] = []
  const nextPageKeys: Record<NetworkType, string | undefined> = {} as Record<
    NetworkType,
    string | undefined
  >

  for (const network of networks) {
    try {
      const { transfers, pageKey } = await getAssetTransfers(
        address,
        network,
        pageKeys[network],
        limit,
      )

      nextPageKeys[network] = pageKey

      const tasks = transfers.map(tx => async () => {
        const status = await getTransactionStatus(tx.hash, network)

        return {
          ...tx,
          status,
          value: Number(tx.value),
          tokenId: tx.tokenId ?? undefined,
          erc721TokenId: tx.erc721TokenId ?? undefined,
          erc1155Metadata: tx.erc1155Metadata ?? undefined,
          rawContract: {
            value: tx.rawContract?.value ?? '0',
            address: tx.rawContract?.address ?? null,
            decimal: tx.rawContract?.decimal ?? '0',
          },
          network,
        } as Activity
      })

      const results = await runWithConcurrency(tasks, MAX_CONCURRENT_REQUESTS)
      activities.push(...results)
    } catch (err) {
      console.error(`[alchemy] Error fetching transfers for ${network}:`, err)
      throw new Error(`Failed to fetch transfers for ${network}`)
    }
  }

  const activityGroups = groupBy(
    activities,
    activity => {
      return format(new Date(activity.metadata.blockTimestamp), 'yyyy-MM-dd')
    },
    {},
  )

  const priceRequests: Array<{
    symbols: string[]
    timestamp: number
    date: string
  }> = []

  for (const [date, dateActivities] of Object.entries(activityGroups)) {
    const allAssetSymbols = [
      ...new Set(
        dateActivities.map(activity => activity.asset).filter(Boolean),
      ),
    ]

    const validAssetSymbols = allAssetSymbols.filter(symbol => {
      const activity = dateActivities.find(a => a.asset === symbol)
      const contractAddress = activity?.rawContract?.address
      return checkToken(symbol, contractAddress)
    })

    const hasEthTransfers = dateActivities.some(
      activity => !activity.asset && activity.category === 'external',
    )
    if (hasEthTransfers) {
      validAssetSymbols.push('ETH')
    }

    const timestamp = Math.floor(
      new Date(dateActivities[0].metadata.blockTimestamp).getTime() / 1000,
    )

    if (validAssetSymbols.length > 0) {
      priceRequests.push({ symbols: validAssetSymbols, timestamp, date })
    }
  }

  const batchedPriceData = await batchPriceRequests(priceRequests)

  const enhancedActivities: Activity[] = []
  for (const [date, dateActivities] of Object.entries(activityGroups)) {
    const requestKey = priceRequests.find(req => req.date === date)
    const priceData = requestKey
      ? batchedPriceData[
          JSON.stringify({
            symbols: requestKey.symbols,
            timestamp: requestKey.timestamp,
          })
        ] || {}
      : {}

    const dateEnhancedActivities = dateActivities.map(activity => {
      const assetSymbol =
        activity.asset || (activity.category === 'external' ? 'ETH' : null)

      if (assetSymbol && priceData[assetSymbol]) {
        const eurRate = priceData[assetSymbol].EUR?.PRICE ?? 0

        return {
          ...activity,
          eurRate,
        }
      }
      return activity
    })

    enhancedActivities.push(...dateEnhancedActivities)
  }

  enhancedActivities.sort((a, b) => {
    const blockDiff = parseInt(b.blockNum, 16) - parseInt(a.blockNum, 16)
    if (blockDiff !== 0) return blockDiff

    const timestampA = new Date(a.metadata.blockTimestamp).getTime()
    const timestampB = new Date(b.metadata.blockTimestamp).getTime()
    return timestampB - timestampA
  })

  return {
    activities: enhancedActivities,
    nextPageKeys,
  }
}

export async function activity(
  address: string,
  network: NetworkType,
  pageKey?: string,
  limit = 100,
): Promise<{ activities: Activity[]; nextPageKey?: string }> {
  const { transfers, pageKey: nextPageKey } = await getAssetTransfers(
    address,
    network,
    pageKey,
    limit,
  )

  const tasks = transfers.map(tx => async () => {
    const status = await getTransactionStatus(tx.hash, network)

    return {
      ...tx,
      status,
      value: tx.value,
      tokenId: tx.tokenId ?? undefined,
      erc721TokenId: tx.erc721TokenId ?? undefined,
      erc1155Metadata: tx.erc1155Metadata ?? undefined,
      rawContract: {
        value: tx.rawContract?.value ?? '0',
        address: tx.rawContract?.address ?? null,
        decimal: tx.rawContract?.decimal ?? '0',
      },
      network,
    } as Activity
  })

  const activities = await runWithConcurrency(tasks, MAX_CONCURRENT_REQUESTS)

  const activityGroups = groupBy(
    activities,
    activity => {
      return format(new Date(activity.metadata.blockTimestamp), 'yyyy-MM-dd')
    },
    {},
  )
  const enhancedActivities: Activity[] = []

  for (const dateActivities of Object.values(activityGroups)) {
    const allAssetSymbols = [
      ...new Set(
        dateActivities.map(activity => activity.asset).filter(Boolean),
      ),
    ]

    const validAssetSymbols = allAssetSymbols.filter(symbol => {
      const activity = dateActivities.find(a => a.asset === symbol)
      const contractAddress = activity?.rawContract?.address
      return checkToken(symbol, contractAddress)
    })

    const hasEthTransfers = dateActivities.some(
      activity => !activity.asset && activity.category === 'external',
    )
    if (hasEthTransfers) {
      validAssetSymbols.push('ETH')
    }

    const timestamp = Math.floor(
      new Date(dateActivities[0].metadata.blockTimestamp).getTime() / 1000,
    )

    const priceData = await cachedPriceData(
      JSON.stringify({ symbols: validAssetSymbols, timestamp }),
    )

    const dateEnhancedActivities = dateActivities.map(activity => {
      const assetSymbol =
        activity.asset || (activity.category === 'external' ? 'ETH' : null)

      if (assetSymbol && priceData[assetSymbol]) {
        const eurRate = priceData[assetSymbol].EUR?.PRICE ?? 0

        return {
          ...activity,
          eurRate,
        }
      }
      return activity
    })

    enhancedActivities.push(...dateEnhancedActivities)
  }

  return {
    activities: enhancedActivities,
    nextPageKey,
  }
}
