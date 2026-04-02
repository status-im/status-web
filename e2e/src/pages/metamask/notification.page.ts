import { NOTIFICATION_TIMEOUTS } from '@constants/timeouts.js'

import type { BrowserContext, Locator, Page } from '@playwright/test'

export class NotificationPage {
  private cachedHomePage: Page | null = null

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

  // MetaMask v13.18.1 uses different test IDs per confirmation type
  private confirmButton(page: Page): Locator {
    return page
      .getByTestId('page-container-footer-next')
      .or(page.getByTestId('confirmation-submit-button'))
      .or(page.getByTestId('confirm-footer-button'))
      .or(page.getByRole('button', { name: /^confirm$/i }))
  }

  private cancelButton(page: Page): Locator {
    return page
      .getByTestId('confirmation-cancel-button')
      .or(page.getByTestId('confirm-footer-cancel-button'))
      .or(page.getByRole('button', { name: /^cancel$/i }))
  }

  private async isSpendingCapConfirmation(page: Page): Promise<boolean> {
    return page
      .getByText(
        /spending cap|permission to withdraw|allow this site to spend/i,
      )
      .isVisible({ timeout: NOTIFICATION_TIMEOUTS.SHORT_SETTLE })
      .catch(() => false)
  }

  private async getOrCreateHomePage(): Promise<Page> {
    if (this.cachedHomePage && !this.cachedHomePage.isClosed()) {
      return this.cachedHomePage
    }

    const existing = this.context
      .pages()
      .find(p => this.isMetaMaskHome(p) && !p.isClosed())
    if (existing) {
      this.cachedHomePage = existing
      return existing
    }

    const page = await this.context.newPage()
    await page.goto(`chrome-extension://${this.extensionId}/home.html`, {
      waitUntil: 'load',
    })
    this.cachedHomePage = page
    return page
  }

  /**
   * Check MetaMask Activity for any "Unapproved" tx.
   * Used to verify approveTransaction() confirmed the right request,
   * not a stale one from the queue.
   */
  private async hasUnapprovedActivityEntry(): Promise<boolean> {
    const homePage = await this.getOrCreateHomePage()

    // Activity entries are only visible on the Activity tab, not default Tokens tab
    const activityTab = homePage
      .getByRole('tab', { name: /^activity$/i })
      .or(homePage.getByRole('button', { name: /^activity$/i }))
      .or(homePage.getByText(/^activity$/i))
    if (
      await activityTab
        .first()
        .isVisible({ timeout: NOTIFICATION_TIMEOUTS.CONTENT_CHECK })
        .catch(() => false)
    ) {
      await activityTab
        .first()
        .click()
        .catch(() => {})
      await homePage.waitForTimeout(NOTIFICATION_TIMEOUTS.DOM_SETTLE)
    }

    return homePage
      .getByText(/unapproved/i)
      .first()
      .isVisible({ timeout: NOTIFICATION_TIMEOUTS.CONTENT_CHECK })
      .catch(() => false)
  }

  private async dismissToastOverlays(page: Page): Promise<void> {
    const toast = page.getByTestId('storage-error-toast-banner-base')
    if (
      await toast
        .isVisible({ timeout: NOTIFICATION_TIMEOUTS.DOM_SETTLE })
        .catch(() => false)
    ) {
      const closeBtn = toast
        .locator('[aria-label="Close"]')
        .or(toast.getByRole('button', { name: /close|dismiss/i }))
        .or(toast.locator('button').first())
      await closeBtn.click().catch(() => {})
      await page.waitForTimeout(NOTIFICATION_TIMEOUTS.DOM_SETTLE)
    }
  }

  private async closeStaleNotificationPages(): Promise<void> {
    let closed = false
    for (const p of this.context.pages()) {
      if (this.isMetaMaskPopup(p) && !p.isClosed()) {
        await p.close()
        closed = true
      }
    }
    // Wait for service worker to release the messaging port
    if (closed) {
      await new Promise(resolve =>
        setTimeout(resolve, NOTIFICATION_TIMEOUTS.SHORT_SETTLE),
      )
    }
  }

