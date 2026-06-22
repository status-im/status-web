import fs from 'node:fs'
import path from 'node:path'

import { loadEnvConfig } from './src/config/env.js'

async function globalSetup(): Promise<void> {
  console.log('[global-setup] Validating environment...')

  const env = loadEnvConfig()

  // Validate MetaMask extension is present
  if (!fs.existsSync(env.METAMASK_EXTENSION_PATH)) {
    console.warn(
      `[global-setup] MetaMask extension not found at: ${env.METAMASK_EXTENSION_PATH}\n` +
        `Run "pnpm setup:metamask" to download it.\n` +
        `Wallet-dependent tests will fail.`,
    )
  }

  // Warn about missing seed phrase
  if (!env.WALLET_SEED_PHRASE) {
    console.warn(
      '[global-setup] WALLET_SEED_PHRASE is not set. ' +
        'Wallet-dependent tests will fail. ' +
        'Set it in .env or .env.local.',
    )
  }

  // Ensure output directories exist
  const outputDir = path.resolve(import.meta.dirname, 'test-results')
  fs.mkdirSync(path.join(outputDir, 'html-report'), { recursive: true })
  fs.mkdirSync(path.join(outputDir, 'traces'), { recursive: true })

  console.log('[global-setup] Environment validated.')
  console.log(`[global-setup] Base URL: ${env.BASE_URL}`)
  console.log(
    `[global-setup] MetaMask: ${fs.existsSync(env.METAMASK_EXTENSION_PATH) ? 'found' : 'NOT found'}`,
  )

  // For a local dev server, pre-compile the routes the tests hit so the first
  // in-test navigation isn't racing Next's on-demand compile (Playwright's
  // webServer only waits for the home route).
  if (/localhost|127\.0\.0\.1/.test(env.BASE_URL)) {
    await warmUpRoutes(env.BASE_URL, ['/', '/pre-deposits'])
  }
}

/** Hit routes once to trigger dev-server compilation; failures are non-fatal. */
async function warmUpRoutes(baseUrl: string, routes: string[]): Promise<void> {
  for (const route of routes) {
    const url = new URL(route, baseUrl).toString()
    try {
      await fetch(url, { redirect: 'follow' })
      console.log(`[global-setup] Warmed up ${route}`)
    } catch (error) {
      console.warn(
        `[global-setup] Warm-up failed for ${route}: ` +
          `${error instanceof Error ? error.message : error}`,
      )
    }
  }
}

export default globalSetup
