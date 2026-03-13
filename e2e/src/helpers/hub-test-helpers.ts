import { NOTIFICATION_TIMEOUTS } from '@constants/timeouts.js'

import type { MetaMaskPage } from '@pages/metamask/metamask.page.js'
import type { Page } from '@playwright/test'

export async function switchMetaMaskToChain(
  hubPage: Page,
  metamask: MetaMaskPage,
  chainIdHex: string,
): Promise<void> {
  const currentChainId = await hubPage
    .evaluate(() => {
      const eth = (window as unknown as Record<string, unknown>).ethereum as
        | {
            request: (args: {
              method: string
              params?: unknown[]
            }) => Promise<unknown>
          }
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
      | {
          request: (args: {
            method: string
            params?: unknown[]
          }) => Promise<unknown>
        }
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
