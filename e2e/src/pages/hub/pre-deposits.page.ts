import { HUB_TIMEOUTS } from '@constants/timeouts.js'
import { BasePage } from '@pages/base.page.js'
import { expect, type Page } from '@playwright/test'

export class PreDepositsPage extends BasePage {
  readonly heading = this.page.getByRole('heading', {
    name: /pre-deposit vaults/i,
  })
  readonly tvlValue = this.page.locator('text=/\\$[\\d,.]+/').first()
  readonly learnMoreLink = this.page
    .getByRole('link', { name: /learn more/i })
    .first()
  readonly faqHeading = this.page.getByRole('heading', { name: /faq/i })

  /**
   * Vault card name headings (e.g. "WETH vault", "SNT Vault").
   * Anchored to the "<token> vault" shape so FAQ accordion headings that also
   * contain the word "vault" are not matched.
   */
  get vaultHeadings() {
    return this.page
      .getByRole('heading', { level: 3 })
      .filter({ hasText: /^\S+ vaults?$/i })
  }

  constructor(page: Page) {
    super(page)
  }

  async goto(): Promise<void> {
    await this.page.goto('/pre-deposits')
  }

  async waitForReady(): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: HUB_TIMEOUTS.PAGE_READY })
  }
}
