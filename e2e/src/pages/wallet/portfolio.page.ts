import { expect } from '@playwright/test'

import { BasePage } from '../base.page.js'

/**
 * Portfolio assets view + navigation into a token's detail page (where the Send
 * and Exchange actions live). The asset list is served by the data seam.
 */
export class WalletPortfolioPage extends BasePage {
  async goto(): Promise<void> {
    // Reached automatically after onboarding; nothing to navigate.
  }

  async waitForReady(): Promise<void> {
    await this.page.waitForURL(/\/portfolio\/assets/, { timeout: 30_000 })
  }

  /**
   * The asset list is rendered twice (desktop + mobile, one hidden via
   * `2xl:hidden`), so the name text appears more than once — match all and click
   * the visible occurrence (the click bubbles to the row's handler).
   */
  assetLabels(name: string) {
    return this.page.getByText(name, { exact: true })
  }

  /** Open a token's detail page by clicking its (visible) row. */
  async openAsset(name: string, ticker: string): Promise<void> {
    const labels = this.assetLabels(name)
    await expect(labels.first()).toBeAttached({ timeout: 15_000 })
    const count = await labels.count()
    for (let i = 0; i < count; i++) {
      const label = labels.nth(i)
      if (await label.isVisible()) {
        await label.click()
        await this.page.waitForURL(new RegExp(`/portfolio/assets/${ticker}`), {
          timeout: 15_000,
        })
        return
      }
    }
    throw new Error(`No visible asset row for "${name}"`)
  }
}
