import { z } from 'zod'

export const envSchema = z.object({
  INFURA_API_KEY: z.string(),
  TAMAGUI_TARGET: z.literal('web'),
})
