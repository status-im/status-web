import { HUB_TIMEOUTS, NOTIFICATION_TIMEOUTS } from '@constants/timeouts.js'
import { expect, type Locator, type Page } from '@playwright/test'

export class PreDepositModalComponent {
  readonly dialog: Locator
  readonly title: Locator
  readonly amountInput: Locator
  readonly errorMessage: Locator
  readonly actionButton: Locator
  readonly switchNetworkButton: Locator
  readonly maxButton: Locator
  readonly closeButton: Locator

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog')
    this.title = this.dialog.getByText('Deposit funds', { exact: true })
    this.amountInput = page.locator('#deposit-amount')
    this.errorMessage = this.dialog.locator('p.text-danger-50')
    this.maxButton = this.dialog.getByRole('button', { name: /^MAX/i })
    this.closeButton = this.dialog.getByRole('button', { name: /close/i })

    this.switchNetworkButton = this.dialog.getByRole('button', {
      name: /switch network to deposit/i,
    })
    this.actionButton = this.dialog.locator(
      'button[type="submit"], button:has-text("Enter amount")',
    )
  }

  async waitForOpen(): Promise<void> {
    await expect(this.dialog).toBeVisible({
      timeout: HUB_TIMEOUTS.PAGE_READY,
    })
    await expect(this.title).toBeVisible({
      timeout: NOTIFICATION_TIMEOUTS.ELEMENT_VISIBLE,
    })
  }

  async enterAmount(amount: string): Promise<void> {
    await this.amountInput.fill(amount)
  }

  async close(): Promise<void> {
    // force: true bypasses ConnectKit's SIWE overlay that may intercept clicks
    await this.closeButton.click({ force: true })
    await expect(this.dialog).not.toBeVisible({
      timeout: NOTIFICATION_TIMEOUTS.ELEMENT_VISIBLE,
    })
  }

  async expectErrorMessageMatching(pattern: RegExp): Promise<void> {
    await expect(this.errorMessage).toBeVisible({
      timeout: NOTIFICATION_TIMEOUTS.BUTTON_TRANSITION,
    })
    await expect(this.errorMessage).toHaveText(pattern)
  }

  async expectActionButtonDisabled(): Promise<void> {
    await expect(this.actionButton).toBeDisabled()
  }

  async expectActionButtonText(pattern: RegExp): Promise<void> {
    await expect(this.actionButton).toHaveText(pattern)
  }

  async expectSwitchNetworkButtonVisible(): Promise<void> {
    await expect(this.switchNetworkButton).toBeVisible({
      timeout: HUB_TIMEOUTS.PAGE_READY,
    })
  }

  async clickSwitchNetwork(): Promise<void> {
    await this.switchNetworkButton.click()
  }

  async expectSwitchNetworkButtonGone(): Promise<void> {
    await expect(this.switchNetworkButton).not.toBeVisible({
      timeout: HUB_TIMEOUTS.PAGE_READY,
    })
  }
}
