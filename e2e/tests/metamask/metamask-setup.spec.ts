import { test, expect } from '../../src/fixtures/metamask.fixture.js';
import { TEST_TIMEOUTS } from '../../src/constants/timeouts.js';

test.describe('MetaMask extension', () => {
  test('extension loads and shows onboarding', { tag: '@wallet' }, async ({
    extensionId,
    extensionContext,
  }) => {
    await test.step('Verify extension ID is resolved', () => {
      expect(extensionId).toBeTruthy();
    });

    await test.step('Open onboarding page and verify UI', async () => {
      const page = await extensionContext.newPage();
      await page.goto(`chrome-extension://${extensionId}/home.html#onboarding/welcome`);
      await page.waitForLoadState('domcontentloaded');

      await expect(page.getByRole('button', { name: /create a new wallet/i })).toBeVisible({
        timeout: TEST_TIMEOUTS.ONBOARDING_ELEMENT,
      });
      await expect(page.getByRole('button', { name: /i have an existing wallet/i })).toBeVisible();
    });
  });
});