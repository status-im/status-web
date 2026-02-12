import type { BrowserContext, Page } from '@playwright/test';

export class OnboardingPage {
  constructor(
    private readonly context: BrowserContext,
    private readonly extensionId: string,
  ) {}

  private get baseUrl(): string {
    return `chrome-extension://${this.extensionId}`;
  }

  /** Import wallet from seed phrase via MetaMask onboarding */
  async importWallet(seedPhrase: string, password: string): Promise<void> {
    const page = await this.navigateToOnboarding();

    // Step 1: Choose "I have an existing wallet"
    await page
      .getByRole('button', { name: /i have an existing wallet/i })
      .click();

    // Step 2: Choose "Import using Secret Recovery Phrase"
    await page
      .getByRole('button', { name: /import using secret recovery phrase/i })
      .click();

    // Step 3: Enter seed phrase in textarea
    const textarea = page.locator('textarea');
    await textarea.click();
    await textarea.pressSequentially(seedPhrase.trim(), { delay: 30 });
    await page.getByTestId('import-srp-confirm').click();

    // Step 4: Create password
    await page.getByTestId('create-password-new-input').fill(password);
    await page.getByTestId('create-password-confirm-input').fill(password);
    await page.getByTestId('create-password-terms').click();
    await page.getByRole('button', { name: /create password/i }).click();

    // Step 5: Dismiss metametrics
    await page.getByTestId('metametrics-i-agree').click();

    // Step 6: Complete onboarding
    await page.getByTestId('onboarding-complete-done').click();

    // Step 7: Dismiss post-onboarding popups
    await this.dismissPostOnboardingPopups(page);
  }

  private async navigateToOnboarding(): Promise<Page> {
    const onboardingUrl = `${this.baseUrl}/home.html#onboarding/welcome`;

    let mmPage = this.context
      .pages()
      .find(p => p.url().startsWith(`chrome-extension://${this.extensionId}`));

    if (!mmPage) {
      mmPage = await this.context.newPage();
    }

    await mmPage.goto(onboardingUrl);
    await mmPage.waitForLoadState('domcontentloaded');
    return mmPage;
  }

  private async dismissPostOnboardingPopups(page: Page): Promise<void> {
    // Try to dismiss "What's New" popup
    const whatsNewClose = page.getByTestId('popover-close');
    if (
      await whatsNewClose.isVisible({ timeout: 3000 }).catch(() => false)
    ) {
      await whatsNewClose.click();
    }
  }
}
