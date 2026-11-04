import {
  E2E_BOT_USER_AGENT,
  STATUS_APP_DESKTOP_DOWNLOADS,
} from '@constants/status-app.js'
import { expect, test } from '@fixtures/site.fixture.js'

const RELEASE_ASSET_URL =
  /^https:\/\/github\.com\/status-im\/status-app\/releases\/download\//

test.describe('status.app downloads', () => {
  for (const download of STATUS_APP_DESKTOP_DOWNLOADS) {
    test.describe(download.platform, () => {
      test.use({ userAgent: download.userAgent })

      test(
        `the header offers the ${download.platform} build`,
        { tag: '@status-app' },
        async ({ page }) => {
          await page.goto('/apps')
          await expect(page.locator('html')).toHaveAttribute(
            'data-platform',
            download.platform,
          )

          const link = page
            .getByRole('link', { name: download.link })
            .filter({ visible: true })
            .first()
          await expect(link).toHaveAttribute('href', download.endpoint)
        },
      )
    })

    test(
      `${download.endpoint} redirects to a published release asset`,
      { tag: '@status-app' },
      async ({ request }) => {
        // Not followed through the browser: the route counts a download in
        // Umami unless the user agent looks like a bot.
        const response = await request.get(download.endpoint, {
          maxRedirects: 0,
          headers: { 'user-agent': E2E_BOT_USER_AGENT },
        })
        expect(response.status(), await response.text()).toBeGreaterThanOrEqual(
          300,
        )
        expect(response.status()).toBeLessThan(400)

        const location = response.headers()['location'] ?? ''
        expect(location).toMatch(RELEASE_ASSET_URL)
        expect(location).toMatch(download.asset)

        const asset = await request.head(location)
        expect(asset.status(), location).toBe(200)
      },
    )
  }
})
