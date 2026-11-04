import {
  STATUS_APP_CORE_ROUTES,
  STATUS_APP_KNOWN_ROUTE_ERRORS,
  STATUS_APP_RULES,
} from '@constants/status-app.js'
import { expect, test } from '@fixtures/site.fixture.js'

test.describe('status.app pages', () => {
  for (const route of STATUS_APP_CORE_ROUTES) {
    test.describe(route, () => {
      test.use({
        siteRules: {
          ...STATUS_APP_RULES,
          ignoredConsoleErrors: [
            ...STATUS_APP_RULES.ignoredConsoleErrors,
            ...(STATUS_APP_KNOWN_ROUTE_ERRORS[route] ?? []),
          ],
        },
      })

      test(`${route} renders`, { tag: '@status-app' }, async ({ page }) => {
        const response = await page.goto(route)
        expect(response?.status()).toBe(200)

        await expect(page.locator('h1').first()).toHaveText(/\S/)
        await expect(page).toHaveTitle(/\S/)
        await expect(page.locator('meta[name="description"]')).toHaveAttribute(
          'content',
          /\S/,
        )

        // Staging and local builds still point canonicals at the production
        // host, so only the path is compared.
        const canonical = await page
          .locator('link[rel="canonical"]')
          .getAttribute('href')
        expect(canonical, 'canonical link').toBeTruthy()
        expect(new URL(canonical!).pathname.replace(/\/$/, '')).toBe(
          route.replace(/\/$/, ''),
        )
      })
    })
  }

  test.describe('not found', () => {
    // The document itself answers 404, which Chrome logs as a console error.
    test.use({
      siteRules: {
        ...STATUS_APP_RULES,
        ignoredConsoleErrors: [
          ...STATUS_APP_RULES.ignoredConsoleErrors,
          /status of 404/,
        ],
      },
    })

    test(
      'unknown routes show the not-found page',
      { tag: '@status-app' },
      async ({ page }) => {
        const response = await page.goto('/this-route-does-not-exist')
        expect(response?.status()).toBe(404)
        await expect(
          page.locator('meta[name="robots"]').first(),
        ).toHaveAttribute('content', /noindex/)

        const home = page.getByRole('link', {
          name: /go to status\.app homepage/i,
        })
        await expect(
          page.getByRole('heading', { name: /it looks like you're lost/i }),
        ).toBeVisible()
        await home.click()
        await expect(page).toHaveURL(/\/$/)
      },
    )
  })
})
