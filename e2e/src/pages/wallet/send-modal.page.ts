import { expect } from '@playwright/test'

import { BasePage } from '../base.page.js'

import type { Locator } from '@playwright/test'

/**
 * Send-assets modal (packages/wallet/src/components/send-assets-modal). Status
 * owns this UI, including the gas-shifted ("Confirm with new gas price") path
 * used by the network-condition matrix.
 */
export class WalletSendModalPage extends BasePage {
  readonly openButton = this.page.getByRole('button', {
    name: 'Send',
    exact: true,
  })
  readonly title = this.page.getByRole('heading', { name: 'Send assets' })
  readonly recipientInput = this.page.locator('#to')
  readonly amountInput = this.page.locator('#amount')
  readonly maxFeesLabel = this.page.getByText('Max fees', { exact: true })
  // Submit label depends on session state; "gas shifted" swaps it for a confirm.
  readonly submitButton = this.page.getByRole('button', {
    name: /^(Sign & Send transaction|Send transaction|Confirm with new gas price)$/,
  })
  readonly gasShiftedAlert = this.page.getByText(
    /Gas price changed .* confirm to continue/,
  )
  // exact: the toast system's aria-live announcer duplicates the message as
  // "Notification Transaction signed and sent" — a substring match resolves to
  // both and trips strict mode.
  readonly successToast = this.page.getByText('Transaction signed and sent', {
    exact: true,
  })

  async goto(): Promise<void> {}
  async waitForReady(): Promise<void> {
    await expect(this.openButton).toBeVisible()
  }

  async open(): Promise<void> {
    // Two "Send" buttons render in the detail panel; the last is the
    // SendAssetsModal trigger. Wait for it to render (detail panel loads async),
    // then force-click past the sticky detail header.
    const trigger = this.openButton.last()
    await expect(trigger).toBeVisible({ timeout: 20_000 })
    await trigger.click({ force: true })
    await expect(this.title).toBeVisible()
  }

  async fillRecipient(address: string): Promise<void> {
    await this.recipientInput.fill(address)
  }

  async fillAmount(amount: string): Promise<void> {
    await this.amountInput.fill(amount)
  }

  /**
   * The estimated "Max fees" ETH value (a float), once available. The value
   * renders as a sibling of the "Max fees" label; read the label's parent text
   * and pull the ETH number out of it (robust to sibling structure changes).
   */
  async maxFeesEth(): Promise<number> {
    const container = this.maxFeesLabel.locator('xpath=..')
    await expect(container).not.toContainText('Estimating...', {
      timeout: 20_000,
    })
    const text = (await container.textContent()) ?? ''
    const match = text.match(/([\d.]+)\s*ETH/)
    if (!match) throw new Error(`Could not parse Max fees from: "${text}"`)
    return Number(match[1])
  }

  /** Wait until the submit button is enabled (gas estimated, inputs valid). */
  async waitForSubmittable(): Promise<void> {
    await expect(this.submitButton).toBeEnabled({ timeout: 20_000 })
  }

  async submit(): Promise<void> {
    await this.submitButton.click()
  }

  gasShiftedButton(): Locator {
    return this.page.getByRole('button', {
      name: 'Confirm with new gas price',
    })
  }

  /** The unlock button on the "Enter password" prompt shown before signing. */
  readonly passwordUnlockButton = this.page.getByRole('button', {
    name: 'Send Transaction',
  })

  /** Wait for the "Enter password" prompt (shown on submit when the session is locked). */
  async waitForPasswordPrompt(): Promise<void> {
    await expect(this.passwordUnlockButton).toBeVisible({ timeout: 15_000 })
  }

  /** Fill the password prompt and confirm. */
  async enterPassword(password: string): Promise<void> {
    await this.page.getByLabel('Password', { exact: true }).fill(password)
    await this.passwordUnlockButton.click()
  }

  /**
   * If the session isn't active, submitting prompts for the password before
   * signing. Fill it if the prompt appears.
   */
  async passwordPromptIfShown(password: string): Promise<void> {
    if (await this.passwordUnlockButton.isVisible().catch(() => false)) {
      await this.enterPassword(password)
    }
  }

  /**
   * Wait for the "Transaction signed and sent" toast — it appears right after
   * broadcast returns, so it's the precise success signal (the modal title also
   * hides, but transiently during signing/password, so it can't be used).
   */
  async waitForSuccess(): Promise<void> {
    await expect(this.successToast).toBeVisible({ timeout: 30_000 })
  }

  /** Open the modal and fill it, leaving the submit button ready to click. */
  async prepareSend(recipient: string, amount: string): Promise<void> {
    await this.open()
    await this.fillRecipient(recipient)
    await this.fillAmount(amount)
    await this.waitForSubmittable()
  }

  /** Submit and clear the password prompt (does not wait for success). */
  async submitAndUnlock(password: string): Promise<void> {
    await this.submit()
    await this.passwordPromptIfShown(password)
  }

  /** Full happy-path send: open -> fill -> submit -> (password) -> success. */
  async completeSend(
    recipient: string,
    amount: string,
    password: string,
  ): Promise<void> {
    await this.prepareSend(recipient, amount)
    await this.submitAndUnlock(password)
    await this.waitForSuccess()
  }
}
