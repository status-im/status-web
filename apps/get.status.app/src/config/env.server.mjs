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
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().optional(),
})

const result = envSchema.safeParse({
  VERCEL: process.env.VERCEL,
  VERCEL_ENV: process.env.VERCEL_ENV,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
})

if (!result.success) {
  handleError(result.error)

  process.exit(1)
}

const serverEnv = result.data

export { serverEnv }
