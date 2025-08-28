import { cache } from 'react'

import { publicProcedure, router } from '../lib/trpc'

export const configRouter = router({
  env: publicProcedure.query(async () => {
    try {
      return await getEnvCached()
    } catch {
      console.error('Failed to load config env')
      return {
        refreshIntervalMs: 0,
        staleTimeMs: Infinity,
        gcTimeMs: Infinity,
      }
    }
  }),
})

type ConfigEnv = {
  refreshIntervalMs: number
  staleTimeMs: number
  gcTimeMs: number
}

async function loadEnv(): Promise<ConfigEnv> {
  return {
    refreshIntervalMs: 15 * 1000, // 15 seconds
    staleTimeMs: 15 * 1000, // 15 seconds
    gcTimeMs: 60 * 60 * 1000, // 1 hour
  }
}

const getEnvCached = cache(loadEnv)
