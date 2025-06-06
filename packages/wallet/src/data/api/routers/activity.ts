import { cache } from 'react'

import { z } from 'zod'

import { getAssetTransfers } from '../../services/alchemy'
import { publicProcedure, router } from '../lib/trpc'

import type { AssetTransfer } from '../../services/alchemy/types'
import type { NetworkType } from '../types'

export type Activity = AssetTransfer & {
  network: NetworkType
}

export const activitiesRouter = router({
  page: publicProcedure
    .input(
      z.object({
        toAddress: z.string(),
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
        offset: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      const inputHash = JSON.stringify(input)
      return await cachedPage(inputHash)
    }),

  activities: publicProcedure
    .input(
      z.object({
        toAddress: z.string(),
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
      const inputHash = JSON.stringify(input)
      return await cachedActivity(inputHash)
    }),
})

const cachedPage = cache(async (key: string) => {
  const { fromAddress, toAddress, networks, limit, offset } = JSON.parse(key)
  return await page({ fromAddress, toAddress, networks, limit, offset })
})

async function page({
  toAddress,
  fromAddress,
  networks,
  limit = 20,
  offset = 0,
}: {
  toAddress: string
  fromAddress: string
  networks: NetworkType[]
  limit?: number
  offset?: number
}) {
  const activities: Activity[] = []

  await Promise.all(
    networks.map(async network => {
      try {
        const transfers = await getAssetTransfers(
          fromAddress,
          toAddress,
          network,
        )

        for (const tx of transfers) {
          activities.push({
            ...tx,
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
          })
        }
      } catch (err) {
        console.error(`[alchemy] Error fetching transfers for ${network}:`, err)
        throw new Error(`Failed to fetch transfers for ${network}`)
      }
    }),
  )

  activities.sort((a, b) => parseInt(b.blockNum, 16) - parseInt(a.blockNum, 16))

  const paginatedActivities = activities.slice(offset, offset + limit)

  return {
    activities: paginatedActivities,
    hasMore: activities.length > offset + limit,
  }
}

const cachedActivity = cache(async (key: string) => {
  const { fromAddress, toAddress, network } = JSON.parse(key)
  return await activity(fromAddress, toAddress, network)
})

async function activity(
  fromAddress: string,
  toAddress: string,
  network: NetworkType,
) {
  const transfers = await getAssetTransfers(fromAddress, toAddress, network)

  const activities: Activity[] = transfers.map(tx => ({
    ...tx,
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
  }))

  return activities
}
