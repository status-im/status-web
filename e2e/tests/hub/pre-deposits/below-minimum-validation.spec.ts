import { BELOW_MIN_AMOUNTS } from '@constants/hub/vaults.js'
import { test } from '@fixtures/anvil.fixture.js'
import { FUNDING_PRESETS } from '@helpers/anvil-rpc.js'

import type { FundingPreset } from '@helpers/anvil-rpc.js'

const BELOW_MIN_TESTS: Array<{
  id: string
  vault: 'WETH' | 'SNT' | 'LINEA'
  preset: FundingPreset
  amount: string
  errorPattern: RegExp
  /** LINEA vault shows "Switch Network" instead of a disabled action button */
  expectSwitchNetwork?: boolean
}> = [
  {
    id: 'W-4',
    vault: 'WETH',
    preset: FUNDING_PRESETS.WETH_BELOW_MIN,
    amount: BELOW_MIN_AMOUNTS.WETH,
    errorPattern: /below minimum deposit\. min: 0\.00/i,
  },
  {
    id: 'S-2',
    vault: 'SNT',
    preset: FUNDING_PRESETS.SNT_BELOW_MIN,
    amount: BELOW_MIN_AMOUNTS.SNT,
    errorPattern: /below minimum deposit\. min: 1/i,
  },
  {
    id: 'L-2',
    vault: 'LINEA',
    preset: FUNDING_PRESETS.LINEA_BELOW_MIN,
    amount: BELOW_MIN_AMOUNTS.LINEA,
    errorPattern: /below minimum deposit\. min: 1/i,
    expectSwitchNetwork: true,
  },
]

test.describe('Below minimum deposit validation', () => {
  for (const tc of BELOW_MIN_TESTS) {
    test(
      `${tc.id}: ${tc.vault} — shows below minimum error (amount: ${tc.amount})`,
      { tag: '@anvil' },
      async ({ anvilRpc, preDepositsPage, depositModal }) => {
        await test.step('Fund wallet', async () => {
          await anvilRpc.fund(tc.preset)
        })

        await test.step('Navigate to Pre-Deposits page', async () => {
          await preDepositsPage.goto()
          await preDepositsPage.waitForReady()
        })

        await test.step(`Open deposit modal for ${tc.vault} Vault`, async () => {
          await preDepositsPage.clickDepositForVault(tc.vault)
          await depositModal.waitForOpen()
        })

        await test.step(`Enter amount below minimum (${tc.amount})`, async () => {
          await depositModal.enterAmount(tc.amount)
        })

        await test.step('Verify below minimum error message', async () => {
          await depositModal.expectErrorMessageMatching(tc.errorPattern)
        })

        await test.step('Verify action is blocked', async () => {
          if (tc.expectSwitchNetwork) {
            await depositModal.expectSwitchNetworkButtonVisible()
          } else {
            await depositModal.expectActionButtonDisabled()
          }
        })

        await test.step('Close modal', async () => {
          await depositModal.close()
        })
      },
    )
  }
})
