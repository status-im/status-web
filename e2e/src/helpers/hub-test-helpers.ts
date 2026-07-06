import { NOTIFICATION_TIMEOUTS } from '@constants/timeouts.js'
import { expect, type Page } from '@playwright/test'

import type { MetaMaskPage } from '@pages/metamask/metamask.page.js'

function unlockTxStorageKey(vaultId: string, account: string) {
  return `vault-unlock-tx:${vaultId}:${account.toLowerCase()}`
}

/**
 * Force-switch MetaMask to a specific chain via the hub page.
 *
 * 1. Dismiss any pending "Add Network" request from the hub
 * 2. Request `wallet_switchEthereumChain` through the hub page's injected provider
 * 3. Approve the network switch in MetaMask
 */
export async function switchMetaMaskToChain(
  hubPage: Page,
  metamask: MetaMaskPage,
  chainIdHex: string,
): Promise<void> {
  await metamask.dismissPendingAddNetwork()

  await hubPage.evaluate(chainId => {
    ;(window as any).ethereum
      ?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      })
      .catch(() => {})
  }, chainIdHex)

  await metamask.switchNetwork()
}

/**
 * Wait until the Hub persists the unlock tx hash for a vault + account.
 */
export async function waitForStoredUnlockTxHash(
  page: Page,
  vaultId: string,
  account: string,
  timeout = 30_000,
): Promise<string> {
  let txHash: string | null = null

  await expect
    .poll(
      async () => {
        txHash = await page.evaluate(
          ({ storageKey }) => localStorage.getItem(storageKey),
          { storageKey: unlockTxStorageKey(vaultId, account) },
        )
        return txHash
      },
      { timeout },
    )
    .not.toBeNull()

  return txHash!
}

/**
 * Read the account currently connected to the dApp via the injected provider.
 *
 * Use this when seeding on-chain state the Hub reads back: the Hub reads
 * `balanceOf(connectedAccount)`, so funding must target the connected MetaMask
 * account (the seed's account 0).
 */
export async function getConnectedAddress(page: Page): Promise<string> {
  const address = await page.evaluate(async () => {
    const eth = (
      window as { ethereum?: { request: (a: unknown) => Promise<string[]> } }
    ).ethereum
    if (!eth) return undefined
    const accounts = await eth.request({ method: 'eth_accounts' })
    return accounts?.[0]
  })

  if (!address) {
    throw new Error(
      'No connected account found on the dApp page — is MetaMask connected?',
    )
  }
  return address
}

/**
 * Dismiss the SIWE / ConnectKit dialog if it appeared after a network change.
 */
export async function dismissSiweDialogIfPresent(
  page: Page,
  timeout = NOTIFICATION_TIMEOUTS.OPTIONAL_ELEMENT,
): Promise<void> {
  const siweClose = page.locator(
    'button[aria-label="Close"], [data-testid="connectkit-close"]',
  )
  if (await siweClose.isVisible({ timeout }).catch(() => false)) {
    await siweClose.click()
  }
}
