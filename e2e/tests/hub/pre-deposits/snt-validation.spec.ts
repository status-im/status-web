import { test } from '@fixtures/anvil.fixture.js'
import { PreDepositsPage } from '@pages/hub/pre-deposits.page.js'
import { PreDepositModalComponent } from '@pages/hub/components/pre-deposit-modal.component.js'
import { BELOW_MIN_AMOUNTS } from '@constants/vaults.js'
import { FUNDING_PRESETS } from '@helpers/anvil-rpc.js'

test.describe('SNT Vault - Below minimum validation', () => {
  test(
    'S-2: shows below minimum error when deposit amount is below 1 SNT',
    { tag: '@anvil' },
    async ({ hubPage, anvilRpc }) => {
      await test.step('Fund wallet with SNT (balance > entered amount)', async () => {
        await anvilRpc.fund(FUNDING_PRESETS.SNT_BELOW_MIN)
      })

      const preDepositsPage = new PreDepositsPage(hubPage)
      const depositModal = new PreDepositModalComponent(hubPage)

      await test.step('Navigate to Pre-Deposits page', async () => {
        await preDepositsPage.goto()
        await preDepositsPage.waitForReady()
      })

      await test.step('Open deposit modal for SNT Vault', async () => {
        await preDepositsPage.clickDepositForVault('SNT')
        await depositModal.waitForOpen()
      })

      await test.step(`Enter amount below minimum (${BELOW_MIN_AMOUNTS.SNT})`, async () => {
        await depositModal.enterAmount(BELOW_MIN_AMOUNTS.SNT)
      })

      await test.step('Verify below minimum error message', async () => {
        await depositModal.expectErrorMessageMatching(/below minimum deposit\. min: 1/i)
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