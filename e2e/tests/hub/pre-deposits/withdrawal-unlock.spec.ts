import { TEST_VAULTS } from '@constants/hub/vaults.js'
import { test } from '@fixtures/anvil.fixture.js'
import { CONTRACTS } from '@helpers/anvil-rpc.js'
import { getConnectedAddress } from '@helpers/hub-test-helpers.js'
import { UnlockModalComponent } from '@pages/hub/components/unlock-modal.component.js'
import { PreDepositsPage } from '@pages/hub/pre-deposits.page.js'
import { expect } from '@playwright/test'

/**
 * Withdrawal "Unlock" readiness — wallet + local Anvil forks.
 *
 * These mainnet vaults are already in the WITHDRAWALS state on the fork
 * (inherited from production), so we only need to seed the connected wallet
 * with vault shares to make the deposited balance non-zero. We then drive the
 * unlock modal up to the point where it is submittable, exercising the CTA
 * gating, receiver pre-fill, confirmation checkboxes, and address validation.
 *
 * We intentionally stop short of confirming the on-chain `withdraw`: that path
 * depends on the vault's withdrawal-cooldown gate and (for cross-chain vaults)
 * an async L1->L2 bridge, which are not reliably assertable in a single run.
 */

const ONE_TOKEN = 10n ** 18n

const MAINNET_VAULTS = [
  { ...TEST_VAULTS.WETH, vaultAddress: CONTRACTS.WETH_VAULT },
  { ...TEST_VAULTS.SNT, vaultAddress: CONTRACTS.SNT_VAULT },
] as const

test.describe('Pre-Deposit withdrawal - Unlock modal', () => {
  for (const vault of MAINNET_VAULTS) {
    test(
      `${vault.token}: unlock modal becomes submittable for a funded deposit`,
      { tag: '@anvil' },
      async ({ hubPage, anvilRpc }) => {
        const preDeposits = new PreDepositsPage(hubPage)
        const unlockModal = new UnlockModalComponent(hubPage)

        await test.step('Seed the connected account with vault shares', async () => {
          // Credit the account the Hub actually reads — the connected MetaMask
          // account (the seed's account 0).
          const account = await getConnectedAddress(hubPage)
          await anvilRpc.fundVaultShares(
            vault.vaultAddress,
            ONE_TOKEN,
            anvilRpc.mainnetRpc,
            account,
          )
        })

        await test.step('Open Pre-Deposits page (fresh balance read)', async () => {
          await preDeposits.goto()
          await preDeposits.waitForReady()
        })

        await test.step('Vault card shows a deposit and an enabled Unlock CTA', async () => {
          const card = preDeposits.vaultCard(vault.name)
          await expect(card.getByText(/your deposit/i)).toBeVisible()
          await expect(preDeposits.vaultActionButton(vault.name)).toBeEnabled({
            timeout: 15_000,
          })
        })

        await test.step('Open the unlock modal', async () => {
          await preDeposits.clickUnlock(vault.name)
          await unlockModal.waitForOpen()
        })

        await test.step('Receiver is pre-filled with the connected wallet', async () => {
          await expect(unlockModal.receiverInput).toHaveValue(
            /^0x[0-9a-fA-F]{40}$/,
          )
        })

        await test.step('Submit is gated until both confirmations are checked', async () => {
          await expect(unlockModal.submitButton).toBeDisabled()
          await unlockModal.checkConfirmations()
          await expect(unlockModal.submitButton).toBeEnabled()
        })

        await test.step('Invalid receiver re-disables submit and shows an error', async () => {
          await unlockModal.fillReceiver('not-an-address')
          await unlockModal.expectReceiverError(/valid ethereum address/i)
          await expect(unlockModal.submitButton).toBeDisabled()
        })

        await test.step('Close the modal', async () => {
          await unlockModal.close()
        })
      },
    )
  }

  test(
    'LINEA: unlocking from the wrong chain offers a network switch',
    { tag: '@anvil' },
    async ({ hubPage, anvilRpc }) => {
      const preDeposits = new PreDepositsPage(hubPage)
      const unlockModal = new UnlockModalComponent(hubPage)

      await test.step('Seed the connected account with LINEA vault shares on the Linea fork', async () => {
        const account = await getConnectedAddress(hubPage)
        await anvilRpc.fundVaultShares(
          CONTRACTS.LINEA_VAULT,
          ONE_TOKEN,
          anvilRpc.lineaRpc,
          account,
        )
      })

      await test.step('Open Pre-Deposits page', async () => {
        await preDeposits.goto()
        await preDeposits.waitForReady()
      })

      await test.step('Open the LINEA vault modal (wallet is on mainnet)', async () => {
        await preDeposits.clickUnlock(TEST_VAULTS.LINEA.name)
        await unlockModal.waitForOpen()
      })

      await test.step('Modal prompts to switch to the vault chain', async () => {
        await expect(unlockModal.switchNetworkButton).toBeVisible()
        await expect(unlockModal.submitButton).toHaveCount(0)
      })

      await test.step('Close the modal', async () => {
        await unlockModal.close()
      })
    },
  )
})
