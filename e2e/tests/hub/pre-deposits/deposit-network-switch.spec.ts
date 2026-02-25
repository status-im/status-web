import { TEST_VAULTS } from '@constants/hub/vaults.js'
import { NOTIFICATION_TIMEOUTS } from '@constants/timeouts.js'
import { test } from '@fixtures/hub/wallet-connected.fixture.js'
import { PreDepositModalComponent } from '@pages/hub/components/pre-deposit-modal.component.js'
import { PreDepositsPage } from '@pages/hub/pre-deposits.page.js'

// Status Network Sepolia chain ID (hex) — a network that no vault uses,
// ensuring all vaults show "Switch Network to Deposit".
const STATUS_SEPOLIA_CHAIN_ID = '0x6300b5ea'

test.describe('Pre-Deposit - Network switch', () => {
  for (const vault of Object.values(TEST_VAULTS)) {
    test(
      `${vault.token}: switch to correct network for deposit`,
      { tag: '@wallet' },
      async ({ hubPage, metamask }) => {
        const preDepositsPage = new PreDepositsPage(hubPage)
        const depositModal = new PreDepositModalComponent(hubPage)

        await test.step('Switch MetaMask to Status Network Sepolia (wrong network for all vaults)', async () => {
          // 1. Approve the pending "Add Status Network Sepolia" request from the hub
          await metamask.dismissPendingAddNetwork()

          // 2. Force-switch to Status Network Sepolia (now that it's added)
          await hubPage.evaluate(chainId => {
            ;(window as any).ethereum
              ?.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
              })
              .catch(() => {})
          }, STATUS_SEPOLIA_CHAIN_ID)

          // 3. Approve the switch in MetaMask
          await metamask.switchNetwork()
        })

        await test.step('Navigate to Pre-Deposits page', async () => {
          // Dismiss SIWE dialog if it appeared (ConnectKit may prompt after network change)
          const siweClose = hubPage.locator(
            'button[aria-label="Close"], [data-testid="connectkit-close"]',
          )
          if (
            await siweClose
              .isVisible({ timeout: NOTIFICATION_TIMEOUTS.OPTIONAL_ELEMENT })
              .catch(() => false)
          ) {
            await siweClose.click()
          }

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
