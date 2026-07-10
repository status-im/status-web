import { WALLET_TEST_PASSWORD } from '@constants/wallet.js'
import { expect, test } from '@fixtures/wallet/wallet-extension.fixture.js'
import { CONTRACTS } from '@helpers/anvil-rpc.js'

/**
 * ETH -> WETH swap under adverse network conditions on the local mainnet fork.
 *
 * Deliberately shallow (the LiFi widget owns the adverse-condition UX): the
 * assertion is that the swap still executes and on-chain state stays
 * consistent. The rich congestion matrix lives in the SEND suite, where the
 * handling is Status-owned. Fee realism holds because the swap's maxFeePerGas
 * comes from the wallet's own estimator reading the fork's fee history (the
 * li.quest mock only pins the gas limit).
 */
const SWAP_AMOUNT = '1'
const ONE_ETH = 10n ** 18n
const GWEI = 10n ** 9n

test.describe('Wallet — swap ETH to WETH under network conditions', () => {
  test.beforeEach(async ({ anvilRpc }) => {
    // Localize the wallet's WETH balance slot (non-archive fork upstream).
    await anvilRpc.fundErc20ViaStorage(CONTRACTS.WETH, 0n, anvilRpc.mainnetRpc)
  })

  test(
    'slow inclusion: swap stays pending and settles once a block is mined',
    { tag: '@wallet-swap' },
    async ({ portfolio, swapDrawer, anvilRpc }) => {
      await anvilRpc.disableAutoMining()
      const ethBefore = await anvilRpc.getEthBalance()

      await portfolio.openAsset('Ethereum', 'ETH')
      await swapDrawer.open(WALLET_TEST_PASSWORD)
      await swapDrawer.selectToToken('WETH')
      await swapDrawer.fillAmount(SWAP_AMOUNT)
      await swapDrawer.review()
      await swapDrawer.start(WALLET_TEST_PASSWORD)

      // Broadcast accepted, but with auto-mine off the tx sits in the mempool:
      // the widget reports it pending and confirmed state is unchanged.
      await expect(swapDrawer.pendingMessage).toBeVisible({ timeout: 30_000 })
      expect(await anvilRpc.getEthBalance()).toBe(ethBefore)
      expect(await anvilRpc.getErc20Balance(CONTRACTS.WETH)).toBe(0n)

      await anvilRpc.mineBlock()
      await swapDrawer.waitForSuccess()

      expect(await anvilRpc.getErc20Balance(CONTRACTS.WETH)).toBe(ONE_ETH)
      const spent = ethBefore - (await anvilRpc.getEthBalance())
      expect(spent).toBeGreaterThanOrEqual(ONE_ETH)
    },
  )

  test(
    'high base fee: swap still executes and pays the elevated gas',
    { tag: '@wallet-swap' },
    async ({ portfolio, swapDrawer, anvilRpc }) => {
      // Raise the fork base fee and mine so fee history reflects it — the
      // wallet's estimator (not the LiFi quote) prices the swap tx.
      await anvilRpc.setNextBlockBaseFee(50n * GWEI)
      await anvilRpc.mineBlock()

      const ethBefore = await anvilRpc.getEthBalance()

      await portfolio.openAsset('Ethereum', 'ETH')
      await swapDrawer.completeSwap('WETH', SWAP_AMOUNT, WALLET_TEST_PASSWORD)

      // Output is unaffected by congestion...
      expect(await anvilRpc.getErc20Balance(CONTRACTS.WETH)).toBe(ONE_ETH)

      // ...but the gas paid is: ~28k gas at 40+ gwei is >0.001 ETH, far above
      // the ~0.00003 ETH baseline at normal fork fees.
      const spent = ethBefore - (await anvilRpc.getEthBalance())
      const gasPaid = spent - ONE_ETH
      expect(gasPaid).toBeGreaterThan(5n * 10n ** 14n) // > 0.0005 ETH
    },
  )
})
