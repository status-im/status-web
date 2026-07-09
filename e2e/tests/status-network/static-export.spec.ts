import { expect, test } from '@playwright/test'

test.describe('status.network static export', () => {
  test(
    'legal pages render from the exported build',
    { tag: '@status-network-static' },
    async ({ page }) => {
      await test.step('Terms of Use', async () => {
        const response = await page.goto('/legal/terms-of-use')
        expect(response?.status()).toBe(200)
        await expect(
          page.getByRole('heading', {
            level: 1,
            name: /status network - website terms of use/i,
          }),
        ).toBeVisible()
        await expect(page.getByText(/who we are/i)).toBeVisible()
      })

      await test.step('Privacy Policy', async () => {
        const response = await page.goto('/legal/privacy-policy')
        expect(response?.status()).toBe(200)
        await expect(
          page.getByRole('heading', {
            level: 1,
            name: /status network - website privacy policy/i,
          }),
        ).toBeVisible()
      })

      await test.step('Footer legal links resolve', async () => {
        await page.goto('/')
        await page.getByRole('link', { name: /^terms of use$/i }).click()
        await expect(page).toHaveURL(/\/legal\/terms-of-use\/?$/)
        await expect(
          page.getByRole('heading', {
            level: 1,
            name: /status network - website terms of use/i,
          }),
        ).toBeVisible()
      })
    },
  )

  test(
    'unknown routes show the not-found page',
    { tag: '@status-network-static' },
    async ({ page }) => {
      const response = await page.goto('/this-route-does-not-exist')
      expect(response?.status()).toBe(404)

      await expect(
        page.getByRole('heading', {
          name: /this is not the page you're looking for/i,
        }),
      ).toBeVisible()
      await expect(
        page.getByRole('link', { name: /take me home/i }),
      ).toBeVisible()

      await page.getByRole('link', { name: /take me home/i }).click()
      await expect(page).toHaveURL(/\/$/)
    },
  )

  test(
    'language selector stays on the current page',
    { tag: '@status-network-static' },
    async ({ page }) => {
      await page.goto('/legal/privacy-policy')

      const selector = page.getByRole('combobox').last()
      await expect(selector).toBeVisible()
      await expect(selector).toContainText('EN')

      await selector.click()
      await expect(
        page.getByRole('option', { name: /english \(en\)/i }),
      ).toBeVisible()

      await page.getByRole('option', { name: /english \(en\)/i }).click()

      await expect(page).toHaveURL(/\/legal\/privacy-policy\/?$/)
      await expect(
        page.getByRole('heading', {
          level: 1,
          name: /status network - website privacy policy/i,
        }),
      ).toBeVisible()
    },
  )
})
