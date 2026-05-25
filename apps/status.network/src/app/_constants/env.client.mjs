import { z } from 'zod'
import { handleError } from './env.base.mjs'

const envSchema = z.object({
  NEXT_PUBLIC_GHOST_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_GHOST_API_KEY: z.string().optional(),
})

const result = envSchema.safeParse({
  NEXT_PUBLIC_GHOST_API_URL: process.env.NEXT_PUBLIC_GHOST_API_URL,
  NEXT_PUBLIC_GHOST_API_KEY: process.env.NEXT_PUBLIC_GHOST_API_KEY,
})

if (!result.success) {
  handleError(result.error)
  process.exit(1)
}

export const clientEnv = result.data
