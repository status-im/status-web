import { DEPOSIT_AMOUNTS, TEST_VAULTS } from '@constants/hub/vaults.js'
import { test } from '@fixtures/anvil.fixture.js'
import { CONTRACTS, FUNDING_PRESETS } from '@helpers/anvil-rpc.js'
import { PreDepositModalComponent } from '@pages/hub/components/pre-deposit-modal.component.js'
import { PreDepositsPage } from '@pages/hub/pre-deposits.page.js'

const GUSD_TOKENS = [
  {
    id: 'G-1',
    label: 'Tether USD, USDT',
    symbol: 'USDT',
    preset: 'GUSD_USDT_DEPOSIT' as const,
    amount: DEPOSIT_AMOUNTS.GUSD_USDT,
    contract: CONTRACTS.USDT,
  },
  {
    id: 'G-2',
    label: 'USD Coin, USDC',
    symbol: 'USDC',
    preset: 'GUSD_USDC_DEPOSIT' as const,
    amount: DEPOSIT_AMOUNTS.GUSD_USDC,
    contract: CONTRACTS.USDC,
  },
  {
    id: 'G-3',
    label: 'USDS Stablecoin, USDS',
    symbol: 'USDS',
    preset: 'GUSD_USDS_DEPOSIT' as const,
    amount: DEPOSIT_AMOUNTS.GUSD_USDS,
    contract: CONTRACTS.USDS,
  },
]

test.describe('GUSD Vault - Happy path deposits', () => {
  for (const token of GUSD_TOKENS) {
    test(
      `${token.id}: deposit via ${token.symbol}`,
      { tag: '@anvil' },
      async ({ hubPage, anvilRpc, metamask }) => {
        await test.step(`Fund wallet with ${token.symbol}`, async () => {
          await anvilRpc.fund(FUNDING_PRESETS[token.preset])
        })

        await test.step('Reset token allowance for GUSD vault', async () => {
          await anvilRpc.resetAllowance(
            token.contract,
            TEST_VAULTS.GUSD.address,
          )
        })

        const preDepositsPage = new PreDepositsPage(hubPage)
        const depositModal = new PreDepositModalComponent(hubPage)

        await test.step('Navigate to Pre-Deposits page', async () => {
          await preDepositsPage.goto()
          await preDepositsPage.waitForReady()
        })

        await test.step('Dismiss any pending MetaMask network popups', async () => {
          await metamask.dismissPendingAddNetwork()
          await metamask.dismissPendingAddNetwork()
        })

        await test.step('Open deposit modal for GUSD vault', async () => {
          await preDepositsPage.clickDepositForVault('GUSD')
          await depositModal.waitForOpen()
        })

        // Default selected stablecoin is USDT — only select if different
        if (token.symbol !== 'USDT') {
          await test.step(`Select ${token.symbol} from dropdown`, async () => {
            await depositModal.selectToken(token.label)
          })
        }

        await test.step('Enter deposit amount', async () => {
          await depositModal.enterAmount(token.amount)
        })

        await test.step('Verify "Approve Deposit" button', async () => {
          await depositModal.expectActionButtonReady(/approve deposit/i)
        })

        await test.step('Click "Approve Deposit" and approve token spend in MetaMask', async () => {
          await depositModal.clickActionButton()
          await metamask.approveTokenSpend()
        })

        await test.step('Approve deposit transaction in MetaMask', async () => {
          await metamask.approveTransaction()
        })

        await test.step('Verify deposit success (modal closes)', async () => {
          await depositModal.expectModalClosed()
        })
      },
    )
  }
})
