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
  PORT: z.coerce.number().optional(),
})

export const result = envSchema.strip().safeParse({
  NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
  NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
  PORT: process.env.PORT,
})

if (!result.success) {
  handleError(result.error)

  process.exit(1)
}

const clientEnv = result.data

export { clientEnv }
