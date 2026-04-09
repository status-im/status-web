import { z } from 'zod'
import { handleError } from './env.base.mjs'

export const envSchema = z.object({
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string(),
  NEXT_PUBLIC_STATUS_NETWORK_API_URL: z.string(),
  NEXT_PUBLIC_STATUS_API_URL: z.string(),
  NEXT_PUBLIC_USE_PUZZLE_AUTH: z
    .string()
    .optional()
    .default('false')
    .transform(v => v === 'true'),
  NEXT_PUBLIC_RPC_PROXY_URL: z.string().optional(),
})

export const result = envSchema.strip().safeParse({
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  NEXT_PUBLIC_STATUS_NETWORK_API_URL:
    process.env.NEXT_PUBLIC_STATUS_NETWORK_API_URL,
  NEXT_PUBLIC_STATUS_API_URL: process.env.NEXT_PUBLIC_STATUS_API_URL,
  NEXT_PUBLIC_USE_PUZZLE_AUTH: process.env.NEXT_PUBLIC_USE_PUZZLE_AUTH,
  NEXT_PUBLIC_RPC_PROXY_URL: process.env.NEXT_PUBLIC_RPC_PROXY_URL,
})

if (!result.success) {
  handleError(result.error)

  process.exit(1)
}

const clientEnv = result.data

export { clientEnv }
