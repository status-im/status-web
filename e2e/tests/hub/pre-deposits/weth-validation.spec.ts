import { test } from '@fixtures/anvil.fixture.js'
import { PreDepositsPage } from '@pages/hub/pre-deposits.page.js'
import { PreDepositModalComponent } from '@pages/hub/components/pre-deposit-modal.component.js'
import { BELOW_MIN_AMOUNTS } from '@constants/vaults.js'
import { FUNDING_PRESETS } from '@helpers/anvil-rpc.js'

test.describe('WETH Vault - Below minimum validation', () => {
  test(
    'W-4: shows below minimum error when deposit amount is below 0.001 WETH',
    { tag: '@anvil' },
    async ({ hubPage, anvilRpc }) => {
      await test.step('Fund wallet with ETH (balance > entered amount)', async () => {
        await anvilRpc.fund(FUNDING_PRESETS.WETH_BELOW_MIN)
      })

      const preDepositsPage = new PreDepositsPage(hubPage)
      const depositModal = new PreDepositModalComponent(hubPage)

      await test.step('Navigate to Pre-Deposits page', async () => {
        await preDepositsPage.goto()
        await preDepositsPage.waitForReady()
      })

      await test.step('Open deposit modal for WETH vault', async () => {
        await preDepositsPage.clickDepositForVault('WETH')
        await depositModal.waitForOpen()
      })

      await test.step(`Enter amount below minimum (${BELOW_MIN_AMOUNTS.WETH})`, async () => {
        await depositModal.enterAmount(BELOW_MIN_AMOUNTS.WETH)
      })

      await test.step('Verify below minimum error message', async () => {
        await depositModal.expectErrorMessageMatching(/below minimum deposit\. min: 0\.00/i)
      })

      await test.step('Verify action button is disabled', async () => {
        await depositModal.expectActionButtonDisabled()
      })

      await test.step('Close modal', async () => {
        await depositModal.close()
      })
    },
  )
})