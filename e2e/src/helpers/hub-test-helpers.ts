import { NOTIFICATION_TIMEOUTS } from '@constants/timeouts.js'

import type { MetaMaskPage } from '@pages/metamask/metamask.page.js'
import type { Page } from '@playwright/test'

/** Minimal EIP-1193 shape for tests (injected `window.ethereum`). */
type WindowEthereumProvider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
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
  const currentChainId = await hubPage
    .evaluate(() => {
      const eth = (window as unknown as Record<string, unknown>).ethereum as
        | WindowEthereumProvider
        | undefined
      return eth?.request({ method: 'eth_chainId' })
    })
    .catch(() => null)

  if (currentChainId === chainIdHex) {
    return
  }

  await metamask.dismissPendingAddNetwork()

  await hubPage.evaluate(chainId => {
    const eth = (window as unknown as Record<string, unknown>).ethereum as
      | WindowEthereumProvider
      | undefined
    eth
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
