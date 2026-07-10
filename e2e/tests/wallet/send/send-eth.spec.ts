import { WALLET_TEST_PASSWORD } from '@constants/wallet.js'
import { expect, test } from '@fixtures/wallet/wallet-extension.fixture.js'

/**
 * Native-ETH send against the local mainnet fork. Asserts the transaction lands
 * on-chain via the sender's balance delta (the sender is a locally-set account,
 * so it reads without hitting the non-archive fork upstream).
 */
const RECIPIENT = '0x000000000000000000000000000000000000dEaD'
const SEND_AMOUNT = '1'
const ONE_ETH = 10n ** 18n

test.describe('Wallet — send ETH', () => {
  test(
    'sends ETH and it lands on the fork',
    { tag: '@wallet-send' },
    async ({ portfolio, sendModal, anvilRpc }) => {
      // Pre-register the recipient locally so gas estimation (which credits it)
      // and the transfer don't hit the non-archive fork upstream.
      await anvilRpc.setEthBalanceFor(RECIPIENT, 0n)

      const senderBefore = await anvilRpc.getEthBalance()

      await test.step('open ETH detail and send', async () => {
        await portfolio.openAsset('Ethereum', 'ETH')
        await sendModal.completeSend(
          RECIPIENT,
          SEND_AMOUNT,
          WALLET_TEST_PASSWORD,
        )
      })

      await test.step('sender debited by the sent amount + gas', async () => {
        const senderAfter = await anvilRpc.getEthBalance()
        const spent = senderBefore - senderAfter
        expect(spent).toBeGreaterThanOrEqual(BigInt(SEND_AMOUNT) * ONE_ETH)
        expect(spent).toBeLessThan((BigInt(SEND_AMOUNT) * ONE_ETH * 11n) / 10n)
      })
    },
  )
})
