import { z } from 'zod'
import { handleError } from './env.base.mjs'

if (typeof window !== 'undefined') {
  throw new Error(
    '❌ Attempted to access a server-side environment variable on the client',
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
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  GHOST_API_URL: z.string(),
  GHOST_API_KEY: z.string(),
})

const result = envSchema.safeParse({
  VERCEL: process.env.VERCEL,
  VERCEL_ENV: process.env.VERCEL_ENV,
  NODE_ENV: process.env.NODE_ENV,
  GHOST_API_URL: process.env.GHOST_API_URL,
  GHOST_API_KEY: process.env.GHOST_API_KEY,
})

if (!result.success) {
  handleError(result.error)

  process.exit(1)
}

const serverEnv = result.data

export { serverEnv }
