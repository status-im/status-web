import { WALLET_TEST_PASSWORD } from '@constants/wallet.js'
import { gasFeesForMaxFee } from '@fixtures/wallet/status-api-mocks.js'
import { expect, test } from '@fixtures/wallet/wallet-extension.fixture.js'

/**
 * Send ETH under adverse network conditions, driven on the local mainnet fork.
 * These exercise Status-owned handling in the send flow (fee estimation, the
 * gas-shifted confirm step) that the swap flow delegates to LiFi.
 *
 * The wallet's fee estimator reads eth_feeHistory / eth_maxPriorityFeePerGas from
 * the fork, so base-fee changes here are actually reflected in what it quotes.
 */
const RECIPIENT = '0x000000000000000000000000000000000000dEaD'
const AMOUNT = '1'
const ONE_ETH = 10n ** 18n
const GWEI = 10n ** 9n

test.describe('Wallet — send ETH under network conditions', () => {
  test.beforeEach(async ({ anvilRpc }) => {
    // Pre-register the recipient locally (non-archive fork upstream).
    await anvilRpc.setEthBalanceFor(RECIPIENT, 0n)
  })

  test(
    'slow inclusion: broadcast succeeds, settles only once a block is mined',
    { tag: '@wallet-send' },
    async ({ portfolio, sendModal, anvilRpc, dataSeam }) => {
      // Fee isn't what this test asserts (it's about inclusion timing); pin it so
      // a slow/variable real getFeeRate can't flake the gas estimate. 500 gwei
      // comfortably exceeds any fork base fee, so the broadcast is accepted.
      dataSeam.setFeeRate(gasFeesForMaxFee(500))
      await anvilRpc.disableAutoMining()
      const before = await anvilRpc.getEthBalance()

      await portfolio.openAsset('Ethereum', 'ETH')
      await sendModal.completeSend(RECIPIENT, AMOUNT, WALLET_TEST_PASSWORD)

      // Broadcast accepted (success toast) but the tx is still pending — the
      // sender's confirmed balance is unchanged.
      expect(await anvilRpc.getEthBalance()).toBe(before)

      await anvilRpc.mineBlock()
      await expect
        .poll(
          async () => before - (await anvilRpc.getEthBalance()) >= ONE_ETH,
          {
            timeout: 15_000,
          },
        )
        .toBe(true)
    },
  )

  test(
    'high base fee: the wallet quotes and pays an elevated gas fee',
    { tag: '@wallet-send' },
    async ({ portfolio, sendModal, anvilRpc }) => {
      // Raise the fork base fee and mine so fee history reflects it.
      await anvilRpc.setNextBlockBaseFee(50n * GWEI)
      await anvilRpc.mineBlock()

      const before = await anvilRpc.getEthBalance()
      await portfolio.openAsset('Ethereum', 'ETH')
      await sendModal.prepareSend(RECIPIENT, AMOUNT)

      // 21000 gas * ~50+ gwei is ~0.001+ ETH, far above the ~0.00005 baseline.
      expect(await sendModal.maxFeesEth()).toBeGreaterThan(0.0005)

      await sendModal.submitAndUnlock(WALLET_TEST_PASSWORD)
      await sendModal.waitForSuccess()

      const spent = before - (await anvilRpc.getEthBalance())
      expect(spent).toBeGreaterThan(ONE_ETH) // 1 ETH sent + elevated gas
    },
  )

  test(
    'gas price spikes mid-flow: the confirm-with-new-gas step fires',
    { tag: '@wallet-send' },
    async ({ portfolio, sendModal, anvilRpc, dataSeam }) => {
      // Drive the gas fee deterministically through the seam: a low quote is
      // cached at estimate time, then bumped >30% right before the re-check. This
      // avoids racing the real fork base fee against useGasFees' 12s refetch
      // interval (which can refresh the cache to the high fee and mask the shift).
      dataSeam.setFeeRate(gasFeesForMaxFee(3)) // ~3 gwei

      const before = await anvilRpc.getEthBalance()
      await portfolio.openAsset('Ethereum', 'ETH')
      await sendModal.prepareSend(RECIPIENT, AMOUNT) // caches the low quote

      await sendModal.submit()
      await sendModal.waitForPasswordPrompt()
      // Bump the quote far above the cached one while the password prompt blocks
      // signing, so the gas re-check sees the jump. 500 gwei also comfortably
      // exceeds any realistic fork base fee, so the broadcast is accepted.
      dataSeam.setFeeRate(gasFeesForMaxFee(500))
      await sendModal.enterPassword(WALLET_TEST_PASSWORD)

      // Status detects the shift and requires an explicit confirmation.
      await expect(sendModal.gasShiftedButton()).toBeVisible({
        timeout: 15_000,
      })
      await sendModal.gasShiftedButton().click()
      await sendModal.passwordPromptIfShown(WALLET_TEST_PASSWORD)

      // On success the modal closes; assert the send actually landed on-chain.
      await sendModal.waitForSuccess()
      await expect
        .poll(
          async () => before - (await anvilRpc.getEthBalance()) >= ONE_ETH,
          {
            timeout: 15_000,
          },
        )
        .toBe(true)
    },
  )
})
