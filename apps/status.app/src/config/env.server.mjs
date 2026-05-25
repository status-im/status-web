import { z } from 'zod'
import { handleError } from './env.base.mjs'

if (typeof window !== 'undefined') {
  throw new Error(
    '❌ Attempted to access a server-side environment variable on the client'
  )
}

// During `next build`, runtime-only secrets (Postgres, Keycloak, BambooHR) are not
// available — but build-time secrets used by SSG/ISR (Ghost, GitHub, Greenhouse, Infura)
// must be present. Container runtime gets all of them.
//
// why: https://nextjs.org/docs/app/guides/self-hosting#environment-variables
const isBuild = process.env.NEXT_PHASE === 'phase-production-build'
const runtimeRequired = isBuild ? z.string().optional() : z.string()

export const envSchema = z.object({
  NODE_ENV: z
    .union([
      z.literal('production'),
      z.literal('preview'),
      z.literal('development'),
      z.literal('test'),
    ])
    .default('development'),
  VERCEL: z.string().optional(),
  VERCEL_ENV: z
    .union([
      z.literal('production'),
      z.literal('preview'),
      z.literal('development'),
    ])
    .optional(),
  PORT: z.coerce.number().optional(),
  /**
   * Trusted canonical origin (e.g. `https://status.app`).
   *
   * When set, used by `getBaseUrl()` instead of `x-forwarded-host`. REQUIRED
   * for self-hosted deployments — without it, `x-forwarded-host` is honored
   * and an attacker controlling the host header could direct OAuth state /
   * server-side fetches to a chosen domain.
   */
  SITE_URL: z.string().url().optional(),

  // Build-time strict — read during SSG/ISR/`generateMetadata`/sitemap.
  INFURA_API_KEY: z.string(),
  NEXT_PUBLIC_GHOST_API_KEY: z.string(),
  GREENHOUSE_API_KEY: z.string(),
  GREENHOUSE_STATUS_BOARD_ID: z.string(),
  GREENHOUSE_LOGOS_BOARD_ID: z.string(),
  GITHUB_TOKEN: z.string(),

  // Runtime-required — admin / API routes only.
  POSTGRES_URL: runtimeRequired,
  KEYCLOAK_API_URL: runtimeRequired,
  KEYCLOAK_REALM: runtimeRequired,
  KEYCLOAK_ISSUER: runtimeRequired,
  KEYCLOAK_CLIENT_ID: runtimeRequired,
  KEYCLOAK_CLIENT_SECRET: runtimeRequired,
  BAMBOOHR_API_KEY: runtimeRequired,

  // Optional — Umami analytics for /api/download tracking on self-hosted.
  UMAMI_API_URL: z.string().optional(),
  UMAMI_WEBSITE_ID: z.string().optional(),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
  handleError(result.error)

  process.exit(1)
}

const serverEnv = result.data

export { serverEnv }