  /**
   * Open notification.html and wait for MetaMask to push content.
   * We open ONCE and wait patiently — rapid reloads disconnect the MV3
   * messaging port, which MetaMask may interpret as user rejection.
   */
  private async waitForNotificationPage(
    contentTimeout: number = NOTIFICATION_TIMEOUTS.NOTIFICATION_CONTENT,
  ): Promise<Page> {
    for (const p of this.context.pages()) {
      if (this.isMetaMaskPopup(p) && !p.isClosed()) {
        const hasContent = await p
          .locator('button')
          .first()
          .isVisible({ timeout: NOTIFICATION_TIMEOUTS.CONTENT_CHECK })
          .catch(() => false)
        if (hasContent) return p
      }
    }

    const page = await this.context.newPage()
    await page.goto(
      `chrome-extension://${this.extensionId}/notification.html`,
      { waitUntil: 'load' },
    )

    // Can take 10-60s: gas estimation + Blockaid security checks
    const hasContent = await page
      .locator('button')
      .first()
      .isVisible({ timeout: contentTimeout })
      .catch(() => false)

    if (!hasContent) {
      if (!page.isClosed()) await page.close()
      await new Promise(resolve =>
        setTimeout(resolve, NOTIFICATION_TIMEOUTS.PAGE_REOPEN),
      )

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

  private async waitForConfirmablePopupPage(timeout: number): Promise<Page> {
    const deadline = Date.now() + timeout
    let openedFallbackPage = false

    while (Date.now() < deadline) {
      for (const p of this.context.pages()) {
        if (!this.isMetaMaskPopup(p) || p.isClosed()) continue
        const hasConfirm = await this.confirmButton(p)
          .isVisible({ timeout: NOTIFICATION_TIMEOUTS.DOM_SETTLE })
          .catch(() => false)
        if (hasConfirm) return p
      }

      if (!openedFallbackPage) {
        // Open notification.html so MetaMask can push queued confirmations.
        const fallback = await this.context.newPage()
        await fallback
          .goto(`chrome-extension://${this.extensionId}/notification.html`, {
            waitUntil: 'load',
          })
          .catch(() => {})
        openedFallbackPage = true
      }

      await new Promise(resolve =>
        setTimeout(resolve, NOTIFICATION_TIMEOUTS.POLL_INTERVAL),
      )
    }

    throw new Error('MetaMask transaction confirmation button did not appear')
  }

  async approveConnection(): Promise<void> {
    const t0 = Date.now()
    const log = (msg: string) =>
      console.log(`[approveConnection +${Date.now() - t0}ms] ${msg}`)

    let page = this.context
      .pages()
      .find(p => this.isMetaMaskPopup(p) && !p.isClosed())

    if (page) {
      log('reusing existing popup')
    } else {
      page = await this.context.newPage()
      await page.goto(
        `chrome-extension://${this.extensionId}/notification.html`,
        { waitUntil: 'load' },
      )
      log('opened notification.html')
    }

    const connectButton = page
      .getByRole('button', { name: /^connect$/i })
      .or(page.getByTestId('page-container-footer-next'))

    log('waiting for Connect button...')
    await connectButton.click({
      timeout: NOTIFICATION_TIMEOUTS.NOTIFICATION_CONTENT,
    })
    log('Connect clicked')
  }

  /** Approve a transaction (Confirm button) */
  async approveTransaction(
    contentTimeout: number = NOTIFICATION_TIMEOUTS.NOTIFICATION_CONTENT,
  ): Promise<void> {
    const t0 = Date.now()
    const log = (msg: string) =>
      console.log(`[approveTransaction +${Date.now() - t0}ms] ${msg}`)

    log('start')
    const deadline = Date.now() + contentTimeout
    let page: Page | null = null

    while (Date.now() < deadline) {
      const remaining = Math.max(
        NOTIFICATION_TIMEOUTS.PAGE_REOPEN,
        deadline - Date.now(),
      )
      page = await this.waitForConfirmablePopupPage(remaining)
      log('found confirmable page')
      page = await this.clearAddNetworkQueue(page, 10, deadline)

      // Skip stale spending-cap confirmation from approveTokenSpend() —
      // otherwise we "confirm" the wrong request and the deposit stays pending
      if (await this.isSpendingCapConfirmation(page)) {
        await page.waitForTimeout(NOTIFICATION_TIMEOUTS.SHORT_SETTLE)
        continue
      }

      const confirm = this.confirmButton(page)
      const hasConfirm = await confirm
        .isVisible({ timeout: NOTIFICATION_TIMEOUTS.CONTENT_CHECK })
        .catch(() => false)

      if (!hasConfirm) {
        await page.waitForTimeout(NOTIFICATION_TIMEOUTS.SHORT_SETTLE)
        continue
      }

      // Dismiss toast overlays that block clicks, then force-click — MetaMask
      // may re-render during gas estimation, detaching the DOM element
      await this.dismissToastOverlays(page)
      log('clicking Confirm...')
      try {
        await confirm.click({
          timeout: NOTIFICATION_TIMEOUTS.TRANSACTION_CONFIRM,
          force: true,
        })
        log('Confirm clicked')
      } catch (err) {
        const msg = err instanceof Error ? err.message : ''
        log(`Confirm click error: ${msg}`)
        if (!msg.includes('Timeout') && !msg.includes('detach')) throw err

        // Click may have succeeded despite error — check if button disappeared
        await page.waitForTimeout(NOTIFICATION_TIMEOUTS.SHORT_SETTLE)
        const stillVisible = await this.confirmButton(page)
          .isVisible({ timeout: NOTIFICATION_TIMEOUTS.PAGE_REOPEN })
          .catch(() => false)
        if (!stillVisible) {
          await page.waitForTimeout(NOTIFICATION_TIMEOUTS.PAGE_REOPEN)
          const confirmedAfterError = !(await this.hasUnapprovedActivityEntry())
          if (confirmedAfterError) {
            if (!page.isClosed()) await page.close()
            return
          }
        }
        continue
      }
      if (page.isClosed()) return

      await page.waitForTimeout(NOTIFICATION_TIMEOUTS.POST_CLICK)

      if (page.isClosed()) return

      // MetaMask v13 two-step flow: Next → Confirm
      const secondConfirm = this.confirmButton(page)
      if (
        await secondConfirm
          .isVisible({ timeout: NOTIFICATION_TIMEOUTS.ELEMENT_VISIBLE })
          .catch(() => false)
      ) {
        try {
          await secondConfirm.click({
            timeout: NOTIFICATION_TIMEOUTS.TRANSACTION_CONFIRM,
            force: true,
          })
        } catch (err) {
          const msg = err instanceof Error ? err.message : ''
          if (!msg.includes('Timeout') && !msg.includes('detach')) throw err
        }
        if (!page.isClosed())
          await page.waitForTimeout(NOTIFICATION_TIMEOUTS.PAGE_REOPEN)
      }

      if (page.isClosed()) return

      // Let service worker dispatch the tx before closing
      await page.waitForTimeout(NOTIFICATION_TIMEOUTS.CONTENT_CHECK)
      const stillUnapproved = await this.hasUnapprovedActivityEntry()
      if (stillUnapproved) {
        if (!page.isClosed()) await page.close()
        await new Promise(resolve =>
          setTimeout(resolve, NOTIFICATION_TIMEOUTS.SHORT_SETTLE),
        )
        continue
      }

      if (!page.isClosed()) await page.close()
      log('done')
      return
    }

    log('TIMEOUT — confirm button never appeared')
    if (page && !page.isClosed()) await page.close().catch(() => {})
    throw new Error('MetaMask transaction confirmation button did not appear')
  }

  async rejectTransaction(): Promise<void> {
    const page = await this.waitForNotificationPage()

    const cancelButton = page.getByRole('button', {
      name: /reject|cancel/i,
    })
    await cancelButton.click()
  }

  async approveNetworkSwitch(): Promise<void> {
    const page = await this.waitForNotificationPage()

    const approveButton = page.getByRole('button', {
      name: /^(approve|confirm|switch network)$/i,
    })
    await approveButton.click({
      timeout: NOTIFICATION_TIMEOUTS.BUTTON_TRANSITION,
    })
  }

  /**
   * Dismiss pending "Add network" requests. Uses "Reject all" when multiple
   * are queued (only safe before any transaction is pending).
   */
  async dismissPendingAddNetwork(): Promise<void> {
    const t0 = Date.now()
    const log = (msg: string) =>
      console.log(`[dismissAddNetwork +${Date.now() - t0}ms] ${msg}`)

    log('start')
    const page = await this.waitForNotificationPage(
      NOTIFICATION_TIMEOUTS.ELEMENT_VISIBLE,
    )
    log('notification page ready')

    const rejectAll = page
      .getByTestId('confirm_nav__reject_all')
      .or(page.getByText(/reject all/i))
    if (
      await rejectAll
        .isVisible({ timeout: NOTIFICATION_TIMEOUTS.BUTTON_TRANSITION })
        .catch(() => false)
    ) {
      log('found rejectAll — clicking')
      await rejectAll.click()
      await page.waitForLoadState('load').catch(() => {})
      if (!page.isClosed()) await page.close()
      log('done (rejectAll)')
      return
    }
    log('no rejectAll')

    const cancel = this.cancelButton(page)
    const hasPending = await cancel
      .isVisible({ timeout: NOTIFICATION_TIMEOUTS.BUTTON_TRANSITION })
      .catch(() => false)

    if (!hasPending) {
      log('no pending — closing')
      if (!page.isClosed()) await page.close()
      log('done (no pending)')
      return
    }

    log('found cancel — clicking')
    await cancel.click()
    // await confirmButton.click()

    // Wait for MetaMask to finish processing, then close the page.
    await page.waitForLoadState('load').catch(() => {})
    if (!page.isClosed()) await page.close()
  }

  /**
   * Skip past any "Add network" popups in MetaMask's confirmation queue.
   * Uses ">" (next) button to navigate past them without canceling — canceling
   * triggers DOM re-renders that detach buttons mid-click.
   */
  private async clearAddNetworkQueue(
    page: Page,
    maxAttempts = 10,
    deadline = Date.now() + 60_000,
  ): Promise<Page> {
    const currentPage = page
    for (let i = 0; i < maxAttempts && Date.now() < deadline; i++) {
      const anyButton = currentPage.locator('button')
      const rendered = await anyButton
        .first()
        .isVisible({ timeout: NOTIFICATION_TIMEOUTS.BUTTON_TRANSITION })
        .catch(() => false)

      if (!rendered) return currentPage

      const isAddNetwork = await currentPage
        .getByText(/suggesting additional network/i)
        .isVisible({ timeout: NOTIFICATION_TIMEOUTS.CONTENT_CHECK })
        .catch(() => false)

      if (!isAddNetwork) return currentPage

      const nextBtn = currentPage
        .getByTestId('confirm-nav__next-confirmation')
        .or(currentPage.getByTestId('confirm_nav__right_btn'))
      const hasNext = await nextBtn
        .isVisible({ timeout: NOTIFICATION_TIMEOUTS.PAGE_REOPEN })
        .catch(() => false)

      if (hasNext) {
        await nextBtn.click().catch(() => {})
        await currentPage.waitForTimeout(NOTIFICATION_TIMEOUTS.SHORT_SETTLE)
        continue
      }

      // Last/only Add Network request — cancel it.
      // Do NOT reload after: MetaMask auto-shows the next queued request,
      // and a reload disconnects the port causing auto-reject of ALL pending requests.
      const cancel = this.cancelButton(currentPage)
      try {
        await cancel.click({ timeout: NOTIFICATION_TIMEOUTS.ELEMENT_VISIBLE })
      } catch {
        await currentPage.waitForTimeout(NOTIFICATION_TIMEOUTS.SHORT_SETTLE)
        continue
      }
      await currentPage.waitForTimeout(NOTIFICATION_TIMEOUTS.CONTENT_CHECK)
    }
    return currentPage
  }

  /**
   * Approve a token spending allowance.
   * Uses waitForNotificationPage (which has close+reopen fallback) —
   * this is safe here because no transaction is pending yet at this point.
   */
  async approveTokenSpend(): Promise<void> {
    const t0 = Date.now()
    const log = (msg: string) =>
      console.log(`[approveTokenSpend +${Date.now() - t0}ms] ${msg}`)

    log('start')
    await this.closeStaleNotificationPages()

    let page = await this.waitForNotificationPage()
    log('notification page ready')
    page = await this.clearAddNetworkQueue(page)

    // Wait for spending-cap text before clicking Confirm — the button appears
    // before approval details are ready, and early clicks are silently ignored
    const spendingCapText = page.getByText(
      /spending cap|permission to withdraw/i,
    )
    const contentVisible = await spendingCapText
      .isVisible({ timeout: NOTIFICATION_TIMEOUTS.ELEMENT_VISIBLE })
      .catch(() => false)

    if (!contentVisible) {
      if (!page.isClosed()) await page.close()
      await new Promise(resolve =>
        setTimeout(resolve, NOTIFICATION_TIMEOUTS.PAGE_REOPEN),
      )

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

    await this.dismissToastOverlays(page)
    log('clicking Confirm...')
    await this.confirmButton(page).click({
      timeout: NOTIFICATION_TIMEOUTS.NOTIFICATION_CONTENT,
      force: true,
    })
    log('Confirm clicked')

    // MetaMask v13 may use 2-step approval: Next → Approve.
    // On Anvil the approval confirms instantly and the Hub immediately fires
    // the deposit tx, so a second Confirm may belong to the DEPOSIT, not
    // a second approval step. Only click if still on the spending-cap page.
    await page.waitForTimeout(NOTIFICATION_TIMEOUTS.CONTENT_CHECK)
    const secondConfirm = this.confirmButton(page)
    if (
      await secondConfirm
        .isVisible({ timeout: NOTIFICATION_TIMEOUTS.ELEMENT_VISIBLE })
        .catch(() => false)
    ) {
      if (await this.isSpendingCapConfirmation(page)) {
        await this.dismissToastOverlays(page)
        await secondConfirm.click({
          timeout: NOTIFICATION_TIMEOUTS.NOTIFICATION_CONTENT,
          force: true,
        })
      }
    }

    // Do NOT close — the Hub fires the deposit tx immediately after approval.
    // Closing disconnects the messaging port → service worker auto-rejects
    // any tx arriving during reconnection. approveTransaction() reuses this page.
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
