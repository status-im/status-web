import { isLocalTarget } from '@config/site.js'
import { expect, test } from '@fixtures/site.fixture.js'

test.describe('status.app insights', () => {
  test(
    'epics load from Hasura and open',
    { tag: '@status-app' },
    async ({ page, baseURL }) => {
      test.skip(
        isLocalTarget(baseURL!),
        'Hasura answers CORS for the status.app origins only',
      )

      await page.goto('/insights/epics')
      const epic = page.locator('a[href^="/insights/epics/"]').first()
      await expect(epic).toBeVisible()

      const href = await epic.getAttribute('href')
      await epic.click()
      await expect(page).toHaveURL(new RegExp(`${href}$`))
      await expect(page.getByText(/\S/).first()).toBeVisible()
    },
  )
})
