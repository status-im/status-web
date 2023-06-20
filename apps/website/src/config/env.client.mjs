import { z } from 'zod'

export const envSchema = z.object({
  NEXT_PUBLIC_GHOST_API_KEY: z.string(),
})

export const envClient = envSchema.parse({
  NEXT_PUBLIC_GHOST_API_KEY: process.env.NEXT_PUBLIC_GHOST_API_KEY,
})
