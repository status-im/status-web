import { z } from 'zod'

if (typeof window !== 'undefined') {
  throw new Error(
    '❌ Attempted to access a server-side environment variable on the client'
  )
}

export const envSchema = z.object({
  VERCEL_ENV: z
    .union([
      z.literal('production'),
      z.literal('preview'),
      z.literal('development'),
    ])
    .optional(),
  INFURA_API_KEY: z.string(),
  TAMAGUI_TARGET: z.literal('web'),
  NEXT_PUBLIC_GHOST_API_KEY: z.string(),
})

export const serverEnv = envSchema.parse(process.env)
