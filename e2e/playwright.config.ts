import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({ path: path.resolve(import.meta.dirname, '.env.local') })
dotenv.config({ path: path.resolve(import.meta.dirname, '.env') })

// Default to a local Hub dev server so tests exercise this repo's code. Point
// BASE_URL at a deployed URL (prod / Vercel preview) to test that instead.
const baseURL = process.env.BASE_URL ?? 'http://localhost:3003'

// Only manage a dev server for localhost targets; remote URLs are already live.
const isLocalTarget = /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(
  baseURL,
)
const hubPort = (() => {
  try {
    return new URL(baseURL).port || '3003'
  } catch {
    return '3003'
  }
})()

export default defineConfig({
  testDir: './tests',
  timeout: 120_000,
  expect: {
    timeout: 15_000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ['html', { outputFolder: 'test-results/html-report', open: 'never' }],
    ['list'],
    ...(process.env.CI
      ? ([['github', {}]] as [string, Record<string, unknown>][])
      : []),
  ],
  outputDir: 'test-results/artifacts',

  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',

  // Build the Hub's workspace deps (FULL TURBO / instant when unchanged) then
  // start the Next dev server. Dev mode keeps locale routing working — a static
  // export would need the deploy-time default-locale-prefix rewrite. Skipped
  // entirely for remote BASE_URLs.
  webServer: isLocalTarget
    ? {
        command: `pnpm -w exec turbo run build --filter=hub^... && pnpm --filter hub exec next dev --port ${hubPort}`,
        url: baseURL,
        timeout: 240_000,
        reuseExistingServer: !process.env.CI,
        stdout: 'pipe',
        stderr: 'pipe',
        env: {
          // Route wagmi RPC through a non-localhost proxy URL so the Anvil
          // fixture can intercept it by ?chainId= and redirect to the forks
          // (it deliberately skips localhost). Next does not override env vars
          // that are already set, so this wins over apps/hub/.env. Puzzle auth
          // stays off (default) — no token handshake, fully driven by the proxy
          // URL shape.
          NEXT_PUBLIC_STATUS_API_URL:
            process.env.HUB_STATUS_API_URL ??
            'https://status-api-status-im-web.vercel.app',
        },
      }
    : undefined,

  projects: [
    {
      name: 'smoke',
      grep: /@smoke/,
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
    {
      name: 'wallet-flows',
      grep: /@wallet/,
      use: {
        headless: false,
      },
    },
    {
      name: 'anvil',
      grep: /@anvil/,
      use: {
        headless: false,
      },
    },
  ],
})
