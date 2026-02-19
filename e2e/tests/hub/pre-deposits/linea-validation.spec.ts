import { test } from '@fixtures/anvil.fixture.js'
import { PreDepositsPage } from '@pages/hub/pre-deposits.page.js'
import { PreDepositModalComponent } from '@pages/hub/components/pre-deposit-modal.component.js'
import { BELOW_MIN_AMOUNTS } from '@constants/vaults.js'
import { FUNDING_PRESETS } from '@helpers/anvil-rpc.js'

test.describe('LINEA Vault - Below minimum validation', () => {
  test(
    'L-2: shows below minimum error when deposit amount is below 1 LINEA',
    { tag: '@anvil' },
    async ({ hubPage, anvilRpc }) => {
      await test.step('Fund wallet with LINEA tokens (balance > entered amount)', async () => {
        await anvilRpc.fund(FUNDING_PRESETS.LINEA_BELOW_MIN)
      })

      const preDepositsPage = new PreDepositsPage(hubPage)
      const depositModal = new PreDepositModalComponent(hubPage)

      await test.step('Navigate to Pre-Deposits page', async () => {
        await preDepositsPage.goto()
        await preDepositsPage.waitForReady()
      })

      await test.step('Open deposit modal for LINEA Vault', async () => {
        await preDepositsPage.clickDepositForVault('LINEA')
        await depositModal.waitForOpen()
      })

      await test.step(`Enter amount below minimum (${BELOW_MIN_AMOUNTS.LINEA})`, async () => {
        await depositModal.enterAmount(BELOW_MIN_AMOUNTS.LINEA)
      })

      await test.step('Verify below minimum error message', async () => {
        await depositModal.expectErrorMessageMatching(/below minimum deposit\. min: 1/i)
      })
      
      await test.step('Verify deposit is blocked (switch network required)', async () => {
        await depositModal.expectSwitchNetworkButtonVisible()
      })

      await test.step('Close modal', async () => {
        await depositModal.close()
      })
    },
  )
})
