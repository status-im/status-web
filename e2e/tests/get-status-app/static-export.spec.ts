import { expect, test } from '@playwright/test'

test.describe('get.status.app static export', () => {
  test(
    'legal pages render from the exported build',
    { tag: '@get-static' },
    async ({ page }) => {
      await test.step('Terms of Use', async () => {
        const response = await page.goto('/legal/terms-of-use')
        expect(response?.status()).toBe(200)
        await expect(
          page.getByRole('heading', {
            level: 1,
            name: /status website - terms of use/i,
          }),
        ).toBeVisible()
        await expect(
          page.getByText(/acceptance of the website terms of use/i),
        ).toBeVisible()
      })

      await test.step('Privacy Policy', async () => {
        const response = await page.goto('/legal/privacy-policy')
        expect(response?.status()).toBe(200)
        await expect(
          page.getByRole('heading', {
            level: 1,
            name: /status website - privacy policy/i,
          }),
        ).toBeVisible()
      })

      await test.step('Footer legal links resolve', async () => {
        await page.goto('/')
        await page.getByRole('link', { name: /terms of use/i }).click()
        await expect(page).toHaveURL(/\/legal\/terms-of-use\/?$/)
        await expect(
          page.getByRole('heading', {
            level: 1,
            name: /status website - terms of use/i,
          }),
        ).toBeVisible()
      })
    },
  )

  test(
    'unknown routes show the not-found page',
    { tag: '@get-static' },
    async ({ page }) => {
      const response = await page.goto('/this-route-does-not-exist')
      expect(response?.status()).toBe(404)

      await expect(
        page.getByRole('heading', {
          name: /oh no! it looks like you're lost/i,
        }),
      ).toBeVisible()
      await expect(
        page.getByRole('link', { name: /go to status\.app homepage/i }),
      ).toBeVisible()

      await page
        .getByRole('link', { name: /go to status\.app homepage/i })
        .click()
      await expect(page).toHaveURL(/\/$/)
    },
  )

  test(
    'language selector stays on the current page',
    { tag: '@get-static' },
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
          name: /status website - privacy policy/i,
        }),
      ).toBeVisible()
    },
  )
})
