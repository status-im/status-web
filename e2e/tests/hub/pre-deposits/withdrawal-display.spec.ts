import { TEST_VAULTS } from '@constants/hub/vaults.js'
import { HUB_TIMEOUTS } from '@constants/timeouts.js'
import { expect, test } from '@fixtures/base.fixture.js'

/**
 * Withdrawal-mode display checks for the (now withdrawal-only) Pre-Deposits
 * page. No wallet required — verifies the page surfaces the right withdrawal
 * affordances for a disconnected visitor.
 */
test.describe('Pre-Deposits withdrawal page', () => {
  test.beforeEach(async ({ preDepositsPage }) => {
    await preDepositsPage.goto()
    await preDepositsPage.waitForReady()
  })

  test(
    'renders all withdrawal vault cards and TVL',
    { tag: '@smoke' },
    async ({ page, preDepositsPage }) => {
      await test.step('All vault cards are displayed', async () => {
        await expect(preDepositsPage.vaultHeadings).toHaveCount(
          Object.keys(TEST_VAULTS).length,
        )
        for (const { name } of Object.values(TEST_VAULTS)) {
          await expect(
            page.getByRole('heading', { name, level: 3, exact: true }),
          ).toBeVisible()
        }
      })

      await test.step('Total Value Locked is shown', async () => {
        await expect(
          page.getByText(/total value locked/i).first(),
        ).toBeVisible()
      })
    },
  )

  test(
    'GUSD vault links out to the external claim app',
    { tag: '@smoke' },
    async ({ preDepositsPage }) => {
      const claimLink = preDepositsPage.vaultExternalClaimLink(
        TEST_VAULTS.GUSD.name,
      )

      await expect(claimLink).toBeVisible()
      await expect(claimLink).toHaveText(/claim on the gusd app/i)
      await expect(claimLink).toHaveAttribute(
        'href',
        'https://app.generic.money/',
      )
      await expect(claimLink).toHaveAttribute('target', '_blank')
    },
  )

  test(
    'in-app vaults expose a withdrawal CTA',
    { tag: '@smoke' },
    async ({ preDepositsPage }) => {
      // WETH/SNT/LINEA are withdrawal-enabled and are in the WITHDRAWALS state
      // on-chain, so the CTA resolves to "Unlock" (cross-chain) or "Claim"
      // (Linea). Disconnected, the button is present but disabled until a
      // wallet with a deposited balance connects.
      const wethCta = preDepositsPage.vaultActionButton(TEST_VAULTS.WETH.name)
      await expect(wethCta).toBeVisible()
      await expect(wethCta).toHaveText(/unlock|claim|coming soon/i, {
        timeout: HUB_TIMEOUTS.PAGE_READY,
      })
    },
  )

  test(
    'learn-more links to the withdrawal timeline announcement',
    { tag: '@smoke' },
    async ({ preDepositsPage }) => {
      await expect(preDepositsPage.learnMoreLink).toHaveAttribute(
        'href',
        /pre-deposit-vaults-withdrawal-timeline/,
      )
    },
  )
})
