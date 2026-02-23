import { test } from '@fixtures/anvil.fixture.js'
import { PreDepositsPage } from '@pages/hub/pre-deposits.page.js'
import { PreDepositModalComponent } from '@pages/hub/components/pre-deposit-modal.component.js'
import { DEPOSIT_AMOUNTS } from '@constants/vaults.js'
import { FUNDING_PRESETS } from '@helpers/anvil-rpc.js'

test.describe('LINEA Vault - Happy path deposit', () => {
  test(
    'L-1: deposit LINEA tokens with network switch',
    { tag: '@anvil' },
    async ({ hubPage, anvilRpc, metamask }) => {
      await test.step('Fund wallet with LINEA tokens', async () => {
        await anvilRpc.fund(FUNDING_PRESETS.LINEA_DEPOSIT)
      })

      const preDepositsPage = new PreDepositsPage(hubPage)
      const depositModal = new PreDepositModalComponent(hubPage)

      await test.step('Navigate to Pre-Deposits page', async () => {
        await preDepositsPage.goto()
        await preDepositsPage.waitForReady()
      })

      await test.step('Dismiss any pending MetaMask network popups', async () => {
        await metamask.dismissPendingAddNetwork()
        await metamask.dismissPendingAddNetwork()
      })

      await test.step('Open deposit modal for LINEA vault', async () => {
        await preDepositsPage.clickDepositForVault('LINEA')
        await depositModal.waitForOpen()
      })

      await test.step('Switch to Linea network', async () => {
        await depositModal.expectSwitchNetworkButtonVisible()
        await depositModal.clickSwitchNetwork()
        await depositModal.expectSwitchNetworkButtonGone()
      })

      await test.step('Enter deposit amount', async () => {
        await depositModal.enterAmount(DEPOSIT_AMOUNTS.LINEA)
      })

      await test.step('Verify "Approve Deposit" button', async () => {
        await depositModal.expectActionButtonReady(/approve deposit/i)
      })

      await test.step('Click "Approve Deposit" and approve token spend in MetaMask', async () => {
        await depositModal.clickActionButton()
        await metamask.approveTokenSpend()
      })

      await test.step('Approve deposit transaction in MetaMask', async () => {
        await metamask.approveTransaction()
      })

      await test.step('Verify deposit success (modal closes)', async () => {
        await depositModal.expectModalClosed()
      })
    },
  )
})
