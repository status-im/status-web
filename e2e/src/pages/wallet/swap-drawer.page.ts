import { expect } from '@playwright/test'

import { BasePage } from '../base.page.js'

/**
 * Exchange drawer (apps/wallet exchange-drawer.tsx) embedding the LiFi widget.
 *
 * Status owns the trigger + password unlock; the widget itself is third-party,
 * so interaction with it is kept to the minimum flow: pick the "to" token, type
 * an amount, review, start. Quotes come from the li.quest mock (lifi-mock.ts);
 * execution is real (signer -> background SW -> broadcast -> fork).
 */
export class WalletSwapDrawerPage extends BasePage {
  readonly exchangeButton = this.page.getByRole('button', {
    name: 'Exchange',
    exact: true,
  })
  /** Unlock button on the "Enter password" prompt shown when opening the drawer. */
  readonly unlockButton = this.page.getByRole('button', {
    name: 'Unlock & Exchange',
  })

  // --- LiFi widget internals (@lifi/widget, compact variant) -------------------
  readonly amountInput = this.page.locator('input[name="fromAmount"]')
  /** The "To" token-select card (a button whose CardTitle text node is "To"). */
  readonly toTokenButton = this.page
    .locator('button')
    .filter({ has: this.page.getByText('To', { exact: true }) })
  readonly reviewButton = this.page.getByRole('button', { name: 'Review swap' })
  readonly startButton = this.page.getByRole('button', {
    name: 'Start swapping',
  })
  /** Shown while the tx waits for a receipt (e.g. auto-mine off on the fork). */
  readonly pendingMessage = this.page.getByText('Swap transaction pending')
  readonly successMessage = this.page.getByText(
    /Swap successful|Swap completed/,
  )

  async goto(): Promise<void> {}

  async waitForReady(): Promise<void> {
    await expect(this.exchangeButton.last()).toBeVisible({ timeout: 20_000 })
  }

  /**
   * Open the drawer from the token detail page. The detail panel may render the
   * trigger more than once — the last is the drawer trigger — and its sticky
   * header intercepts pointer events, hence the force-click (same as the send
   * modal). Opening prompts for the password when the session is locked (always
   * the case right after onboarding); unlocking here also activates the session
   * used later for signing.
   */
  async open(password: string): Promise<void> {
    await this.waitForReady()
    await this.exchangeButton.last().click({ force: true })

    const prompted = await this.unlockButton
      .waitFor({ state: 'visible', timeout: 5_000 })
      .then(() => true)
      .catch(() => false)
    if (prompted) {
      await this.page.getByLabel('Password', { exact: true }).fill(password)
      await this.unlockButton.click()
    }

    // The widget is ready once its amount input renders.
    await expect(this.amountInput).toBeVisible({ timeout: 30_000 })
  }

  /** Pick the destination token in the widget's token list. */
  async selectToToken(symbol: string): Promise<void> {
    await this.toTokenButton.click()
    const tokenRow = this.page.getByText(symbol, { exact: true }).first()
    await expect(tokenRow).toBeVisible({ timeout: 15_000 })
    await tokenRow.click()
    await expect(this.amountInput).toBeVisible({ timeout: 15_000 })
  }

  async fillAmount(amount: string): Promise<void> {
    await this.amountInput.fill(amount)
  }

  /** Wait for a quote and open the review step. */
  async review(): Promise<void> {
    await expect(this.reviewButton).toBeEnabled({ timeout: 30_000 })
    await this.reviewButton.click()
  }

  /** Kick off execution and clear the password prompt if signing asks for one. */
  async start(password: string): Promise<void> {
    await expect(this.startButton).toBeEnabled({ timeout: 15_000 })
    await this.startButton.click()

    // The drawer unlock normally activates the session, so signing proceeds
    // silently — but handle a prompt in case the session lapsed.
    const passwordField = this.page.getByLabel('Password', { exact: true })
    const prompted = await passwordField
      .waitFor({ state: 'visible', timeout: 3_000 })
      .then(() => true)
      .catch(() => false)
    if (prompted) {
      await passwordField.fill(password)
      await this.page
        .getByRole('button', { name: /Confirm|Unlock|Send Transaction/ })
        .last()
        .click()
    }
  }

  /** The widget reports success once the tx mined and the status poll is DONE. */
  async waitForSuccess(): Promise<void> {
    await expect(this.successMessage.first()).toBeVisible({ timeout: 60_000 })
  }

  /** Full happy-path swap: open -> pick token -> amount -> review -> execute. */
  async completeSwap(
    toSymbol: string,
    amount: string,
    password: string,
  ): Promise<void> {
    await this.open(password)
    await this.selectToToken(toSymbol)
    await this.fillAmount(amount)
    await this.review()
    await this.start(password)
    await this.waitForSuccess()
  }
}
