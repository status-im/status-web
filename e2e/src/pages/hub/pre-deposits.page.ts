import { HUB_TIMEOUTS } from '@constants/timeouts.js'
import { BasePage } from '@pages/base.page.js'
import { expect, type Locator, type Page } from '@playwright/test'

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

  /**
   * Scope to a single vault card by its exact name heading (e.g. "WETH vault").
   * Walks up to the nearest card container (`rounded-32`) so per-card buttons
   * and links can be queried without colliding with other cards.
   */
  vaultCard(name: string): Locator {
    return this.page
      .getByRole('heading', { level: 3, name, exact: true })
      .locator('xpath=ancestor::div[contains(@class,"rounded-32")][1]')
  }

  /**
   * The primary action button on a vault card. For withdrawal-enabled vaults
   * this reads "Unlock" (cross-chain) or "Claim" (Linea same-chain), and
   * "Coming soon" while the on-chain vault state is still loading.
   */
  vaultActionButton(name: string): Locator {
    return this.vaultCard(name).getByRole('button')
  }

  /**
   * GUSD withdrawals happen in an external app, so that card renders an
   * external link instead of an in-app action button.
   */
  vaultExternalClaimLink(name: string): Locator {
    return this.vaultCard(name).getByRole('link')
  }

  /** Click "Unlock" / "Claim" on a vault card once it is enabled. */
  async clickUnlock(name: string): Promise<void> {
    const button = this.vaultActionButton(name)
    await expect(button).toBeEnabled({ timeout: HUB_TIMEOUTS.PAGE_READY })
    await button.click()
  }
}
