import { expect, type Page } from '@playwright/test';
import { BasePage } from '../base.page.js';

export class PreDepositsPage extends BasePage {
  readonly heading = this.page.getByRole('heading', {
    name: /pre-deposit vaults/i,
  });
  readonly tvlValue = this.page.locator('text=/\\$[\\d,.]+/').first();
  readonly learnMoreLink = this.page
    .getByRole('link', { name: /learn more/i })
    .first();
  readonly faqHeading = this.page.getByRole('heading', { name: /faq/i });

  /** All vault name headings on the page */
  get vaultHeadings() {
    return this.page
      .getByRole('heading', { level: 3 })
      .filter({ hasText: /vault/i });
  }

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.page.goto('/pre-deposits');
  }

  async waitForReady(): Promise<void> {
    await expect(this.heading).toBeVisible({ timeout: 15_000 });
  }

  /** Click deposit on a specific vault by token symbol */
  async clickDepositForVault(symbol: string): Promise<void> {
    const depositButton = this.page
      .locator(`text=${symbol}`)
      .locator('..')
      .getByRole('button', { name: /deposit/i });
    await depositButton.click();
  }
}
