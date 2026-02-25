import { loadEnvConfig } from '@config/env.js'
import { EXTENSION_TIMEOUTS, VIEWPORT } from '@constants/timeouts.js'
import { MetaMaskPage } from '@pages/metamask/metamask.page.js'
import { chromium, test as base } from '@playwright/test'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import type { BrowserContext, Page } from '@playwright/test'

interface MetaMaskFixtures {
  extensionContext: BrowserContext
  extensionId: string
  metamask: MetaMaskPage
  hubPage: Page
}

export const test = base.extend<MetaMaskFixtures>({
  extensionContext: async ({}, use) => {
    const env = loadEnvConfig()
    const extensionPath = env.METAMASK_EXTENSION_PATH

    if (!fs.existsSync(extensionPath)) {
      throw new Error(
        `MetaMask extension not found at ${extensionPath}. Run "pnpm setup:metamask" first.`,
      )
    }

    const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pw-metamask-'))

    const context = await chromium.launchPersistentContext(profileDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-first-run',
        '--disable-default-apps',
      ],
      viewport: { width: VIEWPORT.WIDTH, height: VIEWPORT.HEIGHT },
    })

    await use(context)

    await context.close()
    fs.rmSync(profileDir, { recursive: true, force: true })
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
