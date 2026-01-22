import { cache } from 'react'

import { z } from 'zod'

import {
  broadcastTransaction,
  getFeeRate,
  getTransactionCount,
} from '../../services/alchemy'
import { nodesProcedure, router } from '../lib/trpc'

export const nodesRouter = router({
  getFeeRate: nodesProcedure
    .input(
      z.object({
        network: z.enum(['ethereum']).optional(),
        params: z.object({
          from: z.string(),
          to: z.string(),
          value: z.string(),
          data: z.string().optional(),
        }),
      }),
    )
    .query(async ({ input }) => {
      const inputHash = JSON.stringify(input)
      return await cachedGetFeeRate(inputHash)
    }),

  broadcastTransaction: nodesProcedure
    .input(
      z.object({
        txHex: z.string(),
        network: z.enum(['ethereum']).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await broadcastTransaction(
        input.txHex,
        input.network ?? 'ethereum',
      )
    }),

  getNonce: nodesProcedure
    .input(
      z.object({
        address: z.string(),
        network: z.enum(['ethereum']).optional(),
      }),
    )
    .query(async ({ input }) => {
      return await getTransactionCount(
        input.address,
        input.network ?? 'ethereum',
      )
    }),
})

const cachedGetFeeRate = cache(async (key: string) => {
  const { network, params } = JSON.parse(key)
  return await getFeeRate(network ?? 'ethereum', params)
})
