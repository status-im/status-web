import {
  loadEnvConfig,
  requireWalletPassword,
  requireWalletSeedPhrase,
} from '@config/env.js'

import { test as metamaskTest } from '../metamask.fixture.js'

export const test = metamaskTest.extend({
  metamask: async ({ metamask }, use) => {
    const seedPhrase = requireWalletSeedPhrase()
    const password = requireWalletPassword()

    await metamask.onboarding.importWallet(seedPhrase, password)

    await use(metamask)
  },

  hubPage: async ({ extensionContext, metamask }, use) => {
    const env = loadEnvConfig()
    const page = await extensionContext.newPage()
    await page.goto(env.BASE_URL)

    await metamask.connectToDApp(page)

    await use(page)
  },
})

export { expect } from '@playwright/test'
