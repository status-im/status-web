import { z } from 'zod'
import { handleError } from './env.base.mjs'

if (typeof window !== 'undefined') {
  throw new Error(
    '❌ Attempted to access a server-side environment variable on the client'
  )
}

export const envSchema = z.object({
  VERCEL: z.string().optional(),
  VERCEL_ENV: z
    .union([
      z.literal('production'),
      z.literal('preview'),
      z.literal('development'),
    ])
    .optional(),
  INFURA_API_KEY: z.string(),
  NEXT_PUBLIC_GHOST_API_KEY: z.string(),
  PORT: z.coerce.number().optional(),
  GREENHOUSE_API_KEY: z.string(),
  GREENHOUSE_STATUS_BOARD_ID: z.string(),
  GREENHOUSE_LOGOS_BOARD_ID: z.string(),
  GOOGLE_SPREADSHEET_ID: z.string(),
  GOOGLE_SHEET_ID: z.string(),
  GOOGLE_CLIENT_EMAIL: z.string(),
  GOOGLE_SERVICE_PRIVATE_KEY: z
    .string()
    .transform(key => key.replace(/\\n/g, '\n')),
  POSTGRES_URL: z.string(),
  KEYCLOAK_API_URL: z.string(),
  KEYCLOAK_REALM: z.string(),
  KEYCLOAK_ISSUER: z.string(),
  KEYCLOAK_CLIENT_ID: z.string(),
  KEYCLOAK_CLIENT_SECRET: z.string(),
  BAMBOOHR_API_KEY: z.string(),
  GITHUB_TOKEN: z.string(),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  handleError(result.error)

  process.exit(1)
}

const serverEnv = result.data

export { serverEnv }
