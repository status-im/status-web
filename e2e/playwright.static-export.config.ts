import { defineConfig, devices } from '@playwright/test'

const getSitePort = process.env.GET_STATUS_APP_PORT ?? '3015'
const hubPort = process.env.HUB_PORT ?? '3013'
const statusNetworkPort = process.env.STATUS_NETWORK_PORT ?? '3012'

/**
 * Static-export smoke tests for Jenkins-deployed sites:
 * get.status.app, hub, and status.network.
 *
 * Builds production static exports (next build + strip-locale postbuild) and
 * serves each `out/` with `serve`, matching static hosting — not `next dev`.
 */
export default defineConfig({
  timeout: 120_000,
  expect: { timeout: 15_000 },
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

  projects: [
    {
      name: 'get.status.app',
      testDir: './tests/get-status-app',
      grep: /@get-static/,
      use: {
        baseURL:
          process.env.GET_STATUS_APP_URL ?? `http://127.0.0.1:${getSitePort}`,
        screenshot: 'only-on-failure',
        trace: 'on-first-retry',
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
    {
      name: 'hub',
      testDir: './tests/hub',
      grep: /@hub-static/,
      use: {
        baseURL: process.env.HUB_URL ?? `http://127.0.0.1:${hubPort}`,
        screenshot: 'only-on-failure',
        trace: 'on-first-retry',
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
    {
      name: 'status.network',
      testDir: './tests/status-network',
      grep: /@status-network-static/,
      use: {
        baseURL:
          process.env.STATUS_NETWORK_URL ??
          `http://127.0.0.1:${statusNetworkPort}`,
        screenshot: 'only-on-failure',
        trace: 'on-first-retry',
        ...devices['Desktop Chrome'],
        headless: true,
      },
    },
  ],

  webServer: {
    command: 'bash scripts/serve-static-exports.sh',
    url: `http://127.0.0.1:${getSitePort}`,
    timeout: 900_000,
    reuseExistingServer: process.env.REUSE_STATIC_EXPORT_SERVERS === 'true',
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
