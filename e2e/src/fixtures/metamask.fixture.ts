import { loadEnvConfig } from '@config/env.js'
import { EXTENSION_TIMEOUTS } from '@constants/timeouts.js'
import { VIEWPORT } from '@constants/viewport.js'
import { MetaMaskPage } from '@pages/metamask/metamask.page.js'
import { chromium, test as base } from '@playwright/test'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import type { BrowserContext, Page } from '@playwright/test'

export interface MetaMaskFixtures {
  extensionContext: BrowserContext
  extensionId: string
  metamask: MetaMaskPage
  hubPage: Page
}

export interface LaunchMetaMaskOptions {
  /** Called with the extension path BEFORE the browser reads the extension files. */
  beforeLaunch?: (extensionPath: string) => void | Promise<void>
  /** Called after the browser context is closed. */
  afterClose?: () => void | Promise<void>
  /** Additional Chrome flags appended to the default set. */
  extraChromeArgs?: string[]
}

/**
 * Launch a persistent Chromium context with MetaMask loaded.
 * Shared between metamask.fixture and anvil.fixture to avoid duplicating
 * ~40 lines of browser launch logic.
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

  await options.beforeLaunch?.(extensionPath)

  const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pw-metamask-'))

  const context = await chromium.launchPersistentContext(profileDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      '--no-first-run',
      '--disable-default-apps',
      ...(options.extraChromeArgs ?? []),
    ],
    viewport: { width: VIEWPORT.WIDTH, height: VIEWPORT.HEIGHT },
  })

  await use(context)

  try {
    await context.close()
  } finally {
    fs.rmSync(profileDir, { recursive: true, force: true })
    await options.afterClose?.()
  }
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
