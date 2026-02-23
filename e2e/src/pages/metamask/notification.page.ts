import { NOTIFICATION_TIMEOUTS } from '@constants/timeouts.js'

import type { BrowserContext, Locator, Page } from '@playwright/test'

export class NotificationPage {
  constructor(
    private readonly context: BrowserContext,
    private readonly extensionId: string,
  ) {}

  private isMetaMaskPopup(page: Page): boolean {
    try {
      const parsed = new URL(page.url())
      return (
        parsed.protocol === 'chrome-extension:' &&
        parsed.host === this.extensionId &&
        (parsed.pathname.includes('notification.html') ||
          parsed.pathname.includes('popup.html'))
      )
    } catch {
      return false
    }
  }

  private isMetaMaskHome(page: Page): boolean {
    try {
      const parsed = new URL(page.url())
      return (
        parsed.protocol === 'chrome-extension:' &&
        parsed.host === this.extensionId &&
        parsed.pathname.includes('home.html')
      )
    } catch {
      return false
    }
  }

  /** Find an already-open notification/popup page without waiting for content. */
  private findOpenNotificationPage(): Page | null {
    for (const p of this.context.pages()) {
      if (this.isMetaMaskPopup(p) && !p.isClosed()) {
        return p
      }
    }
    return null
  }

  /**
   * Build a locator that matches any MetaMask v13 confirmation submit button.
   * MetaMask v13.18.1 uses multiple test IDs depending on the confirmation type:
   * - Legacy: page-container-footer-next
   * - Modern: confirmation-submit-button
   * - Alternate: confirm-footer-button
   */
  private confirmButton(page: Page): Locator {
    return page
      .getByTestId('page-container-footer-next')
      .or(page.getByTestId('confirmation-submit-button'))
      .or(page.getByTestId('confirm-footer-button'))
      .or(page.getByRole('button', { name: /^confirm$/i }))
  }

  /**
   * Build a locator that matches any MetaMask v13 cancel/reject button.
   */
  private cancelButton(page: Page): Locator {
    return page
      .getByTestId('confirmation-cancel-button')
      .or(page.getByTestId('confirm-footer-cancel-button'))
      .or(page.getByRole('button', { name: /^cancel$/i }))
  }

  /** Token allowance approvals contain "spending cap" phrasing in MetaMask UI. */
  private async isSpendingCapConfirmation(page: Page): Promise<boolean> {
    return page
      .getByText(/spending cap|permission to withdraw|allow this site to spend/i)
      .isVisible({ timeout: 500 })
      .catch(() => false)
  }

  /**
   * Check if MetaMask Activity still contains any "Unapproved" tx.
   * Used to ensure approveTransaction() doesn't return after confirming
   * the wrong request while the target tx remains pending user approval.
   */
  private async hasUnapprovedActivityEntry(): Promise<boolean> {
    let homePage = this.context
      .pages()
      .find(p => this.isMetaMaskHome(p) && !p.isClosed())
    const openedTemporarily = !homePage

    if (!homePage) {
      homePage = await this.context.newPage()
      await homePage.goto(
        `chrome-extension://${this.extensionId}/home.html`,
        { waitUntil: 'load' },
      )
    }

    // Activity entries are not visible on the default Tokens tab.
    const activityTab = homePage
      .getByRole('tab', { name: /^activity$/i })
      .or(homePage.getByRole('button', { name: /^activity$/i }))
      .or(homePage.getByText(/^activity$/i))
    if (
      await activityTab
        .first()
        .isVisible({ timeout: 2_000 })
        .catch(() => false)
    ) {
      await activityTab.first().click().catch(() => {})
      await homePage.waitForTimeout(300)
    }

    const hasUnapproved = await homePage
      .getByText(/unapproved/i)
      .first()
      .isVisible({ timeout: 2_000 })
      .catch(() => false)

    if (openedTemporarily && !homePage.isClosed()) {
      await homePage.close().catch(() => {})
    }

    return hasUnapproved
  }

