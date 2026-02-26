import {
  METAMASK_DEFAULT_CHAIN_ID,
  STATUS_SEPOLIA_CHAIN_ID_HEX,
} from '@constants/hub/chains.js'
import { TEST_AMOUNTS, TEST_VAULTS } from '@constants/hub/vaults.js'
import { NOTIFICATION_TIMEOUTS } from '@constants/timeouts.js'
import { test } from '@fixtures/hub/wallet-connected.fixture.js'
import { PreDepositModalComponent } from '@pages/hub/components/pre-deposit-modal.component.js'
import { PreDepositsPage } from '@pages/hub/pre-deposits.page.js'
import { expect } from '@playwright/test'

test.describe('Pre-Deposit validation - Exceed balance', () => {
  for (const vault of Object.values(TEST_VAULTS)) {
    test(
      `${vault.token}: shows insufficient balance error when amount exceeds balance`,
      { tag: '@wallet' },
      async ({ hubPage, metamask }) => {
        const preDepositsPage = new PreDepositsPage(hubPage)
        const depositModal = new PreDepositModalComponent(hubPage)

        // For vaults on a different chain we must first put MetaMask on a
        // known wrong network, using the exact same 3-step setup as
        // deposit-network-switch.spec.ts.
        if (vault.chainId !== METAMASK_DEFAULT_CHAIN_ID) {
          await test.step('Set up MetaMask on Status Network Sepolia (wrong network)', async () => {
            // 1. Approve the pending "Add Status Network Sepolia" from hub
            await metamask.dismissPendingAddNetwork()

            // 2. Force-switch to Status Network Sepolia
            await hubPage.evaluate(chainId => {
              ;(window as any).ethereum
                ?.request({
                  method: 'wallet_switchEthereumChain',
                  params: [{ chainId }],
                })
                .catch(() => {})
            }, STATUS_SEPOLIA_CHAIN_ID_HEX)

            // 3. Approve the switch — leaves notification page OPEN
            await metamask.switchNetwork()
          })

          await test.step('Dismiss SIWE dialog if present', async () => {
            const siweClose = hubPage.locator(
              'button[aria-label="Close"], [data-testid="connectkit-close"]',
            )
            if (
              await siweClose
                .isVisible({
                  timeout: NOTIFICATION_TIMEOUTS.OPTIONAL_ELEMENT,
                })
                .catch(() => false)
            ) {
              await siweClose.click()
            }
          })
        }

        await test.step('Navigate to Pre-Deposits page', async () => {
          await preDepositsPage.goto()
          await preDepositsPage.waitForReady()
        })

        await test.step(`Open deposit modal for ${vault.name}`, async () => {
          await preDepositsPage.clickDepositForVault(vault.token)
          await depositModal.waitForOpen()
        })

        // For vaults on a different chain, click "Switch Network to Deposit".
        // Auto-switches to the vault's chain (well-known networks don't need
        // an additional MetaMask notification approval).
        if (vault.chainId !== METAMASK_DEFAULT_CHAIN_ID) {
          await test.step('Switch to correct network for deposit', async () => {
            await depositModal.expectSwitchNetworkButtonVisible()
            await depositModal.clickSwitchNetwork()
            await depositModal.expectSwitchNetworkButtonGone()
          })
        }

        // Fail-safe: ensure we ended up on the correct network and the
        // action button has rendered.
        await test.step('Verify wallet is on the correct network', async () => {
          await expect(depositModal.switchNetworkButton).not.toBeVisible({
            timeout: NOTIFICATION_TIMEOUTS.OPTIONAL_ELEMENT,
          })
          await expect(depositModal.actionButton).toBeVisible({
            timeout: NOTIFICATION_TIMEOUTS.BUTTON_TRANSITION,
          })
        })

        await test.step('Enter amount exceeding balance', async () => {
          await depositModal.enterAmount(TEST_AMOUNTS.EXCEED_BALANCE)
        })

        await test.step('Verify insufficient balance error', async () => {
          await depositModal.expectErrorMessageMatching(/insufficient balance/i)
        })

        await test.step('Verify action button is disabled', async () => {
          await depositModal.expectActionButtonDisabled()
        })

        await test.step('Close modal', async () => {
          await depositModal.close()
        })
      },
    )
  }
})
