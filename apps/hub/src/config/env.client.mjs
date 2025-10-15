import { z } from 'zod'
import { handleError } from './env.base.mjs'

export const envSchema = z.object({
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().optional(),
})

export const result = envSchema.strip().safeParse({
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
})

if (!result.success) {
  handleError(result.error)

  process.exit(1)
}

const clientEnv = result.data

export { clientEnv }