  /**
   * Close any existing MetaMask notification/popup pages.
   * Used between sequential MetaMask interactions (e.g. approve → deposit)
   * to ensure a fresh messaging port connection for the next action.
   */
  private async closeStaleNotificationPages(): Promise<void> {
    let closed = false
    for (const p of this.context.pages()) {
      if (this.isMetaMaskPopup(p) && !p.isClosed()) {
        await p.close()
        closed = true
      }
    }
    // Allow MetaMask's service worker to fully release the messaging port
    // before opening a new notification page. Without this delay, the new
    // page may connect to a stale port and never receive content.
    if (closed) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  /**
   * Get the MetaMask notification page.
   * Checks for an already-open notification page first,
   * then manually opens notification.html.
   *
   * MetaMask does not auto-open popups in automated (Playwright) contexts,
   * so we always open notification.html directly.
   *
   * IMPORTANT: We open notification.html ONCE and wait patiently for content.
   * MetaMask v13 (MV3) uses messaging ports between notification.html and
   * the service worker. Rapid page reloads disconnect these ports, which
   * MetaMask may interpret as user rejection of pending confirmations.
   * Instead, we keep the page open — MetaMask dynamically pushes pending
   * requests to connected notification pages when processing completes
   * (gas estimation, fee calculation, Blockaid security simulation).
   */
  private async waitForNotificationPage(
    contentTimeout = NOTIFICATION_TIMEOUTS.NOTIFICATION_CONTENT,
  ): Promise<Page> {
    // Check if there's already an open notification page with content
    for (const p of this.context.pages()) {
      if (this.isMetaMaskPopup(p) && !p.isClosed()) {
        const hasContent = await p
          .locator('button')
          .first()
          .isVisible({ timeout: 2_000 })
          .catch(() => false)
        if (hasContent) return p
      }
    }

    const page = await this.context.newPage()
    await page.goto(
      `chrome-extension://${this.extensionId}/notification.html`,
      { waitUntil: 'load' },
    )

    // Wait for any button to appear — MetaMask will push content when ready.
    // This can take 10-60s due to gas estimation + Blockaid security checks.
    const hasContent = await page
      .locator('button')
      .first()
      .isVisible({ timeout: contentTimeout })
      .catch(() => false)

    if (!hasContent) {
      // Close and reopen with a fresh page instead of reloading.
      // A reload keeps the same messaging port which may be stale after
      // a previous notification page was closed. A new page establishes
      // a fresh port connection to MetaMask's service worker.
      if (!page.isClosed()) await page.close()
      await new Promise(resolve => setTimeout(resolve, 1_000))

      const freshPage = await this.context.newPage()
      await freshPage.goto(
        `chrome-extension://${this.extensionId}/notification.html`,
        { waitUntil: 'load' },
      )
      await freshPage
        .locator('button')
        .first()
        .isVisible({ timeout: contentTimeout })
        .catch(() => false)
      return freshPage
    }

    return page
  }

  /**
   * Find the popup page that actually contains a transaction confirmation
   * action. This avoids selecting unrelated popup.html pages (e.g. onboarding).
   */
  private async waitForConfirmablePopupPage(timeout: number): Promise<Page> {
    const deadline = Date.now() + timeout
    let openedFallbackPage = false

    while (Date.now() < deadline) {
      for (const p of this.context.pages()) {
        if (!this.isMetaMaskPopup(p) || p.isClosed()) continue
        const hasConfirm = await this.confirmButton(p)
          .isVisible({ timeout: 300 })
          .catch(() => false)
        if (hasConfirm) return p
      }

      if (!openedFallbackPage) {
        // Keep one notification page connected so MetaMask can push queued
        // confirmations even when no popup is auto-opened in automation.
        await this.waitForNotificationPage(timeout).catch(() => {})
        openedFallbackPage = true
      }

      await new Promise(resolve => setTimeout(resolve, 250))
    }

    throw new Error('MetaMask transaction confirmation button did not appear')
  }

  /** Approve a dApp connection request */
  async approveConnection(): Promise<void> {
    const page = await this.waitForNotificationPage()

    const connectButton = page
      .getByRole('button', { name: /^connect$/i })
      .or(page.getByTestId('page-container-footer-next'))

    await connectButton.click({
      timeout: NOTIFICATION_TIMEOUTS.TRANSACTION_CONFIRM,
    })
  }

  /** Approve a transaction (Confirm button) */
  async approveTransaction(
    contentTimeout = NOTIFICATION_TIMEOUTS.NOTIFICATION_CONTENT,
  ): Promise<void> {
    const deadline = Date.now() + contentTimeout
    let page: Page | null = null

    while (Date.now() < deadline) {
      const remaining = Math.max(1_000, deadline - Date.now())
      page = await this.waitForConfirmablePopupPage(remaining)
      page = await this.clearAddNetworkQueue(page)

      // We may still be on the previous token-allowance confirmation from
      // approveTokenSpend(). Skip it and wait for the actual follow-up tx
      // (e.g. deposit), otherwise we can "confirm" the wrong request and exit
      // while the deposit remains unapproved.
      if (await this.isSpendingCapConfirmation(page)) {
        await page.waitForTimeout(500)
        continue
      }

      const confirm = this.confirmButton(page)
      const hasConfirm = await confirm
        .isVisible({ timeout: 2_000 })
        .catch(() => false)

      // Queue may still be transitioning (e.g. canceled Add Network just now).
      // Keep waiting instead of returning early without approving anything.
      if (!hasConfirm) {
        await page.waitForTimeout(500)
        continue
      }

      await confirm.click({ timeout: NOTIFICATION_TIMEOUTS.TRANSACTION_CONFIRM })
      await page.waitForTimeout(1_200)

      // MetaMask v13 can use a two-step flow: Next -> Confirm.
      const secondConfirm = this.confirmButton(page)
      if (
        await secondConfirm
          .isVisible({ timeout: 5_000 })
          .catch(() => false)
      ) {
        await secondConfirm.click({
          timeout: NOTIFICATION_TIMEOUTS.TRANSACTION_CONFIRM,
        })
        await page.waitForTimeout(1_000)
      }

      // Let MetaMask service worker dispatch tx before closing the page.
      await page.waitForTimeout(2_000)
      const stillUnapproved = await this.hasUnapprovedActivityEntry()
      if (stillUnapproved) {
        if (!page.isClosed()) await page.close()
        await new Promise(resolve => setTimeout(resolve, 500))
        continue
      }

      if (!page.isClosed()) await page.close()
      return
    }

    if (page && !page.isClosed()) await page.close().catch(() => {})
    throw new Error('MetaMask transaction confirmation button did not appear')
  }

  /** Reject a transaction (Cancel button) */
  async rejectTransaction(): Promise<void> {
    const page = await this.waitForNotificationPage()

    const cancelButton = page.getByRole('button', {
      name: /reject|cancel/i,
    })
    await cancelButton.click()
  }

  /** Approve adding/switching to a new network */
  async approveNetworkSwitch(): Promise<void> {
    const page = await this.waitForNotificationPage()

    const confirm = this.confirmButton(page)
    await confirm.click({ timeout: NOTIFICATION_TIMEOUTS.BUTTON_TRANSITION })
  }

  /**
   * Dismiss a pending "Add network" request queued by the hub on page load.
   * CANCELS the request so MetaMask does NOT switch away from the current chain.
   * Safe to call when there are no pending requests (returns early).
   *
   * Uses "Reject all" when multiple requests are pending (faster + atomic).
   */
  async dismissPendingAddNetwork(): Promise<void> {
    const page = await this.waitForNotificationPage()

    // Try "Reject all" first — clears all pending Add Network requests at once.
    // Only safe when called before any transaction is pending.
    const rejectAll = page
      .getByTestId('confirm_nav__reject_all')
      .or(page.getByText(/reject all/i))
    if (
      await rejectAll
        .isVisible({ timeout: NOTIFICATION_TIMEOUTS.BUTTON_TRANSITION })
        .catch(() => false)
    ) {
      await rejectAll.click()
      await page.waitForLoadState('load').catch(() => {})
      if (!page.isClosed()) await page.close()
      return
    }

    // Fall back to Cancel button for single requests
    const cancel = this.cancelButton(page)
    const hasPending = await cancel
      .isVisible({ timeout: NOTIFICATION_TIMEOUTS.BUTTON_TRANSITION })
      .catch(() => false)

    if (!hasPending) {
      if (!page.isClosed()) await page.close()
      return
    }

    await cancel.click()

    await page.waitForLoadState('load').catch(() => {})
    if (!page.isClosed()) await page.close()
  }

  /**
   * Clear any "Add network" popups that are queued ahead of the expected action.
   * The Hub may send wallet_addEthereumChain requests at any time; these show up
   * in MetaMask's notification queue ahead of transaction requests.
   *
   * Strategy: navigate PAST Add Network pages using MetaMask's ">" (next)
   * button to reach the transaction confirmation. This avoids canceling
   * requests (which can cause DOM detachment when MetaMask re-renders)
   * and preserves the pending transaction in the queue.
   *
   * Falls back to Cancel clicks when there's no Next button (single request).
   */
  private async clearAddNetworkQueue(
    page: Page,
    maxAttempts = 10,
  ): Promise<Page> {
    let currentPage = page
    for (let i = 0; i < maxAttempts; i++) {
      // Wait for any actionable content to render
      const anyButton = currentPage.locator('button')
      const rendered = await anyButton
        .first()
        .isVisible({ timeout: NOTIFICATION_TIMEOUTS.BUTTON_TRANSITION })
        .catch(() => false)

      if (!rendered) return currentPage // Nothing rendered — bail

      // Detect "Add Network" page by text content.
      // MetaMask shows "A site is suggesting additional network details."
      const isAddNetwork = await currentPage
        .getByText(/suggesting additional network/i)
        .isVisible({ timeout: 2_000 })
        .catch(() => false)

      if (!isAddNetwork) return currentPage // Found the transaction — done

      // Try to navigate to the NEXT confirmation in the queue.
      // This skips past Add Network pages without canceling them,
      // avoiding DOM re-renders that detach buttons.
      const nextBtn = currentPage
        .getByTestId('confirm-nav__next-confirmation')
        .or(currentPage.getByTestId('confirm_nav__right_btn'))
      const hasNext = await nextBtn
        .isVisible({ timeout: 1_000 })
        .catch(() => false)

      if (hasNext) {
        await nextBtn.click().catch(() => {})
        await currentPage.waitForTimeout(500)
        continue
      }

      // No Next button — this is the only request or the last one.
      // Cancel it so the queue can progress to the pending tx.
      // IMPORTANT: Do NOT reload the page after Cancel. MetaMask automatically
      // shows the next pending request on the same page. Reloading disconnects
      // the messaging port, which causes MetaMask to auto-reject ALL remaining
      // pending requests (including the deposit tx we want to approve).
      const cancel = this.cancelButton(currentPage)
      try {
        await cancel.click({ timeout: 5_000 })
      } catch {
        // Button detached from DOM — MetaMask re-rendered. Retry.
        await currentPage.waitForTimeout(500)
        continue
      }
      // Wait for MetaMask to process and show the next queued request
      await currentPage.waitForTimeout(2_000)
    }
    return currentPage
  }

  /** Approve a token spending allowance */
  async approveTokenSpend(): Promise<void> {
    // Clean up stale notification pages from previous actions (e.g. wrap tx).
    // Without this, the service worker's messaging port may still reference
    // the old page, preventing content from reaching the new one.
    await this.closeStaleNotificationPages()

    let page = await this.waitForNotificationPage()
    page = await this.clearAddNetworkQueue(page)

    // Wait for the approval content to fully render before clicking Confirm.
    // MetaMask loads gas estimation + Blockaid security checks asynchronously.
    // The Confirm button may appear before the approval details are ready —
    // clicking too early can be silently ignored by MetaMask.
    const spendingCapText = page.getByText(
      /spending cap|permission to withdraw/i,
    )
    const contentVisible = await spendingCapText
      .isVisible({ timeout: 5_000 })
      .catch(() => false)

    if (!contentVisible) {
      // Close and reopen with a fresh page — the messaging port may be stale
      // from a previous notification page (e.g. after wrap tx approval).
      if (!page.isClosed()) await page.close()
      await new Promise(resolve => setTimeout(resolve, 1_000))

      page = await this.context.newPage()
      await page.goto(
        `chrome-extension://${this.extensionId}/notification.html`,
        { waitUntil: 'load' },
      )
      await page
        .locator('button')
        .first()
        .isVisible({ timeout: NOTIFICATION_TIMEOUTS.NOTIFICATION_CONTENT })
        .catch(() => false)
      page = await this.clearAddNetworkQueue(page)

      // Wait for spending cap text to confirm we're on the approval page
      const freshSpendingCapText = page.getByText(
        /spending cap|permission to withdraw/i,
      )
      await freshSpendingCapText
        .waitFor({
          state: 'visible',
          timeout: NOTIFICATION_TIMEOUTS.NOTIFICATION_CONTENT,
        })
        .catch(() => {})
    }

    // There may be a "Use default" or custom amount step
    const useDefaultButton = page.getByRole('button', {
      name: /use default/i,
    })
    if (
      await useDefaultButton
        .isVisible({ timeout: NOTIFICATION_TIMEOUTS.OPTIONAL_ELEMENT })
        .catch(() => false)
    ) {
      await useDefaultButton.click()
    }

    await this.confirmButton(page).click({
      timeout: NOTIFICATION_TIMEOUTS.TRANSACTION_CONFIRM,
    })

    // MetaMask v13 may have a 2-step approval flow:
    //   Step 1: spending cap review → "Next" (matched by page-container-footer-next)
    //   Step 2: transaction review  → "Approve"/"Confirm" (submits the tx)
    // If the first click was "Next", we need to click the actual submit button.
    // If it was already the final "Approve" (1-step flow), the page transitions
    // to "submitted" state with no second Confirm — the wait simply times out.
    await page.waitForTimeout(2_000)
    const secondConfirm = this.confirmButton(page)
    if (
      await secondConfirm
        .isVisible({ timeout: 5_000 })
        .catch(() => false)
    ) {
      await secondConfirm.click({
        timeout: NOTIFICATION_TIMEOUTS.TRANSACTION_CONFIRM,
      })
    }

    // Do NOT close the page. The Hub fires the deposit tx immediately after
    // the approval is confirmed on-chain (in onSuccess callback). Closing
    // the page disconnects MetaMask's messaging port, causing the service
    // worker to auto-reject any tx that arrives during reconnection.
    // approveTransaction() will reuse this open page for the deposit tx —
    // MetaMask automatically pushes the next queued request to connected pages.
  }

  /** Sign a message (SIWE or EIP-712) */
  async signMessage(): Promise<void> {
    const page = await this.waitForNotificationPage()

    const signButton = this.confirmButton(page).or(
      page.getByRole('button', { name: /sign/i }),
    )
    await signButton.click()
  }
}
