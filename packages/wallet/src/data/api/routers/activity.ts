import { cache } from 'react'

import { z } from 'zod'

import { getAssetTransfers, getTransactionStatus } from '../../services/alchemy'
import { publicProcedure, router } from '../lib/trpc'

import type { AssetTransfer } from '../../services/alchemy/types'
import type { NetworkType } from '../types'

export type Activity = AssetTransfer & {
  network: NetworkType
  status: 'pending' | 'success' | 'failed' | 'unknown'
}

const MAX_CONCURRENT_REQUESTS = 5

const cachedActivity = cache(async (key: string) => {
  const { fromAddress, network } = JSON.parse(key)
  return await activity(fromAddress, network)
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
        fromAddress: z.string(),
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
        fromAddress: z.string(),
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
  const { fromAddress, networks, limit, pageKeys } = JSON.parse(key)
  return await page({ fromAddress, networks, limit, pageKeys })
})

export async function page({
  fromAddress,
  networks,
  limit = 20,
  pageKeys = {},
}: {
  fromAddress: string
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
        fromAddress,
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

  activities.sort((a, b) => parseInt(b.blockNum, 16) - parseInt(a.blockNum, 16))

  return {
    activities,
    nextPageKeys,
  }
}

export async function activity(
  fromAddress: string,
  network: NetworkType,
  pageKey?: string,
  limit = 100,
): Promise<{ activities: Activity[]; nextPageKey?: string }> {
  const { transfers, pageKey: nextPageKey } = await getAssetTransfers(
    fromAddress,
    network,
    pageKey,
    limit,
  )

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

  const activities = await runWithConcurrency(tasks, MAX_CONCURRENT_REQUESTS)

  return {
    activities,
    nextPageKey,
  }
}
