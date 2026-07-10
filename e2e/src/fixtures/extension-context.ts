import { VIEWPORT } from '@constants/viewport.js'
import { chromium } from '@playwright/test'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import type { BrowserContext } from '@playwright/test'

export interface LaunchExtensionOptions {
  /** Called with the extension path BEFORE the browser reads the extension files. */
  beforeLaunch?: (extensionPath: string) => void | Promise<void>
  /** Called after the browser context is closed. */
  afterClose?: () => void | Promise<void>
  /** Additional Chrome flags appended to the default set. */
  extraChromeArgs?: string[]
  /** Prefix for the temp profile dir (helps identify leaked profiles). */
  profilePrefix?: string
  /** Override the viewport (defaults to the shared VIEWPORT constant). */
  viewport?: { width: number; height: number }
}

/**
 * Launch a persistent Chromium context with an unpacked extension loaded.
 *
 * Shared by the MetaMask suite (Hub tests) and the Status wallet extension
 * suite. The caller is responsible for locating the extension build directory
 * and passing it in; this helper only handles the browser lifecycle, temp
 * profile, and cleanup.
 */
export async function launchExtensionContext(
  extensionPath: string,
  use: (context: BrowserContext) => Promise<void>,
  options: LaunchExtensionOptions = {},
): Promise<void> {
  if (!fs.existsSync(extensionPath)) {
    throw new Error(`Extension not found at ${extensionPath}.`)
  }

  await options.beforeLaunch?.(extensionPath)

  const profileDir = fs.mkdtempSync(
    path.join(os.tmpdir(), options.profilePrefix ?? 'pw-extension-'),
  )

  const launchStart = Date.now()
  const context = await chromium.launchPersistentContext(profileDir, {
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      '--no-first-run',
      '--disable-default-apps',
      ...(options.extraChromeArgs ?? []),
    ],
    viewport: options.viewport ?? {
      width: VIEWPORT.WIDTH,
      height: VIEWPORT.HEIGHT,
    },
  })
  console.log(
    `[extension-context] Browser launched in ${Date.now() - launchStart}ms`,
  )

  await use(context)

  try {
    await context.close()
  } finally {
    fs.rmSync(profileDir, { recursive: true, force: true })
    await options.afterClose?.()
  }
}
