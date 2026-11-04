import dotenv from 'dotenv'
import path from 'node:path'

// Load e2e/.env.local, then e2e/.env, before any setting below is read. This has
// to happen here, not in the Playwright config: the config imports this module,
// and imports run before the config body. Variables already set in the shell
// win over both files.
const e2eDir = path.resolve(import.meta.dirname, '../..')
dotenv.config({ path: path.join(e2eDir, '.env.local'), quiet: true })
dotenv.config({ path: path.join(e2eDir, '.env'), quiet: true })

/**
 * Settings for the website suites (status.app). These run against a URL the
 * caller provides: a dev server or `next start` on the developer's machine,
 * staging or production. Nothing here starts a server.
 */

/** Default target: `pnpm --filter status.app dev:next` listens on 3001. */
export const STATUS_APP_URL =
  process.env.STATUS_APP_URL ?? 'http://localhost:3001'

/**
 * Header sent with every request to the site under test, so the CDN in front
 * of staging and production (Cloudflare) can let the daily run through bot
 * protection. Unset locally; CI reads the value from the E2E_BYPASS_TOKEN
 * secret.
 */
export const BYPASS_HEADER = 'x-e2e-bypass'
export const BYPASS_TOKEN = process.env.E2E_BYPASS_TOKEN ?? ''

/** Whether the target runs on this machine (a dev server or `next start`). */
export function isLocalTarget(baseURL: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(baseURL)
}

/**
 * Whether `console.error` fails a test. Defaults to on for remote targets and
 * off for localhost, where `next dev` logs development-only React warnings.
 * Set E2E_STRICT_CONSOLE=1 when testing a local production build.
 */
export function strictConsole(baseURL: string): boolean {
  if (process.env.E2E_STRICT_CONSOLE) {
    return process.env.E2E_STRICT_CONSOLE === '1'
  }
  return !isLocalTarget(baseURL)
}

/**
 * How many sitemap URLs the sitemap test requests. A number spreads the sample
 * over the whole sitemap; `all` checks every entry (CI does). The default keeps
 * a local run against `next dev` short, since each new route compiles.
 */
export const SITEMAP_SAMPLE = process.env.SITEMAP_SAMPLE ?? '30'
