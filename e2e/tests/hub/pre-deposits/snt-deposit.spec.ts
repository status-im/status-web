import { DEPOSIT_AMOUNTS } from '@constants/hub/vaults.js'
import { test } from '@fixtures/anvil.fixture.js'
import { FUNDING_PRESETS } from '@helpers/anvil-rpc.js'

test.describe('SNT Vault - Happy path deposit', () => {
  test(
    'S-1: deposit SNT tokens',
    { tag: '@anvil' },
    async ({ anvilRpc, metamask, preDepositsPage, depositModal }) => {
      await test.step('Fund wallet with SNT + gas ETH', async () => {
        await anvilRpc.fund(FUNDING_PRESETS.SNT_DEPOSIT)
      })

      await test.step('Navigate to Pre-Deposits page', async () => {
        await preDepositsPage.goto()
        await preDepositsPage.waitForReady()
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
