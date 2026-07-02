import {
  deriveWalletAddress,
  loadEnvConfig,
  requireWalletSeedPhrase,
} from '@config/env.js'
import {
  WALLET_EXTENSION_PATH,
  WALLET_FUND_ETH,
  WALLET_PAGE,
  WALLET_TEST_PASSWORD,
  WALLET_VIEWPORT,
} from '@constants/wallet.js'
import { AnvilRpcHelper } from '@helpers/anvil-rpc.js'
import { captureNativeTokenBody } from '@helpers/native-token-fixture.js'
import { WalletOnboardingPage } from '@pages/wallet/onboarding.page.js'
import { WalletPortfolioPage } from '@pages/wallet/portfolio.page.js'
import { WalletSendModalPage } from '@pages/wallet/send-modal.page.js'
import { WalletSwapDrawerPage } from '@pages/wallet/swap-drawer.page.js'
import { chromium, test as base } from '@playwright/test'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { createLifiMock } from './lifi-mock.js'
import {
  installWalletDataSeam,
  type WalletDataSeamController,
} from './status-api-mocks.js'

import type { BrowserContext, Page } from '@playwright/test'

/**
 * Wallet-extension E2E fixture.
 *
 * Loads the Status wallet dev build, redirects all chain I/O to the local Anvil
 * mainnet fork (via apps/api -> rpc-router, wired by the webServer/env), onboards
 * a seed, and renders a funded portfolio through the data seam.
 *
 * Isolation: mainnet fork is snapshotted after the first funding; every test
 * reverts to that snapshot and re-funds, so on-chain state never bleeds between
 * tests. Requires workers: 1 (module-level snapshot state).
 *
 * Native ETH source only (Anvil can't serve Alchemy enhanced APIs); the seam
 * supplies the portfolio list + a balance-patched nativeToken so the send/swap
 * UIs see the funded balance deterministically.
 */

const FUND_WEI = BigInt(WALLET_FUND_ETH) * 10n ** 18n

// Module-level — safe with workers: 1.
let baseSnapshot: string | null = null

// Seam controller per context, so the `dataSeam` fixture can expose the same
// controller installed once by `walletContext` (avoids double-registering routes).
const seamControllers = new WeakMap<BrowserContext, WalletDataSeamController>()

export interface WalletFixtures {
  anvilRpc: AnvilRpcHelper
  walletContext: BrowserContext
  dataSeam: WalletDataSeamController
  /** Onboarded extension page sitting on /portfolio/assets. */
  walletPage: Page
  portfolio: WalletPortfolioPage
  sendModal: WalletSendModalPage
  swapDrawer: WalletSwapDrawerPage
}

export const test = base.extend<WalletFixtures>({
  // --- Anvil mainnet fork: fund + snapshot/revert isolation -------------------
  anvilRpc: async ({}, use, testInfo) => {
    if (testInfo.config.workers > 1) {
      throw new Error(
        'wallet-extension.fixture requires workers: 1 (module-level snapshot state).',
      )
    }

    const env = loadEnvConfig()
    const walletAddress = deriveWalletAddress(requireWalletSeedPhrase())
    const helper = new AnvilRpcHelper(
      env.ANVIL_MAINNET_RPC,
      env.ANVIL_LINEA_RPC,
      walletAddress,
    )

    if (!baseSnapshot) {
      // Light reachability check only — requireHealthy() reads contract code
      // (SNT/WETH/LINEA) which triggers archive requests the non-archive fork
      // upstream rejects. The wallet send/swap flows don't need those contracts.
      if (!(await helper.healthCheck(helper.mainnetRpc))) {
        throw new Error(
          `Anvil mainnet fork not reachable at ${env.ANVIL_MAINNET_RPC}. Run: pnpm anvil:up`,
        )
      }
      await helper.setEthBalance(FUND_WEI)
      baseSnapshot = await helper.snapshot(helper.mainnetRpc)
    } else {
      try {
        await helper.revert(baseSnapshot, helper.mainnetRpc)
      } catch {
        await helper.setEthBalance(FUND_WEI)
      }
      // evm_revert consumes the snapshot; take a fresh one for the next test.
      baseSnapshot = await helper.snapshot(helper.mainnetRpc)
    }

    // Auto-mine by default; congestion profiles override per-test.
    await helper.enableAutoMining()

    await use(helper)
  },

  // --- Wallet context: launch, seam, (fund-derived) balances ------------------
  walletContext: async ({ anvilRpc }, use) => {
    const walletAddress = anvilRpc.walletAddress
    const nativeTokenBody = await captureNativeTokenBody(
      walletAddress,
      WALLET_FUND_ETH,
    )

    const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pw-wallet-'))
    const context = await chromium.launchPersistentContext(profileDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${WALLET_EXTENSION_PATH}`,
        `--load-extension=${WALLET_EXTENSION_PATH}`,
        '--no-first-run',
        '--disable-default-apps',
      ],
      viewport: WALLET_VIEWPORT,
    })

    // Install the data seam once, before any page loads, so the extension's
    // first portfolio/token reads are served from it.
    const controller = await installWalletDataSeam(context, {
      ethBalance: WALLET_FUND_ETH,
      nativeTokenBody,
      lifi: createLifiMock(),
      logUnmocked: false,
    })
    seamControllers.set(context, controller)

    await use(context)

    await context.close().catch(() => {})
    fs.rmSync(profileDir, { recursive: true, force: true })
  },

  // Expose the controller installed by walletContext so tests can mutate
  // activity/balance state mid-flow.
  dataSeam: async ({ walletContext }, use) => {
    const controller = seamControllers.get(walletContext)
    if (!controller) throw new Error('data seam was not installed on context')
    await use(controller)
  },

  // --- Onboarded page on the portfolio ---------------------------------------
  walletPage: async ({ walletContext }, use) => {
    const env = loadEnvConfig()

    const sw =
      walletContext.serviceWorkers()[0] ??
      (await walletContext.waitForEvent('serviceworker', { timeout: 30_000 }))
    const extensionId = new URL(sw.url()).host

    const page = await walletContext.newPage()
    await page.goto(`chrome-extension://${extensionId}/${WALLET_PAGE}`)
    await page.waitForLoadState('domcontentloaded')

    const onboarding = new WalletOnboardingPage(page)
    await onboarding.waitForReady()
    await onboarding.importWallet(env.WALLET_SEED_PHRASE, WALLET_TEST_PASSWORD)

    const portfolio = new WalletPortfolioPage(page)
    await portfolio.waitForReady()

    await use(page)
  },

  portfolio: async ({ walletPage }, use) => {
    await use(new WalletPortfolioPage(walletPage))
  },

  sendModal: async ({ walletPage }, use) => {
    await use(new WalletSendModalPage(walletPage))
  },

  swapDrawer: async ({ walletPage }, use) => {
    await use(new WalletSwapDrawerPage(walletPage))
  },
})

export { expect } from '@playwright/test'
