import { expect, test } from '@fixtures/site.fixture.js'

test.describe('status.app jobs', () => {
  test(
    'open roles load from Greenhouse',
    { tag: '@status-app' },
    async ({ page }) => {
      await page.goto('/jobs')
      const openRoles = page.locator('#open-roles')
      await expect(
        openRoles.getByRole('heading', { name: /open roles/i }),
      ).toBeVisible()

      // Zero Status roles is a valid state, an empty or broken section is not.
      const roles = openRoles.locator('a[href^="/jobs/"]')
      await expect(
        roles.first().or(openRoles.getByText(/no open roles/i)),
      ).toBeVisible()

      const networkRoles = page.locator(
        'a[href^="https://job-boards.greenhouse.io/"]',
      )
      if ((await networkRoles.count()) > 0) {
        await expect(networkRoles.first()).toHaveText(/\S/)
      }
    },
  )

  test(
    'a role opens with its application form',
    { tag: '@status-app' },
    async ({ page }) => {
      await page.goto('/jobs')
      const role = page.locator('#open-roles a[href^="/jobs/"]').first()
      test.skip((await role.count()) === 0, 'Status has no open roles today')

      await role.click()
      await expect(page).toHaveURL(/\/jobs\/\d+\/?$/)
      await expect(page.locator('h1').first()).toHaveText(/\S/)

      // Open the form only; never submit an application from a test.
      await page
        .getByRole('button', { name: /apply now/i })
        .first()
        .click()
      await expect(page.getByRole('dialog')).toBeVisible()
    },
  )
})
