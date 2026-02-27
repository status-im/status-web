import { STATUS_SEPOLIA_CHAIN_ID_HEX } from '@constants/hub/chains.js'
import { TEST_VAULTS } from '@constants/hub/vaults.js'
import { test } from '@fixtures/hub/wallet-connected.fixture.js'
import {
  dismissSiweDialogIfPresent,
  switchMetaMaskToChain,
} from '@helpers/hub-test-helpers.js'

import { PreDepositModalComponent } from '@pages/hub/components/pre-deposit-modal.component.js'
import { PreDepositsPage } from '@pages/hub/pre-deposits.page.js'

test.describe('Pre-Deposit - Network switch', () => {
  for (const vault of Object.values(TEST_VAULTS)) {
    test(
      `${vault.token}: switch to correct network for deposit`,
      { tag: '@wallet' },
      async ({ hubPage, metamask }) => {
        const preDepositsPage = new PreDepositsPage(hubPage)
        const depositModal = new PreDepositModalComponent(hubPage)

        await test.step('Switch MetaMask to Status Network Sepolia (wrong network for all vaults)', async () => {
          await switchMetaMaskToChain(
            hubPage,
            metamask,
            STATUS_SEPOLIA_CHAIN_ID_HEX,
          )
        })

        await test.step('Navigate to Pre-Deposits page', async () => {
          await dismissSiweDialogIfPresent(hubPage)

          await preDepositsPage.goto()
          await preDepositsPage.waitForReady()
        })

        await test.step(`Open deposit modal for ${vault.name}`, async () => {
          await preDepositsPage.clickDepositForVault(vault.token)
          await depositModal.waitForOpen()
        })

        await test.step('Verify "Switch Network to Deposit" is visible', async () => {
          await depositModal.expectSwitchNetworkButtonVisible()
        })

        await test.step('Click switch network', async () => {
          await depositModal.clickSwitchNetwork()

          // All vault chains (Ethereum Mainnet, Linea) are well-known networks
          // that MetaMask auto-switches without showing a notification popup.
          // Just wait for the hub to detect the chain change.
        })

        await test.step('Verify button changes to "Enter amount"', async () => {
          await depositModal.expectSwitchNetworkButtonGone()
          await depositModal.expectActionButtonText(/enter amount/i)
        })

        await test.step('Close modal', async () => {
          await depositModal.close()
        })
      },
    )
  }
})
