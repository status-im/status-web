import { z } from 'zod'
import { handleError } from './env.base.mjs'

export const envSchema = z.object({
  NEXT_LOCAL_OUTPUT: z
    .union([z.literal('export'), z.literal('standalone')])
    .optional(),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  handleError(result.error)

  process.exit(1)
}

const localEnv = result.data

export { localEnv }
