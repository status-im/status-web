import { expect } from '@playwright/test'

import { BasePage } from '../base.page.js'

/**
 * Status wallet onboarding — import-via-recovery-phrase flow.
 *
 * Flow (see apps/wallet/src/components/onboarding + routes/onboarding):
 *   landing ("Import wallet") -> recovery phrase word grid (aria-labels
 *   "Word 1".."Word N") -> "Fetch accounts" -> accounts to import (activity
 *   scan; Continue re-enables when it settles) -> "Continue" -> create
 *   password ("Password" / "Confirm password") -> "Import Wallet" -> lands on
 *   /portfolio/assets.
 *
 * Selectors are text/role/aria-based — the wallet has few data-testids.
 */
export class WalletOnboardingPage extends BasePage {
  readonly importWalletButton = this.page.getByRole('link', {
    name: 'Import wallet',
  })
  readonly firstWordInput = this.page.getByLabel('Word 1', { exact: true })
  readonly fetchAccountsButton = this.page.getByRole('button', {
    name: 'Fetch accounts',
  })
  readonly continueButton = this.page.getByRole('button', { name: 'Continue' })
  readonly accountsToImportTitle = this.page.getByText('Accounts to import')
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

    // The phrase entry is a word-by-word grid; fill each numbered input.
    await expect(this.firstWordInput).toBeVisible()
    const words = seedPhrase.trim().split(/\s+/)

    // The grid defaults to 12 words; switch the word-count dropdown for
    // longer phrases (15/18/21/24).
    if (words.length !== 12) {
      await this.page.getByRole('button', { name: '12 words' }).click()
      await this.page
        .getByRole('menuitem', { name: `${words.length} words` })
        .click()
    }

    for (const [index, word] of words.entries()) {
      await this.page
        .getByLabel(`Word ${index + 1}`, { exact: true })
        .fill(word)
    }
    await expect(this.fetchAccountsButton).toBeEnabled()
    await this.fetchAccountsButton.click()

    // Account-discovery step: wait for the activity scan to settle (Continue
    // re-enables), then continue with the discovered accounts.
    await expect(this.accountsToImportTitle).toBeVisible()
    await expect(this.continueButton).toBeEnabled({ timeout: 60_000 })
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
