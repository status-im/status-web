import { z } from 'zod'
import { handleError } from './env.base.mjs'

if (typeof window !== 'undefined') {
  throw new Error(
    '❌ Attempted to access a server-side environment variable on the client',
  )
}

export const envSchema = z.object({
  INFURA_API_KEY: z.string(),
  ALCHEMY_API_KEYS: z.string(),
  COINGECKO_API_KEY: z.string(),
  CRYPTOCOMPARE_API_KEYS: z.string(),
  PORT: z.coerce.number().optional(),
  MERCURYO_SECRET_KEY: z.string(),
  STATUS_RPC_AUTH_USERNAME: z.string(),
  STATUS_RPC_AUTH_PASSWORD: z.string(),
  MARKET_PROXY_AUTH_USERNAME: z.string().optional(),
  MARKET_PROXY_AUTH_PASSWORD: z.string().optional(),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  handleError(result.error)

  process.exit(1)
}

const serverEnv = result.data

export { serverEnv }
