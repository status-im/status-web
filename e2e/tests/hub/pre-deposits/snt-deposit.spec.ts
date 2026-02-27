import { DEPOSIT_AMOUNTS } from '@constants/hub/vaults.js'
import { test } from '@fixtures/anvil.fixture.js'
import { FUNDING_PRESETS } from '@helpers/anvil-rpc.js'
import { PreDepositModalComponent } from '@pages/hub/components/pre-deposit-modal.component.js'
import { PreDepositsPage } from '@pages/hub/pre-deposits.page.js'

test.describe('SNT Vault - Happy path deposit', () => {
  test(
    'S-1: deposit SNT tokens',
    { tag: '@anvil' },
    async ({ hubPage, anvilRpc, metamask }) => {
      await test.step('Fund wallet with SNT + gas ETH', async () => {
        await anvilRpc.fund(FUNDING_PRESETS.SNT_DEPOSIT)
      })

      const preDepositsPage = new PreDepositsPage(hubPage)
      const depositModal = new PreDepositModalComponent(hubPage)

      await test.step('Navigate to Pre-Deposits page', async () => {
        await preDepositsPage.goto()
        await preDepositsPage.waitForReady()
      })

      // Dismiss any wallet_addEthereumChain requests queued during navigation.
      // The provider patch in the fixture blocks future ones, but navigation
      // may trigger them before the page's JS fully loads.
      await test.step('Dismiss any pending MetaMask network popups', async () => {
        await metamask.dismissPendingAddNetwork()
      })

      await test.step('Open deposit modal for SNT vault', async () => {
        await preDepositsPage.clickDepositForVault('SNT')
        await depositModal.waitForOpen()
      })

      await test.step('Enter deposit amount', async () => {
        await depositModal.enterAmount(DEPOSIT_AMOUNTS.SNT)
      })

      await test.step('Verify "Approve Deposit" button', async () => {
        await depositModal.expectActionButtonReady(/approve deposit/i)
      })

      await test.step('Click "Approve Deposit" and approve token spend in MetaMask', async () => {
        await depositModal.clickActionButton()
        await metamask.approveTokenSpend()
      })

      await test.step('Approve deposit transaction in MetaMask', async () => {
        // After approval, Hub auto-fires the deposit tx via performDeposit().
        // This creates a new MetaMask confirmation that needs user approval.
        await metamask.approveTransaction()
      })

      await test.step('Verify deposit success (modal closes)', async () => {
        await depositModal.expectModalClosed()
      })
    },
  )
})
