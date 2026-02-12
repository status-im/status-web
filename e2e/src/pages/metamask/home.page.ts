import type { BrowserContext, Page } from '@playwright/test';

export class MetaMaskHomePage {
  constructor(
    private readonly context: BrowserContext,
    private readonly extensionId: string,
  ) {}

  private get homeUrl(): string {
    return `chrome-extension://${this.extensionId}/home.html`;
  }

  /** Open MetaMask home and return its page */
  async open(): Promise<Page> {
    let mmPage = this.context
      .pages()
      .find(p =>
        p.url().startsWith(`chrome-extension://${this.extensionId}`),
      );

    if (!mmPage) {
      mmPage = await this.context.newPage();
    }

    await mmPage.goto(this.homeUrl);
    return mmPage;
  }

  /** Get the currently selected network name */
  async getNetworkName(page: Page): Promise<string | null> {
    const networkDisplay = page.getByTestId('network-display');
    return networkDisplay.textContent();
  }

  /** Get the account address */
  async getAccountAddress(page: Page): Promise<string> {
    const addressButton = page.getByTestId('account-options-menu-button');
    await addressButton.click();
    const address = await page
      .getByTestId('address-copy-button-text')
      .textContent();
    await page.keyboard.press('Escape');
    return address ?? '';
  }
}
