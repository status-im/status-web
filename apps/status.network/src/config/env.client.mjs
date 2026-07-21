import { z } from 'zod'
import { handleError } from './env.base.mjs'

export const envSchema = z.object({
  NEXT_PUBLIC_GHOST_API_URL: z.string(),
  NEXT_PUBLIC_GHOST_API_KEY: z.string(),
})

const result = envSchema.strip().safeParse({
  NEXT_PUBLIC_GHOST_API_URL: process.env.NEXT_PUBLIC_GHOST_API_URL,
  NEXT_PUBLIC_GHOST_API_KEY: process.env.NEXT_PUBLIC_GHOST_API_KEY,
})

if (!result.success) {
  handleError(result.error)

  process.exit(1)
}

const clientEnv = result.data

export { clientEnv }
