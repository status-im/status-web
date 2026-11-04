import { expect, test } from '@fixtures/site.fixture.js'

test.describe('status.app help centre and specs', () => {
  test(
    'a help category leads to an article',
    { tag: '@status-app' },
    async ({ page }) => {
      await page.goto('/help')
      await page.locator('a[href="/help/getting-started"]').first().click()
      await expect(page).toHaveURL(/\/help\/getting-started\/?$/)
      await expect(page.locator('h1').first()).toHaveText(/\S/)

      const article = page
        .locator('a[href^="/help/getting-started/"]')
        .filter({ visible: true })
        .first()
      const href = await article.getAttribute('href')
      await article.click()
      await expect(page).toHaveURL(new RegExp(`${href}/?$`))
      await expect(page.locator('h1').first()).toHaveText(/\S/)
    },
  )

  test(
    'help search returns articles',
    { tag: '@status-app' },
    async ({ page }) => {
      await page.goto('/help')
      await page.getByRole('button', { name: /search/i }).click()

      const dialog = page.getByRole('dialog')
      await dialog
        .getByRole('combobox')
        .or(dialog.getByRole('textbox'))
        .fill('wallet')
      await expect(dialog.locator('a[href^="/help/"]').first()).toBeVisible()
    },
  )

  test(
    'a spec opens from the specs hub',
    { tag: '@status-app' },
    async ({ page }) => {
      await page.goto('/specs')
      const spec = page
        .locator('a[href^="/specs/"]')
        .filter({ visible: true })
        .first()
      const href = await spec.getAttribute('href')
      await spec.click()
      await expect(page).toHaveURL(new RegExp(`${href}/?$`))
      await expect(page.locator('h1').first()).toHaveText(/\S/)
    },
  )
})
