import type { BrowserContext, Page } from '@playwright/test';

export class NotificationPage {
  constructor(
    private readonly context: BrowserContext,
    private readonly extensionId: string,
  ) {}

  private isNotificationPage(page: Page): boolean {
    try {
      const parsed = new URL(page.url());
      return (
        parsed.protocol === 'chrome-extension:' &&
        parsed.host === this.extensionId &&
        parsed.pathname.includes('notification.html')
      );
    } catch {
      return false;
    }
  }

  /** Wait for the MetaMask notification popup to appear and return its page */
  private async waitForNotificationPage(): Promise<Page> {
    let notifPage = this.context
      .pages()
      .find(p => this.isNotificationPage(p));

    if (!notifPage) {
      notifPage = await this.context.waitForEvent('page', {
        timeout: 30_000,
        predicate: p => this.isNotificationPage(p),
      });
    }

    await notifPage.waitForLoadState('domcontentloaded');
    return notifPage;
  }

  /** Approve a dApp connection request */
  async approveConnection(): Promise<void> {
    const page = await this.waitForNotificationPage();

    // MetaMask connection approval may have multiple steps
    const nextButton = page.getByTestId('page-container-footer-next');
    if (
      await nextButton.isVisible({ timeout: 5000 }).catch(() => false)
    ) {
      await nextButton.click();
      // Wait for the button to become disabled (transition started)…
      await page.waitForFunction(
        () => {
          const btn = document.querySelector(
            '[data-testid="page-container-footer-next"]',
          ) as HTMLButtonElement | null;
          return (
            !btn ||
            btn.disabled ||
            btn.getAttribute('aria-disabled') === 'true'
          );
        },
        { timeout: 10_000 },
      );
      // …then wait for it to be ready again (next step loaded)
      await page.waitForFunction(
        () => {
          const btn = document.querySelector(
            '[data-testid="page-container-footer-next"]',
          ) as HTMLButtonElement | null;
          return (
            btn && !btn.disabled && btn.getAttribute('aria-disabled') !== 'true'
          );
        },
        { timeout: 10_000 },
      );
    }

    const confirmButton = page.getByTestId('page-container-footer-next');
    await confirmButton.click();
  }

  /** Approve a transaction (Confirm button) */
  async approveTransaction(): Promise<void> {
    const page = await this.waitForNotificationPage();

    const confirmButton = page
      .getByTestId('page-container-footer-next')
      .or(page.getByRole('button', { name: /confirm/i }));
    await confirmButton.click({ timeout: 15_000 });
  }

  /** Reject a transaction (Cancel button) */
  async rejectTransaction(): Promise<void> {
    const page = await this.waitForNotificationPage();

    const cancelButton = page.getByRole('button', {
      name: /reject|cancel/i,
    });
    await cancelButton.click();
  }

  /** Approve adding/switching to a new network */
  async approveNetworkSwitch(): Promise<void> {
    const page = await this.waitForNotificationPage();

    const approveButton = page.getByRole('button', {
      name: /approve|switch network/i,
    });
    await approveButton.click();
  }

  /** Approve a token spending allowance */
  async approveTokenSpend(): Promise<void> {
    const page = await this.waitForNotificationPage();

    // There may be a "Use default" or custom amount step
    const useDefaultButton = page.getByRole('button', {
      name: /use default/i,
    });
    if (
      await useDefaultButton.isVisible({ timeout: 3000 }).catch(() => false)
    ) {
      await useDefaultButton.click();
    }

    const nextButton = page.getByTestId('page-container-footer-next');
    await nextButton.click();
  }

  /** Sign a message (SIWE or EIP-712) */
  async signMessage(): Promise<void> {
    const page = await this.waitForNotificationPage();

    const signButton = page
      .getByTestId('page-container-footer-next')
      .or(page.getByRole('button', { name: /sign/i }));
    await signButton.click();
  }
}
