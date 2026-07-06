import { CHAIN_ID_LINEA } from '@constants/chain-ids.js'
import { TEST_VAULTS } from '@constants/hub/vaults.js'
import { test } from '@fixtures/anvil.fixture.js'
import { CONTRACTS } from '@helpers/anvil-rpc.js'
import {
  getConnectedAddress,
  waitForWalletChain,
} from '@helpers/hub-test-helpers.js'
import { UnlockModalComponent } from '@pages/hub/components/unlock-modal.component.js'
import { PreDepositsPage } from '@pages/hub/pre-deposits.page.js'
import { expect } from '@playwright/test'

/**
 * On-chain withdrawal execution — wallet + local Anvil forks.
 *
 * Unlike the modal-readiness specs, these submit the real `withdraw`
 * transaction through MetaMask and assert the resulting on-chain state on the
 * fork:
 *
 *  - Mainnet vaults (WETH/SNT) are cross-chain: `withdraw` burns the owner's
 *    shares and initiates the L1->L2 bridge, so the receiver is NOT credited on
 *    L1 and the card moves to "Bridging". We assert the L1 leg (shares -> 0).
 *  - The LINEA vault is same-chain: `withdraw` burns shares and delivers the
 *    underlying to the receiver on Linea in a single step, so we assert the
 *    full outcome (shares -> 0 and the receiver credited).
 *
 * The test wallet already holds real vault shares on the fork (inherited from
 * production). Do not overwrite them with `fundVaultShares` — storage-seeded
 * balances (especially WETH) make `withdraw` revert even though `balanceOf`
 * reads non-zero. The WITHDRAWALS state and cooldown are satisfied on the
 * fork, so the transaction mines successfully.
 *
 * LINEA runs first: mainnet unlocks can leave MetaMask in a state that makes
 * the Linea network switch flaky when it runs last.
 *
 * These submit real transactions, so they need freshly-started forks: each test
 * gets a clean MetaMask (nonce 0) and the fixture reverts the fork to base, so
 * the two stay in sync. `pnpm test:anvil` / `test:all` / CI start the forks
 * fresh; re-running on already-used forks can desync the nonce.
 */

const MAINNET_VAULTS = [
  { ...TEST_VAULTS.WETH, vaultAddress: CONTRACTS.WETH_VAULT },
  { ...TEST_VAULTS.SNT, vaultAddress: CONTRACTS.SNT_VAULT },
] as const

test.describe('Pre-Deposit withdrawal - on-chain execution', () => {
  test.describe.configure({ mode: 'serial' })

  test(
    'LINEA: same-chain claim burns shares and credits the receiver',
    { tag: '@anvil', timeout: 240_000 },
    async ({ hubPage, metamask, anvilRpc }) => {
      test.setTimeout(300_000)

      const preDeposits = new PreDepositsPage(hubPage)
      const unlockModal = new UnlockModalComponent(hubPage)
      const lineaRpc = anvilRpc.lineaRpc
      let account = ''

      await test.step('Connected account has LINEA vault shares on the fork', async () => {
        account = await getConnectedAddress(hubPage)
        expect(
          await anvilRpc.getErc20Balance(
            CONTRACTS.LINEA_VAULT,
            lineaRpc,
            account,
          ),
        ).toBeGreaterThan(0n)
      })

      await test.step('Open Pre-Deposits with an enabled Unlock CTA', async () => {
        await preDeposits.goto()
        await preDeposits.waitForReady()
        await expect(
          preDeposits.vaultActionButton(TEST_VAULTS.LINEA.name),
        ).toBeEnabled({ timeout: 15_000 })
      })

      const receiverBalanceBefore = await anvilRpc.getErc20Balance(
        CONTRACTS.LINEA,
        lineaRpc,
        account,
      )

      await test.step('Open the modal and switch the wallet to Linea', async () => {
        await metamask.dismissPendingAddNetwork()
        await preDeposits.clickUnlock(TEST_VAULTS.LINEA.name)
        await unlockModal.waitForOpen()
        await expect(unlockModal.switchNetworkButton).toBeVisible()
        await unlockModal.switchNetworkButton.click()
        // Linea may auto-switch (well-known) or prompt; approve if a popup shows.
        await metamask.switchNetwork().catch(() => {})
        await waitForWalletChain(hubPage, CHAIN_ID_LINEA)
        await expect(unlockModal.submitButton).toBeVisible({ timeout: 20_000 })
      })

      await test.step('Confirm and submit the claim', async () => {
        await metamask.dismissPendingAddNetwork()
        await unlockModal.checkConfirmations()
        await expect(unlockModal.submitButton).toBeEnabled()
        await unlockModal.submitButton.click()

        await metamask.approveTransaction(180_000)

        await anvilRpc.waitForSharesBurned(
          CONTRACTS.LINEA_VAULT,
          account,
          lineaRpc,
          180_000,
        )
      })

      await test.step('Shares are burned on-chain (shares -> 0)', async () => {
        expect(
          await anvilRpc.getErc20Balance(
            CONTRACTS.LINEA_VAULT,
            lineaRpc,
            account,
          ),
        ).toBe(0n)
      })

      await test.step('Receiver is credited with the underlying on Linea', async () => {
        const receiverBalanceAfter = await anvilRpc.getErc20Balance(
          CONTRACTS.LINEA,
          lineaRpc,
          account,
        )
        const delivered = receiverBalanceAfter - receiverBalanceBefore
        expect(delivered).toBeGreaterThan(0n)
      })
    },
  )

  for (const vault of MAINNET_VAULTS) {
    test(
      `${vault.token}: unlock burns the deposit and starts bridging`,
      { tag: '@anvil' },
      async ({ hubPage, metamask, anvilRpc }) => {
        const preDeposits = new PreDepositsPage(hubPage)
        const unlockModal = new UnlockModalComponent(hubPage)
        let account = ''

        await test.step('Connected account has vault shares on the fork', async () => {
          account = await getConnectedAddress(hubPage)
          expect(
            await anvilRpc.getErc20Balance(
              vault.vaultAddress,
              anvilRpc.mainnetRpc,
              account,
            ),
          ).toBeGreaterThan(0n)
        })

        await test.step('Open Pre-Deposits with an enabled Unlock CTA', async () => {
          await preDeposits.goto()
          await preDeposits.waitForReady()
          await expect(preDeposits.vaultActionButton(vault.name)).toBeEnabled({
            timeout: 15_000,
          })
        })

        await test.step('Confirm and submit the unlock', async () => {
          await preDeposits.clickUnlock(vault.name)
          await unlockModal.waitForOpen()
          await unlockModal.checkConfirmations()
          await expect(unlockModal.submitButton).toBeEnabled()
          const nonceBefore = await anvilRpc.getTransactionCount(
            account,
            anvilRpc.mainnetRpc,
          )
          await unlockModal.submitButton.click()

          await metamask.approveTransaction()

          await anvilRpc.waitForAccountTransaction(
            account,
            anvilRpc.mainnetRpc,
            nonceBefore,
          )
          await anvilRpc.mineBlock()
        })

        await test.step('Deposit is burned on-chain (shares -> 0)', async () => {
          await anvilRpc.waitForSharesBurned(
            vault.vaultAddress,
            account,
            anvilRpc.mainnetRpc,
            30_000,
          )
        })

        await test.step('Card reflects the bridging state', async () => {
          await expect(preDeposits.vaultActionButton(vault.name)).toHaveText(
            /bridging/i,
            { timeout: 15_000 },
          )
        })
      },
    )
  }
})
