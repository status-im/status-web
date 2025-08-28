import { z } from 'zod'
import { handleError } from './env.base.mjs'

if (typeof window !== 'undefined') {
  throw new Error(
    '❌ Attempted to access a server-side environment variable on the client'
  )
}

export const envSchema = z.object({
  VERCEL: z.string().optional(),
  VERCEL_ENV: z
    .union([
      z.literal('production'),
      z.literal('preview'),
      z.literal('development'),
    ])
    .optional(),
  INFURA_API_KEY: z.string(),
  ALCHEMY_API_KEYS: z.string(),
  COINGECKO_API_KEY: z.string(),
  CRYPTOCOMPARE_API_KEYS: z.string(),
  PORT: z.coerce.number().optional(),
  MERCURYO_SECRET_KEY: z.string(),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  handleError(result.error)

  process.exit(1)
}

const serverEnv = result.data

export { serverEnv }
