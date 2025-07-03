import { cache } from 'react'

import { z } from 'zod'

import {
  broadcastTransaction,
  getFeeRate,
  getTransactionCount,
} from '../../services/alchemy'
import { publicProcedure, router } from '../lib/trpc'

export const nodesRouter = router({
  getFeeRate: publicProcedure
    .input(
      z.object({
        network: z
          .enum([
            'ethereum',
            'optimism',
            'arbitrum',
            'base',
            'polygon',
            'bsc',
            'sepolia',
          ])
          .optional(),
      }),
    )
    .query(async ({ input }) => {
      const inputHash = JSON.stringify(input)
      return await cachedGetFeeRate(inputHash)
    }),

  broadcastTransaction: publicProcedure
    .input(
      z.object({
        txHex: z.string(),
        network: z
          .enum([
            'ethereum',
            'optimism',
            'arbitrum',
            'base',
            'polygon',
            'bsc',
            'sepolia',
          ])
          .optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await broadcastTransaction(
        input.txHex,
        input.network ?? 'ethereum',
      )
    }),

  getNonce: publicProcedure
    .input(
      z.object({
        address: z.string(),
        network: z
          .enum(['ethereum', 'optimism', 'arbitrum', 'base', 'polygon', 'bsc'])
          .optional(),
      }),
    )
    .query(async ({ input }) => {
      const inputHash = JSON.stringify(input)
      return await cachedGetNonce(inputHash)
    }),
})

const cachedGetFeeRate = cache(async (key: string) => {
  const { network } = JSON.parse(key)
  return await getFeeRate(network ?? 'ethereum')
})

const cachedGetNonce = cache(async (key: string) => {
  const { address, network } = JSON.parse(key)
  return await getTransactionCount(address, network ?? 'ethereum')
})
