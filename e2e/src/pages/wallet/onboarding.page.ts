import { expect } from '@playwright/test'

import { BasePage } from '../base.page.js'

/**
 * Status wallet onboarding — import-via-recovery-phrase flow.
 *
 * Flow (see apps/wallet/src/components/onboarding + routes/onboarding):
 *   landing ("Import wallet") -> recovery phrase (aria-label "Recovery phrase")
 *   -> "Continue" -> create password ("Password" / "Confirm password")
 *   -> "Import Wallet" -> lands on /portfolio/assets.
 *
 * Selectors are text/role/aria-based — the wallet has few data-testids.
 */
export class WalletOnboardingPage extends BasePage {
  readonly importWalletButton = this.page.getByRole('link', {
    name: 'Import wallet',
  })
  readonly recoveryPhraseInput = this.page.getByLabel('Recovery phrase')
  readonly continueButton = this.page.getByRole('button', { name: 'Continue' })
  readonly passwordInput = this.page.getByLabel('Password', { exact: true })
  readonly confirmPasswordInput = this.page.getByLabel('Confirm password')
  readonly importButton = this.page.getByRole('button', {
    name: 'Import Wallet',
  })

  async goto(): Promise<void> {
    // The extension page opens on onboarding when no wallet exists; the fixture
    // is responsible for opening the extension page. Nothing to navigate here.
  }

  async waitForReady(): Promise<void> {
    await expect(this.importWalletButton).toBeVisible()
  }

  /**
   * Full import: seed -> password -> land on portfolio. Idempotent enough for a
   * fresh profile (each test run uses a new temp profile).
   */
  async importWallet(seedPhrase: string, password: string): Promise<void> {
    await this.importWalletButton.click()

    await expect(this.recoveryPhraseInput).toBeVisible()
    await this.recoveryPhraseInput.fill(seedPhrase)
    await expect(this.continueButton).toBeEnabled()
    await this.continueButton.click()

    await expect(this.passwordInput).toBeVisible()
    await this.passwordInput.fill(password)
    await this.confirmPasswordInput.fill(password)
    await expect(this.importButton).toBeEnabled()
    await this.importButton.click()

    // Lands on /portfolio/assets on success.
    await this.page.waitForURL(/\/portfolio\/assets/, { timeout: 30_000 })
  }
}
