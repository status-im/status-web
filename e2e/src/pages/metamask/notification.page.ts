import type { BrowserContext, Page } from '@playwright/test';
import { NOTIFICATION_TIMEOUTS } from '@constants/timeouts.js';

export class NotificationPage {
  constructor(
    private readonly context: BrowserContext,
    private readonly extensionId: string,
  ) {}

  private isMetaMaskPopup(page: Page): boolean {
    try {
      const parsed = new URL(page.url());
      return (
        parsed.protocol === 'chrome-extension:' &&
        parsed.host === this.extensionId &&
        (parsed.pathname.includes('notification.html') ||
          parsed.pathname.includes('popup.html'))
      );
    } catch {
      return false;
    }
  }

  /**
   * Get the MetaMask notification page.
   * Checks for an already-open notification page first,
   * then manually opens notification.html.
   *
   * MetaMask does not auto-open popups in automated (Playwright) contexts,
   * so we always open notification.html directly.
   */
  private async waitForNotificationPage(): Promise<Page> {
    // Check if already open
    const existing = this.context
      .pages()
      .find(p => this.isMetaMaskPopup(p));

    if (existing) {
      await existing.waitForLoadState('domcontentloaded');
      return existing;
    }

    // Open notification.html directly
    const page = await this.context.newPage();
    await page.goto(
      `chrome-extension://${this.extensionId}/notification.html`,
      { waitUntil: 'domcontentloaded' },
    );
    return page;
  }

  /** Approve a dApp connection request */
  async approveConnection(): Promise<void> {
    const page = await this.waitForNotificationPage();

    const connectButton = page.getByRole('button', { name: /^connect$/i });
    await connectButton.click({ timeout: NOTIFICATION_TIMEOUTS.BUTTON_TRANSITION });
  }

  /** Approve a transaction (Confirm button) */
  async approveTransaction(): Promise<void> {
    const page = await this.waitForNotificationPage();

    const confirmButton = page
      .getByTestId('page-container-footer-next')
      .or(page.getByRole('button', { name: /confirm/i }));
    await confirmButton.click({ timeout: NOTIFICATION_TIMEOUTS.TRANSACTION_CONFIRM });
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

    const actionButton = page.getByRole('button', {
      name: /^(approve|confirm|switch network)$/i,
    });
    await actionButton.click({ timeout: NOTIFICATION_TIMEOUTS.BUTTON_TRANSITION });
  }

  /**
   * Dismiss a pending "Add network" request queued by the hub on page load.
   * Approves the request so the network is added and MetaMask switches to it.
   * Safe to call when there are no pending requests (returns early).
   */
  async dismissPendingAddNetwork(): Promise<void> {
    // Reuse an existing notification page if MetaMask kept one open
    // after the connection step (MetaMask reuses it for the next pending request).
    const page = await this.waitForNotificationPage();

    // MetaMask notification.html is a React SPA — buttons render after JS hydration.
    // Wait for the hub's wallet_addEthereumChain request to arrive and render.
    const confirmButton = page.getByRole('button', { name: /^confirm$/i });
    const hasPending = await confirmButton
      .isVisible({ timeout: NOTIFICATION_TIMEOUTS.BUTTON_TRANSITION })
      .catch(() => false);

    if (!hasPending) {
      if (!page.isClosed()) await page.close();
      return;
    }

    await confirmButton.click();

    // Wait for MetaMask to finish processing, then close the page.
    // MetaMask adds the network without auto-switching in this version.
    await page.waitForLoadState('load').catch(() => {});
    if (!page.isClosed()) await page.close();
  }

  /** Approve a token spending allowance */
  async approveTokenSpend(): Promise<void> {
    const page = await this.waitForNotificationPage();

    // There may be a "Use default" or custom amount step
    const useDefaultButton = page.getByRole('button', {
      name: /use default/i,
    });
    if (
      await useDefaultButton.isVisible({ timeout: NOTIFICATION_TIMEOUTS.OPTIONAL_ELEMENT }).catch(() => false)
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