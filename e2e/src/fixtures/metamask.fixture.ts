import { loadEnvConfig } from '@config/env.js'
import { EXTENSION_TIMEOUTS } from '@constants/timeouts.js'
import { MetaMaskPage } from '@pages/metamask/metamask.page.js'
import { test as base } from '@playwright/test'
import fs from 'node:fs'

import { launchExtensionContext } from './extension-context.js'

import type { LaunchExtensionOptions } from './extension-context.js'
import type { BrowserContext, Page } from '@playwright/test'

export interface MetaMaskFixtures {
  extensionContext: BrowserContext
  extensionId: string
  metamask: MetaMaskPage
  hubPage: Page
}

export type LaunchMetaMaskOptions = LaunchExtensionOptions

/**
 * Launch a persistent Chromium context with MetaMask loaded.
 *
 * Thin wrapper over {@link launchExtensionContext} that resolves the MetaMask
 * extension path from env and gives a MetaMask-specific "not found" hint.
 */
export async function launchMetaMaskContext(
  use: (context: BrowserContext) => Promise<void>,
  options: LaunchMetaMaskOptions = {},
): Promise<void> {
  const env = loadEnvConfig()
  const extensionPath = env.METAMASK_EXTENSION_PATH

  if (!fs.existsSync(extensionPath)) {
    throw new Error(
      `MetaMask extension not found at ${extensionPath}. Run "pnpm setup:metamask" first.`,
    )
  }

  await launchExtensionContext(extensionPath, use, {
    profilePrefix: 'pw-metamask-',
    ...options,
  })
}

export const test = base.extend<MetaMaskFixtures>({
  extensionContext: async ({}, use) => {
    await launchMetaMaskContext(use)
  },

  extensionId: async ({ extensionContext }, use) => {
    const serviceWorker =
      extensionContext.serviceWorkers()[0] ??
      (await extensionContext.waitForEvent('serviceworker', {
        timeout: EXTENSION_TIMEOUTS.SERVICE_WORKER,
      }))

    const extensionId = new URL(serviceWorker.url()).host
    await use(extensionId)
  },

  metamask: async ({ extensionContext, extensionId }, use) => {
    const metamask = new MetaMaskPage(extensionContext, extensionId)
    await use(metamask)
  },

  hubPage: async ({ extensionContext }, use) => {
    const env = loadEnvConfig()
    const page = await extensionContext.newPage()
    await page.goto(env.BASE_URL)
    await use(page)
  },
})

export { expect } from '@playwright/test'
