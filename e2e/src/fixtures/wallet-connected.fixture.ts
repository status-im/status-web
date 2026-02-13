import { test as metamaskTest } from './metamask.fixture.js';
import { loadEnvConfig, requireWalletSeedPhrase } from '../config/env.js';

export const test = metamaskTest.extend({
  metamask: async ({ metamask }, use) => {
    const env = loadEnvConfig();
    const seedPhrase = requireWalletSeedPhrase();

    await metamask.onboarding.importWallet(seedPhrase, env.WALLET_PASSWORD);

    await use(metamask);
  },

  hubPage: async ({ extensionContext, metamask }, use) => {
    const env = loadEnvConfig();
    const page = await extensionContext.newPage();
    await page.goto(env.BASE_URL);

    await metamask.connectToDApp(page);

    await use(page);
  },
});

export { expect } from '@playwright/test';
