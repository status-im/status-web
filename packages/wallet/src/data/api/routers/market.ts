import { cache } from 'react'

import { z } from 'zod'

import {
  COINGECKO_REVALIDATION_TIMES,
  fetchTokensPrice,
} from '../../services/coingecko/index'
import { marketProcedure, router } from '../lib/trpc'

export const marketRouter = router({
  tokenPrice: marketProcedure
    .input(
      z.object({
        symbols: z.array(z.string()).min(1).max(100),
      }),
    )
    .query(async ({ input }) => {
      const inputHash = JSON.stringify(input)

      return await cachedTokenPrice(inputHash)
    }),
})

const cachedTokenPrice = cache(async (key: string) => {
  const { symbols } = JSON.parse(key)

  return await fetchTokensPrice(
    symbols,
    COINGECKO_REVALIDATION_TIMES.CURRENT_PRICE,
  )
})
