import { publicProcedure, router } from '../lib/trpc'

export const configRouter = router({
  env: publicProcedure.query(async () => {
    return await getEnv()
  }),
})

type ConfigEnv = {
  refreshIntervalMs: number
  staleTimeMs: number
  gcTimeMs: number
}

let cachedConfigEnv: ConfigEnv | null = null

async function loadEnv(): Promise<ConfigEnv> {
  return {
    refreshIntervalMs: 15 * 1000, // 15 seconds
    staleTimeMs: 15 * 1000, // 15 seconds
    gcTimeMs: 60 * 60 * 1000, // 1 hour
  }
}

export async function getEnv(): Promise<ConfigEnv> {
  if (cachedConfigEnv) return cachedConfigEnv
  try {
    cachedConfigEnv = await loadEnv()
    return cachedConfigEnv
  } catch {
    console.error('Failed to load config env')
    return {
      refreshIntervalMs: 0,
      staleTimeMs: 0,
      gcTimeMs: 0,
    }
  }
}
