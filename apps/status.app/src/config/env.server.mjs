import { z } from 'zod'
import { handleError } from './env.base.mjs'

if (typeof window !== 'undefined') {
  throw new Error(
    '❌ Attempted to access a server-side environment variable on the client'
  )
}

export const envSchema = z.object({
  NODE_ENV: z
    .union([
      z.literal('production'),
      z.literal('preview'),
      z.literal('development'),
      z.literal('test'),
    ])
    .default('development'),
  VERCEL: z.string().optional(),
  VERCEL_ENV: z
    .union([
      z.literal('production'),
      z.literal('preview'),
      z.literal('development'),
    ])
    .optional(),
  PORT: z.coerce.number().optional(),
  // Build-time strict — read during SSG/ISR/`generateMetadata`/sitemap.
  INFURA_API_KEY: z.string(),
  NEXT_PUBLIC_GHOST_API_KEY: z.string(),
  GREENHOUSE_API_KEY: z.string(),
  GREENHOUSE_STATUS_BOARD_ID: z.string(),
  GREENHOUSE_LOGOS_BOARD_ID: z.string(),
  GITHUB_TOKEN: z.string(),

  // Only the retained database maintenance commands use this connection.
  POSTGRES_URL: z.string().optional(),

  // Optional — Umami analytics for /api/download tracking on self-hosted.
  UMAMI_API_URL: z.string().optional(),
  UMAMI_WEBSITE_ID: z.string().optional(),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  handleError(result.error)

  process.exit(1)
}

const serverEnv = result.data

export { serverEnv }
