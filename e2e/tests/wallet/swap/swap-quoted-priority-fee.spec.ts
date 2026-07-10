import { WALLET_TEST_PASSWORD } from '@constants/wallet.js'
import { expect, test } from '@fixtures/wallet/wallet-extension.fixture.js'
import { CONTRACTS } from '@helpers/anvil-rpc.js'

/**
 * Regression: swap with a LiFi quote that carries its own priority fee.
 *
 * Real li.quest stepTransaction responses include a quote-time
 * `maxPriorityFeePerGas`, and @lifi/sdk forwards it to the wallet while
 * stripping gasPrice/maxFeePerGas. The wallet's signer must honor the quoted
 * priority (LiFi owns the swap fee estimate) and build a maxFeePerGas ceiling
 * ABOVE it — filling the missing ceiling from its own estimator verbatim used
 * to sign an invalid EIP-1559 tx (priority > maxFee) whenever the quote was
 * priced under hotter conditions than the current base fee, and the node
 * rejected the broadcast ("max priority fee per gas higher than max fee per
 * gas") — a routine mainnet failure (low base fee + quote from a gas spike).
 *
 * Reproduced deterministically here: calm fork fees (base 1 gwei -> internal
 * ceiling ~3 gwei) + a 50 gwei quoted priority. The swap must still execute
 * as a valid tx that pays the quoted priority.
 */
const SWAP_AMOUNT = '1'
const ONE_ETH = 10n ** 18n
const GWEI = 10n ** 9n

test.describe('Wallet — swap with quote-time LiFi priority fee', () => {
  test.beforeEach(async ({ anvilRpc }) => {
    // Localize the wallet's WETH balance slot (non-archive fork upstream).
    await anvilRpc.fundErc20ViaStorage(CONTRACTS.WETH, 0n, anvilRpc.mainnetRpc)
  })

  test(
    'quoted priority fee above the wallet max-fee ceiling still yields a valid tx',
    { tag: '@wallet-swap' },
    async ({ portfolio, swapDrawer, anvilRpc, lifiMock }) => {
      // Calm fees on the fork: base 1 gwei. The wallet's own estimate would
      // put the maxFeePerGas ceiling at 2*base + its priority (~3 gwei).
      await anvilRpc.setNextBlockBaseFee(GWEI)
      await anvilRpc.mineBlock()

      // The quote was priced under different (spiked) conditions: 50 gwei
      // priority — far above the wallet's internal ceiling.
      const quotedPriority = 50n * GWEI
      lifiMock.setQuotedPriorityFee(quotedPriority)

      const ethBefore = await anvilRpc.getEthBalance()

      await portfolio.openAsset('Ethereum', 'ETH')
      await swapDrawer.completeSwap('WETH', SWAP_AMOUNT, WALLET_TEST_PASSWORD)

      // The swap executes as a valid tx regardless of the quoted priority:
      // WETH credited 1:1, ETH debited by amount + gas.
      expect(await anvilRpc.getErc20Balance(CONTRACTS.WETH)).toBe(ONE_ETH)
      const spent = ethBefore - (await anvilRpc.getEthBalance())
      expect(spent).toBeGreaterThanOrEqual(ONE_ETH)

      // LiFi's estimation is actually used: the tx pays the quoted 50 gwei
      // priority on top of the ~1 gwei base (~28k gas -> >0.001 ETH), instead
      // of the wallet's ~3 gwei internal quote (~0.0001 ETH).
      const gasPaid = spent - ONE_ETH
      const minExpectedGasPaid = 20_000n * quotedPriority
      expect(gasPaid).toBeGreaterThan(minExpectedGasPaid)
    },
  )
})
