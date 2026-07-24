import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'node:path'

import {
  runsHubProjects,
  runsWalletOnboardingProject,
  runsWalletProjects,
} from './src/config/test-servers.js'

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

// Start exactly the servers the selected projects need: the Hub for Hub-backed
// projects, and the local status-api backend (apps/api) + path-forwarding
// rpc-router for wallet-extension projects. A full `pnpm test` (CI) starts both;
// targeted runs (e.g. --project=wallet-send) start only what they need. The
// Anvil forks are managed separately by anvil:up/down (docker).
const needsHubServer = isLocalTarget && runsHubProjects()
const needsWalletServers = runsWalletProjects()
const routerPort = process.env.RPC_ROUTER_PORT ?? '8548'
const walletApiUrl =
  process.env.WALLET_STATUS_API_URL ?? 'http://localhost:3030'
const walletApiPort = (() => {
  try {
    return new URL(walletApiUrl).port || '3030'
  } catch {
    return '3030'
  }
})()
const anvilMainnetRpc =
  process.env.ANVIL_MAINNET_RPC ||
  `http://localhost:${process.env.MAINNET_FORK_PORT ?? '8547'}`
const anvilLineaRpc =
  process.env.ANVIL_LINEA_RPC ||
  `http://localhost:${process.env.LINEA_FORK_PORT ?? '8546'}`

const hubWebServer = {
  command: `pnpm -w exec turbo run build --filter=hub^... && pnpm --filter hub exec next dev --port ${hubPort}`,
  url: baseURL,
  timeout: 240_000,
  reuseExistingServer: !process.env.CI,
  stdout: 'pipe' as const,
  stderr: 'pipe' as const,
  env: {
    // Route wagmi RPC through a non-localhost proxy URL so the Anvil fixture can
    // intercept it by ?chainId= and redirect to the forks (it deliberately skips
    // localhost). Next does not override env vars that are already set, so this
    // wins over apps/hub/.env. Puzzle auth stays off (default) — no token
    // handshake, fully driven by the proxy URL shape.
    NEXT_PUBLIC_STATUS_API_URL:
      process.env.HUB_STATUS_API_URL ??
      'https://status-api-status-im-web.vercel.app',
  },
}

const walletWebServers = [
  {
    // Path-forwarding proxy: apps/api's ETH_RPC_PROXY_URL points here; it strips
    // the /<chain>/<network>[/alchemy] path and forwards to the right Anvil fork.
    command: 'node scripts/rpc-router.mjs',
    // Use `port` (TCP accept) not `url` — apps/api 404s on / and the router only
    // answers POST, so an HTTP status check would never look "ready".
    port: Number(routerPort),
    timeout: 30_000,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe' as const,
    stderr: 'pipe' as const,
    env: {
      RPC_ROUTER_PORT: routerPort,
      ANVIL_MAINNET_RPC: anvilMainnetRpc,
      ANVIL_LINEA_RPC: anvilLineaRpc,
    } as Record<string, string>,
  },
  {
    // Local status-api backend the wallet extension talks to. Its other secrets
    // come from apps/api/.env.local; we only redirect chain calls to the router.
    command: `pnpm --filter api exec next dev --turbopack --port ${walletApiPort}`,
    // `port` (TCP accept) not `url` — apps/api returns 404 on /.
    port: Number(walletApiPort),
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe' as const,
    stderr: 'pipe' as const,
    env: {
      ETH_RPC_PROXY_URL: `http://localhost:${routerPort}`,
    } as Record<string, string>,
  },
]

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

  // Start the Hub and/or wallet servers based on which projects are running.
  webServer: (() => {
    const servers = [
      ...(needsHubServer ? [hubWebServer] : []),
      ...(needsWalletServers ? walletWebServers : []),
    ]
    return servers.length > 0 ? servers : undefined
  })(),

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
      // MetaMask-driven Hub flows. Exclude @wallet-send/@wallet-swap (the
      // wallet-extension tags), which contain "@wallet" as a substring.
      name: 'wallet-flows',
      grep: /@wallet(?![\w-])/,
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
    // Recovery-phrase grid UI. Opt-in (needs a built extension) but backend-free
    // — no Anvil/status-api — so it does NOT flip needsWalletServers. Gated by
    // RUN_WALLET_ONBOARDING via the test:wallet-onboarding script.
    ...(runsWalletOnboardingProject()
      ? [
          {
            name: 'wallet-onboarding',
            grep: /@wallet-onboarding/,
            use: {
              headless: false,
            },
          },
        ]
      : []),
    // Wallet-extension projects are opt-in (need apps/api + a built extension the
    // shared CI can't provide). Defined only when explicitly selected via
    // --project or RUN_WALLET_E2E, so a plain `pnpm test` stays the core suite.
    ...(runsWalletProjects()
      ? [
          {
            // Native-ETH send flows against the local fork. Live-integration
            // tests: retry to absorb transient fork/RPC faults (each retry
            // re-runs with a fresh context + snapshot).
            name: 'wallet-send',
            grep: /@wallet-send/,
            retries: 2,
            use: {
              headless: false,
            },
          },
          {
            // Swap flows (LiFi widget) against the local fork.
            name: 'wallet-swap',
            grep: /@wallet-swap/,
            retries: 2,
            use: {
              headless: false,
            },
          },
        ]
      : []),
  ],
})
