import { z } from 'zod'
import { handleError } from './env.base.mjs'

export const envSchema = z.object({
  NEXT_PUBLIC_VERCEL_ENV: z
    .union([
      z.literal('production'),
      z.literal('preview'),
      z.literal('development'),
    ])
    .optional(),
  NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
  NEXT_PUBLIC_INFURA_API_KEY: z.string(),
  PORT: z.coerce.number().optional(),
  NEXT_PUBLIC_FEATURE_FLAG_WATCHED_ADDRESSES: z.string().optional(),
})

export const result = envSchema.strip().safeParse({
  NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
  NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
  NEXT_PUBLIC_INFURA_API_KEY: process.env.NEXT_PUBLIC_INFURA_API_KEY,
  PORT: process.env.PORT,
  NEXT_PUBLIC_FEATURE_FLAG_WATCHED_ADDRESSES:
    process.env.NEXT_PUBLIC_FEATURE_FLAG_WATCHED_ADDRESSES,
})

if (!result.success) {
  handleError(result.error)

  process.exit(1)
}

const clientEnv = result.data

export { clientEnv }
