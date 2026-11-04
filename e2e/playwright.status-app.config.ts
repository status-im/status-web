import { defineConfig, devices } from '@playwright/test'

import { STATUS_APP_URL } from './src/config/site.js'
import { STATUS_APP_RULES } from './src/constants/status-app.js'

import type { SiteOptions } from './src/fixtures/site.fixture.js'

/**
 * status.app suite. It starts no server: point STATUS_APP_URL at a running
 * instance (default http://localhost:3001, the `dev:next` port), staging or
 * production. Settings come from the shell, e2e/.env.local or e2e/.env (loaded
 * in src/config/site.ts). The daily workflow runs it against https://dev.status.app and
 * https://status.app.
 */
export default defineConfig<SiteOptions>({
  testDir: './tests/status-app',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 2,
  reporter: [
    ['html', { outputFolder: 'test-results/html-report', open: 'never' }],
    ['list'],
    ...(process.env.CI
      ? ([['github', {}]] as [string, Record<string, unknown>][])
      : []),
  ],
  outputDir: 'test-results/artifacts',

  use: {
    ...devices['Desktop Chrome'],
    baseURL: STATUS_APP_URL,
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    // `next dev` compiles a route on its first visit.
    navigationTimeout: 45_000,
    siteRules: STATUS_APP_RULES,
  },

  projects: [{ name: 'status.app', grep: /@status-app/ }],
})
