import { WALLET_TEST_PASSWORD } from '@constants/wallet.js'
import { expect, test } from '@fixtures/wallet/wallet-extension.fixture.js'
import { CONTRACTS } from '@helpers/anvil-rpc.js'

/**
 * ETH -> WETH swap through the exchange drawer under normal conditions.
 *
 * Quotes/routes come from the li.quest mock; the returned calldata is a real
 * WETH deposit, so execution flows genuinely through Status's connector ->
 * signer -> background SW -> broadcast -> Anvil fork. Assertions are on-chain:
 * ETH debited by the swapped amount (+ gas), WETH credited exactly 1:1.
 */
const SWAP_AMOUNT = '1'
const ONE_ETH = 10n ** 18n

test.describe('Wallet — swap ETH to WETH', () => {
  test(
    'swaps via the exchange drawer and the output lands on the fork',
    { tag: '@wallet-swap' },
    async ({ portfolio, swapDrawer, anvilRpc }) => {
      // Pre-register the wallet's WETH balance slot locally so both the
      // before-read and the widget's balance polling stay off the non-archive
      // fork upstream.
      await anvilRpc.fundErc20ViaStorage(
        CONTRACTS.WETH,
        0n,
        anvilRpc.mainnetRpc,
      )

      const ethBefore = await anvilRpc.getEthBalance()
      const wethBefore = await anvilRpc.getErc20Balance(CONTRACTS.WETH)

      await test.step('open ETH detail and swap', async () => {
        await portfolio.openAsset('Ethereum', 'ETH')
        await swapDrawer.completeSwap('WETH', SWAP_AMOUNT, WALLET_TEST_PASSWORD)
      })

      await test.step('on-chain balances are consistent', async () => {
        const spent = ethBefore - (await anvilRpc.getEthBalance())
        expect(spent).toBeGreaterThanOrEqual(BigInt(SWAP_AMOUNT) * ONE_ETH)
        expect(spent).toBeLessThan((BigInt(SWAP_AMOUNT) * ONE_ETH * 11n) / 10n)

        const wethGained =
          (await anvilRpc.getErc20Balance(CONTRACTS.WETH)) - wethBefore
        expect(wethGained).toBe(BigInt(SWAP_AMOUNT) * ONE_ETH)
      })
    },
  )
})
