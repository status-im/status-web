import type { Locator, Page } from '@playwright/test'

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** Navigate to this page's path */
  abstract goto(): Promise<void>

  /** Wait for the page to be fully loaded (override per page) */
  abstract waitForReady(): Promise<void>

  /** Navigate and wait for ready state */
  async navigateAndWait(): Promise<void> {
    await this.goto()
    await this.waitForReady()
  }

  /** Get the page title */
  async getTitle(): Promise<string> {
    return this.page.title()
  }

  /** Scroll element into view */
  protected async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded()
  }

  /**
   * Click the first *visible* match of a locator. The wallet renders many
   * controls twice (desktop + mobile, one hidden via `2xl:hidden`), so a plain
   * `.click()` can resolve to the hidden copy and time out.
   */
  protected async clickVisible(
    locator: Locator,
    opts: { timeoutMs?: number; force?: boolean } = {},
  ): Promise<void> {
    const { timeoutMs = 15_000, force = false } = opts
    const deadline = Date.now() + timeoutMs
    do {
      const count = await locator.count()
      for (let i = 0; i < count; i++) {
        const candidate = locator.nth(i)
        if (await candidate.isVisible()) {
          // force bypasses sticky-header pointer interception common in the
          // wallet's detail panels.
          await candidate.scrollIntoViewIfNeeded().catch(() => {})
          await candidate.click({ force })
          return
        }
      }
      await this.page.waitForTimeout(200)
    } while (Date.now() < deadline)
    throw new Error(`No visible element for locator within ${timeoutMs}ms`)
  }
}
