import { expect } from '@playwright/test'

import { BasePage } from '../base.page.js'

import type { Locator } from '@playwright/test'

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
 * The recovery phrase entry is a word-by-word grid: a word-count dropdown
 * (12/15/18/21/24), a Clear button, N numbered inputs with per-word bip39
 * validation, and a "Fetch accounts" submit that stays disabled until the whole
 * phrase passes the checksum. This page object exposes granular helpers for
 * those interactions so specs can assert them precisely.
 *
 * Selectors are text/role/aria-based — the wallet has few data-testids.
 */
export class WalletOnboardingPage extends BasePage {
  readonly importWalletButton = this.page.getByRole('link', {
    name: 'Import wallet',
  })
  readonly firstWordInput = this.page.getByLabel('Word 1', { exact: true })
  readonly clearButton = this.page.getByRole('button', { name: 'Clear' })
  readonly fetchAccountsButton = this.page.getByRole('button', {
    name: 'Fetch accounts',
  })
  readonly checksumError = this.page.getByRole('alert')
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

  // --- Recovery phrase grid: granular helpers --------------------------------

  /** The numbered word input at a 1-based position (matches the visible chip). */
  wordInput(position: number): Locator {
    return this.page.getByLabel(`Word ${position}`, { exact: true })
  }

  /** Every rendered word input (its count equals the selected word count). */
  wordInputs(): Locator {
    return this.page.getByLabel(/^Word \d+$/)
  }

  /** The word-count dropdown trigger, whatever value it currently shows. */
  wordCountDropdown(): Locator {
    return this.page.getByRole('button', { name: /^\d+ words$/ })
  }

  /** Open the landing "Import wallet" entry and wait for the grid to render. */
  async openRecoveryPhraseEntry(): Promise<void> {
    await this.importWalletButton.click()
    await expect(this.firstWordInput).toBeVisible()
  }

  /** Switch the word-count dropdown (12/15/18/21/24) and wait for the resize. */
  async selectWordCount(count: number): Promise<void> {
    await this.wordCountDropdown().click()
    await this.page.getByRole('menuitem', { name: `${count} words` }).click()
    await expect(this.wordInputs()).toHaveCount(count)
  }

  /** Type a single word into a 1-based position. */
  async fillWord(position: number, word: string): Promise<void> {
    await this.wordInput(position).fill(word)
  }

  /**
   * Fill an entire phrase word-by-word, switching the word-count dropdown first
   * when the phrase is not the default 12 words.
   */
  async fillPhrase(seedPhrase: string): Promise<void> {
    const words = seedPhrase.trim().split(/\s+/)

    if (words.length !== 12) {
      await this.selectWordCount(words.length)
    }

    for (const [index, word] of words.entries()) {
      await this.fillWord(index + 1, word)
    }
  }

  /**
   * Paste a full phrase into a target input (1-based; defaults to the first).
   * Mirrors a real clipboard paste so the grid's distribution logic runs.
   */
  async pastePhrase(seedPhrase: string, targetPosition = 1): Promise<void> {
    const target = this.wordInput(targetPosition)
    await target.focus()
    await target.evaluate((element, text) => {
      const data = new DataTransfer()
      data.setData('text/plain', text)
      element.dispatchEvent(
        new ClipboardEvent('paste', {
          clipboardData: data,
          bubbles: true,
          cancelable: true,
        }),
      )
    }, seedPhrase)
  }

  async clearPhrase(): Promise<void> {
    await this.clearButton.click()
  }

  // --- Full flow -------------------------------------------------------------

  /**
   * Full import: seed -> password -> land on portfolio. Idempotent enough for a
   * fresh profile (each test run uses a new temp profile).
   */
  async importWallet(seedPhrase: string, password: string): Promise<void> {
    await this.openRecoveryPhraseEntry()
    await this.fillPhrase(seedPhrase)

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
