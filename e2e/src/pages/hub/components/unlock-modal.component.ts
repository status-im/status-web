import { HUB_TIMEOUTS, NOTIFICATION_TIMEOUTS } from '@constants/timeouts.js'
import { expect, type Locator, type Page } from '@playwright/test'

/**
 * Page object for the pre-deposit "Unlock vault" modal (withdrawal step 1).
 *
 * The modal withdraws the user's full deposited balance from a vault to a
 * receiver address on Linea. Submitting requires a valid receiver plus both
 * confirmation checkboxes. When the wallet is on the wrong chain the submit
 * button is replaced by a "Switch network to unlock" button.
 */
export class UnlockModalComponent {
  readonly dialog: Locator
  readonly title: Locator
  readonly receiverInput: Locator
  readonly receiverError: Locator
  readonly confirmCheckbox: Locator
  readonly gasConfirmCheckbox: Locator
  readonly submitButton: Locator
  readonly switchNetworkButton: Locator
  readonly closeButton: Locator

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog')
    // Radix Dialog.Title renders `asChild` as a <span>, not a heading. Scope to
    // the semibold header span so it doesn't collide with the "Unlock vault"
    // submit button (which is font-500). Reads "Unlock vault" (cross-chain) or
    // "Claim from vault" (Linea same-chain).
    this.title = this.dialog
      .locator('span.font-semibold')
      .filter({ hasText: /unlock vault|claim from vault/i })
    this.receiverInput = this.dialog.locator('#receiver-address')
    this.receiverError = this.dialog.locator('p.text-danger-50')
    // Two confirmation checkboxes, in DOM order: receiver-control, then gas.
    this.confirmCheckbox = this.dialog.getByRole('checkbox').first()
    this.gasConfirmCheckbox = this.dialog.getByRole('checkbox').last()
    this.switchNetworkButton = this.dialog.getByRole('button', {
      name: /switch network to unlock|switch to linea to claim/i,
    })
    // Submit reads "Unlock vault" (cross-chain) or "Claim" (Linea same-chain).
    this.submitButton = this.dialog.locator('button[type="submit"]')
    this.closeButton = this.dialog.getByRole('button', { name: /close/i })
  }

  async waitForOpen(): Promise<void> {
    await expect(this.dialog).toBeVisible({ timeout: HUB_TIMEOUTS.PAGE_READY })
    // The receiver field is unique to the unlock modal and present in every
    // variant (right/wrong chain), so it's a robust "modal is open" signal.
    await expect(this.receiverInput).toBeVisible({
      timeout: NOTIFICATION_TIMEOUTS.ELEMENT_VISIBLE,
    })
  }

  async fillReceiver(address: string): Promise<void> {
    await this.receiverInput.fill(address)
  }

  async checkConfirmations(): Promise<void> {
    await this.confirmCheckbox.click()
    await this.gasConfirmCheckbox.click()
  }

  async expectReceiverError(pattern: RegExp): Promise<void> {
    await expect(this.receiverError).toBeVisible({
      timeout: NOTIFICATION_TIMEOUTS.BUTTON_TRANSITION,
    })
    await expect(this.receiverError).toHaveText(pattern)
  }

  async close(): Promise<void> {
    // force: true bypasses any ConnectKit overlay that may intercept clicks
    await this.closeButton.click({ force: true })
    await expect(this.dialog).not.toBeVisible({
      timeout: NOTIFICATION_TIMEOUTS.ELEMENT_VISIBLE,
    })
  }
}
