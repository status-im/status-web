import type { BrowserContext, Page } from '@playwright/test';
import { OnboardingPage } from './onboarding.page.js';
import { NotificationPage } from './notification.page.js';
import { MetaMaskHomePage } from './home.page.js';

export class MetaMaskPage {
  readonly onboarding: OnboardingPage;
  readonly notification: NotificationPage;
  readonly home: MetaMaskHomePage;

  private readonly extensionPrefix: string;

  constructor(
    private readonly context: BrowserContext,
    extensionId: string,
  ) {
    this.extensionPrefix = `chrome-extension://${extensionId}`;
    this.onboarding = new OnboardingPage(context, extensionId);
    this.notification = new NotificationPage(context, extensionId);
    this.home = new MetaMaskHomePage(context, extensionId);
  }

  /** Find the MetaMask extension page in the current context */
  async getExtensionPage(): Promise<Page> {
    let mmPage = this.context
      .pages()
      .find(p => p.url().startsWith(this.extensionPrefix));

    if (!mmPage) {
      mmPage = await this.context.waitForEvent('page', {
        timeout: 10_000,
        predicate: p => p.url().startsWith(this.extensionPrefix),
      });
    }

    return mmPage;
  }

  /**
   * Connect MetaMask to a dApp page.
   * 1. Clicks "Connect wallet" on the hub page
   * 2. Selects MetaMask from ConnectKit dialog
   * 3. Approves the connection in the MetaMask notification popup
   */
  async connectToDApp(hubPage: Page): Promise<void> {
    const connectButton = hubPage
      .getByRole('button', { name: /connect/i })
      .first();
    await connectButton.click();

    await hubPage.getByRole('button', { name: 'MetaMask' }).click();

    await this.notification.approveConnection();
  }

  /** Approve a transaction in the MetaMask notification popup */
  async approveTransaction(): Promise<void> {
    await this.notification.approveTransaction();
  }

  /** Reject a transaction in the MetaMask notification popup */
  async rejectTransaction(): Promise<void> {
    await this.notification.rejectTransaction();
  }

  /** Approve adding/switching to a new network */
  async switchNetwork(): Promise<void> {
    await this.notification.approveNetworkSwitch();
  }

  /** Approve a token spending allowance */
  async approveTokenSpend(): Promise<void> {
    await this.notification.approveTokenSpend();
  }

  /** Sign a message (SIWE or EIP-712) */
  async signMessage(): Promise<void> {
    await this.notification.signMessage();
  }
}
