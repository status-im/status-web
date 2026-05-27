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
  PORT: z.coerce.number().optional(),
  /** Used for latest release metadata in the nav and apps page. */
  GITHUB_TOKEN: z.string().optional(),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  handleError(result.error)

  process.exit(1)
}

const serverEnv = result.data

export { serverEnv }
