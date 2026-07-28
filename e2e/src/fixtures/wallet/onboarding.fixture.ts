import { WALLET_EXTENSION_PATH, WALLET_PAGE } from '@constants/wallet.js'
import { WalletOnboardingPage } from '@pages/wallet/onboarding.page.js'
import { test as base } from '@playwright/test'
import fs from 'node:fs'

import { launchExtensionContext } from '../extension-context.js'

import type { BrowserContext, Page } from '@playwright/test'

/**
 * Lightweight wallet-onboarding fixture for the recovery-phrase entry screen.
 *
 * Unlike {@link file://./wallet-extension.fixture.ts}, this does NOT stand up
 * Anvil or the status-api backend and does NOT auto-onboard. It only loads the
 * built extension and parks a fresh page on the onboarding landing, so specs
 * can drive the recovery-phrase grid deterministically without any network.
 *
 * It therefore covers the pre-submit UI only (word-count dropdown, per-word
 * validation, paste distribution, checksum gating, clear, keyboard nav). The
 * post-submit path (account discovery -> password -> portfolio) hits live RPC
 * and is exercised by wallet-extension.fixture's importWallet() instead.
 *
 * Requires a built extension at apps/wallet/.output/chrome-mv3 (opt-in project).
 */
export interface OnboardingFixtures {
  onboardingContext: BrowserContext
  onboardingPage: Page
  onboarding: WalletOnboardingPage
}

export const test = base.extend<OnboardingFixtures>({
  onboardingContext: async ({}, use) => {
    if (!fs.existsSync(WALLET_EXTENSION_PATH)) {
      throw new Error(
        `Wallet extension not found at ${WALLET_EXTENSION_PATH}. ` +
          'Build it first: pnpm --filter wallet build:chrome',
      )
    }
    await launchExtensionContext(WALLET_EXTENSION_PATH, use, {
      profilePrefix: 'pw-wallet-onboarding-',
    })
  },

  onboardingPage: async ({ onboardingContext }, use) => {
    const serviceWorker =
      onboardingContext.serviceWorkers()[0] ??
      (await onboardingContext.waitForEvent('serviceworker', {
        timeout: 30_000,
      }))
    const extensionId = new URL(serviceWorker.url()).host

    const page = await onboardingContext.newPage()
    await page.goto(`chrome-extension://${extensionId}/${WALLET_PAGE}`)
    await page.waitForLoadState('domcontentloaded')

    await use(page)
  },

  onboarding: async ({ onboardingPage }, use) => {
    const onboarding = new WalletOnboardingPage(onboardingPage)
    await onboarding.waitForReady()
    await use(onboarding)
  },
})

export { expect } from '@playwright/test'
