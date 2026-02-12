import { test, expect } from '../../src/fixtures/base.fixture.js';
import { TEST_VAULTS } from '../../src/constants/vaults.js';

test.describe('Pre-Deposits page', () => {
  test('displays vaults after navigating from sidebar', { tag: '@smoke' }, async ({
    page,
    sidebar,
    preDepositsPage,
  }) => {
    await test.step('Open home page', async () => {
      await page.goto('/');
    });

    await test.step('Navigate to Pre-Deposits via sidebar', async () => {
      await sidebar.navigateToPreDeposits();
    });

    await test.step('Verify page loaded', async () => {
      await preDepositsPage.waitForReady();
    });

    await test.step('Verify all vaults are displayed', async () => {
      await expect(preDepositsPage.vaultHeadings).toHaveCount(Object.keys(TEST_VAULTS).length);
    });

    await test.step('Verify each vault name', async () => {
      const expectedNames = Object.values(TEST_VAULTS).map(v => v.name);
      for (const name of expectedNames) {
        await expect(
          page.getByRole('heading', { name, level: 3 }),
        ).toBeVisible();
      }
    });
  });
});
