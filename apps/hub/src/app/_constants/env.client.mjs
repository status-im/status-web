import { z } from 'zod'
import { handleError } from './env.base.mjs'

export const envSchema = z.object({
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z
    .string()
    .min(1, 'WalletConnect Project ID is required.'),
  NEXT_PUBLIC_STATUS_NETWORK_API_URL: z.string(),
})

export const result = envSchema.strip().safeParse({
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  NEXT_PUBLIC_STATUS_NETWORK_API_URL:
    process.env.NEXT_PUBLIC_STATUS_NETWORK_API_URL,
})

if (!result.success) {
  handleError(result.error)

  process.exit(1)
}

const clientEnv = result.data

export { clientEnv }
