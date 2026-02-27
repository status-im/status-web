import { NOTIFICATION_TIMEOUTS } from '@constants/timeouts.js'

import type { MetaMaskPage } from '@pages/metamask/metamask.page.js'
import type { Page } from '@playwright/test'

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
