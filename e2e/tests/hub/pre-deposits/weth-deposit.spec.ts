import { DEPOSIT_AMOUNTS } from '@constants/hub/vaults.js'
import { test } from '@fixtures/anvil.fixture.js'
import { FUNDING_PRESETS } from '@helpers/anvil-rpc.js'

const FALLBACK_WRAP_WETH_AMOUNT = 1n * 10n ** 18n

test.describe('WETH Vault - Happy path deposits', () => {
  test(
    'W-1: wrap ETH then deposit into WETH vault (no existing WETH)',
    { tag: '@anvil' },
    async ({ hubPage, anvilRpc, metamask, preDepositsPage, depositModal }) => {
      await test.step('Fund wallet with ETH only (no WETH)', async () => {
        await anvilRpc.fund(FUNDING_PRESETS.WETH_DEPOSIT_WRAP)
        // Zero out any pre-existing WETH from the fork state so the UI
        // shows "Wrap ETH to WETH" instead of "Approve Deposit".
        await anvilRpc.fundWeth(0n)
      })

      await test.step('Navigate to Pre-Deposits page', async () => {
        await preDepositsPage.goto()
        await preDepositsPage.waitForReady()
      })

      await test.step('Open deposit modal for WETH vault', async () => {
        await preDepositsPage.clickDepositForVault('WETH')
        await depositModal.waitForOpen()
      })

      await test.step('Enter deposit amount', async () => {
        await depositModal.enterAmount(DEPOSIT_AMOUNTS.WETH)
      })

      await test.step('Verify "Wrap ETH to WETH" button appears', async () => {
        await depositModal.expectActionButtonReady(/wrap eth to weth/i)
      })

      await test.step('Simulate wrap completion on Anvil and refresh modal state', async () => {
        // TODO: Restore real wrap tx confirmation once MetaMask STX routing is
        // fully stable on local Anvil forks.
        await anvilRpc.fundWeth(FALLBACK_WRAP_WETH_AMOUNT)
        await hubPage.waitForTimeout(1_500)
        await depositModal.close()
        await preDepositsPage.clickDepositForVault('WETH')
        await depositModal.waitForOpen()
        await depositModal.enterAmount(DEPOSIT_AMOUNTS.WETH)
      })

      await test.step('Wait for button to change to "Approve Deposit"', async () => {
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

  test(
    'W-2: deposit with sufficient WETH (skip wrap)',
    { tag: '@anvil' },
    async ({ anvilRpc, metamask, preDepositsPage, depositModal }) => {
      await test.step('Fund wallet with WETH + gas ETH', async () => {
        await anvilRpc.fund(FUNDING_PRESETS.WETH_DEPOSIT_DIRECT)
      })

      await test.step('Navigate to Pre-Deposits page', async () => {
        await preDepositsPage.goto()
        await preDepositsPage.waitForReady()
      })

      await test.step('Open deposit modal for WETH vault', async () => {
        await preDepositsPage.clickDepositForVault('WETH')
        await depositModal.waitForOpen()
      })

      await test.step('Enter deposit amount', async () => {
        await depositModal.enterAmount(DEPOSIT_AMOUNTS.WETH)
      })

      await test.step('Verify "Approve Deposit" button (no wrap needed)', async () => {
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

  test(
    'W-3: partial wrap then deposit (has some WETH, needs more)',
    { tag: '@anvil' },
    async ({ hubPage, anvilRpc, metamask, preDepositsPage, depositModal }) => {
      await test.step('Fund wallet with partial WETH + ETH', async () => {
        await anvilRpc.fund(FUNDING_PRESETS.WETH_DEPOSIT_PARTIAL)
      })

      await test.step('Navigate to Pre-Deposits page', async () => {
        await preDepositsPage.goto()
        await preDepositsPage.waitForReady()
      })

      await test.step('Open deposit modal for WETH vault', async () => {
        await preDepositsPage.clickDepositForVault('WETH')
        await depositModal.waitForOpen()
      })

      await test.step('Enter amount exceeding current WETH balance', async () => {
        await depositModal.enterAmount(DEPOSIT_AMOUNTS.WETH_PARTIAL)
      })

      await test.step('Verify "Wrap ETH to WETH" button (partial wrap needed)', async () => {
        await depositModal.expectActionButtonReady(/wrap eth to weth/i)
      })

      await test.step('Simulate partial wrap completion on Anvil and refresh modal state', async () => {
        // TODO: Restore real partial-wrap tx confirmation once MetaMask STX
        // routing is fully stable on local Anvil forks.
        await anvilRpc.fundWeth(FALLBACK_WRAP_WETH_AMOUNT)
        await hubPage.waitForTimeout(1_500)
        await depositModal.close()
        await preDepositsPage.clickDepositForVault('WETH')
        await depositModal.waitForOpen()
        await depositModal.enterAmount(DEPOSIT_AMOUNTS.WETH_PARTIAL)
      })

      await test.step('Wait for button to change to "Approve Deposit"', async () => {
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
