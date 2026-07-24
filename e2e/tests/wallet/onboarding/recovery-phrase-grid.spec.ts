import { expect, test } from '@fixtures/wallet/onboarding.fixture.js'

/**
 * Recovery-phrase word-grid UI (apps/wallet import flow).
 *
 * Deterministic, network-free coverage of the grid itself: word-count
 * dropdown, per-word bip39 validation, full-phrase paste distribution,
 * checksum gating of the "Fetch accounts" submit, Clear, and keyboard nav.
 * The post-submit discovery/password/portfolio path is covered by the
 * wallet-send/-swap fixtures' importWallet().
 *
 * Public BIP39 test vectors (never real funds):
 *   12 words — the Hardhat/Anvil default account mnemonic.
 *   24 words — the classic BIP39 "0x7f..7f" entropy vector.
 */
const VALID_12 = 'test test test test test test test test test test test junk'
const VALID_24 =
  'legal winner thank year wave sausage worth useful legal winner thank year wave sausage worth useful legal winner thank year wave sausage worth title'

test.describe('Wallet onboarding — recovery phrase grid', () => {
  test.beforeEach(async ({ onboarding }) => {
    await onboarding.openRecoveryPhraseEntry()
  })

  test(
    'renders 12 empty inputs with controls disabled and word 1 focused',
    { tag: '@wallet-onboarding' },
    async ({ onboarding, onboardingPage }) => {
      await expect(onboarding.wordInputs()).toHaveCount(12)
      await expect(onboarding.wordCountDropdown()).toHaveText('12 words')
      await expect(onboarding.clearButton).toBeDisabled()
      await expect(onboarding.fetchAccountsButton).toBeDisabled()
      await expect(
        onboardingPage.getByText('Type or paste your recovery phrase', {
          exact: true,
        }),
      ).toBeVisible()
      // First cell is auto-focused so the user can type immediately.
      await expect(onboarding.wordInput(1)).toBeFocused()
    },
  )

  test(
    'word-count dropdown grows and shrinks the grid',
    { tag: '@wallet-onboarding' },
    async ({ onboarding }) => {
      await onboarding.selectWordCount(24)
      await expect(onboarding.wordCountDropdown()).toHaveText('24 words')
      await expect(onboarding.wordInputs()).toHaveCount(24)

      await onboarding.selectWordCount(12)
      await expect(onboarding.wordInputs()).toHaveCount(12)
    },
  )

  test(
    'pasting a full 12-word phrase fills every cell and enables submit',
    { tag: '@wallet-onboarding' },
    async ({ onboarding }) => {
      await onboarding.pastePhrase(VALID_12)

      const words = VALID_12.split(' ')
      await expect(onboarding.wordInput(1)).toHaveValue(words[0])
      await expect(onboarding.wordInput(12)).toHaveValue(words[11])
      await expect(onboarding.checksumError).toBeHidden()
      await expect(onboarding.fetchAccountsButton).toBeEnabled()
    },
  )

  test(
    'pasting a 24-word phrase auto-switches the word count',
    { tag: '@wallet-onboarding' },
    async ({ onboarding }) => {
      // Grid starts at 12; a 24-word paste must expand it to 24.
      await onboarding.pastePhrase(VALID_24)

      await expect(onboarding.wordInputs()).toHaveCount(24)
      await expect(onboarding.wordCountDropdown()).toHaveText('24 words')
      await expect(onboarding.wordInput(24)).toHaveValue('title')
      await expect(onboarding.fetchAccountsButton).toBeEnabled()
    },
  )

  test(
    'marks a non-wordlist entry invalid and keeps submit disabled',
    { tag: '@wallet-onboarding' },
    async ({ onboarding }) => {
      await onboarding.fillWord(1, 'notaword')
      // Blur to trigger the per-word check.
      await onboarding.wordInput(2).focus()

      await expect(onboarding.wordInput(1)).toHaveAttribute(
        'aria-invalid',
        'true',
      )
      await expect(onboarding.fetchAccountsButton).toBeDisabled()
    },
  )

  test(
    'shows a checksum error when all words are valid but the phrase is wrong',
    { tag: '@wallet-onboarding' },
    async ({ onboarding }) => {
      // 11 correct words + a valid-but-wrong last word: every word is in the
      // wordlist, so only the whole-phrase checksum fails.
      const badPhrase = [...VALID_12.split(' ').slice(0, 11), 'test'].join(' ')
      await onboarding.pastePhrase(badPhrase)

      await expect(onboarding.checksumError).toBeVisible()
      await expect(onboarding.checksumError).toHaveText(/invalid phrase/i)
      await expect(onboarding.fetchAccountsButton).toBeDisabled()
    },
  )

  test(
    'Clear empties every cell, dismisses the error, and re-disables submit',
    { tag: '@wallet-onboarding' },
    async ({ onboarding }) => {
      await onboarding.pastePhrase(VALID_12)
      await expect(onboarding.fetchAccountsButton).toBeEnabled()

      await onboarding.clearPhrase()

      await expect(onboarding.wordInput(1)).toHaveValue('')
      await expect(onboarding.wordInput(12)).toHaveValue('')
      await expect(onboarding.checksumError).toBeHidden()
      await expect(onboarding.clearButton).toBeDisabled()
      await expect(onboarding.fetchAccountsButton).toBeDisabled()
    },
  )

  test(
    'keyboard: space advances, backspace on empty returns, input lowercases',
    { tag: '@wallet-onboarding' },
    async ({ onboarding, onboardingPage }) => {
      await onboarding.wordInput(1).focus()
      await onboardingPage.keyboard.type('TEST')
      await onboardingPage.keyboard.press('Space')

      // Space moves focus forward; the typed word is normalised to lowercase.
      await expect(onboarding.wordInput(2)).toBeFocused()
      await expect(onboarding.wordInput(1)).toHaveValue('test')

      // Backspace in the (empty) next cell returns to the previous one.
      await onboardingPage.keyboard.press('Backspace')
      await expect(onboarding.wordInput(1)).toBeFocused()
    },
  )
})
