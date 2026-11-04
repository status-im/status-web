import { expect, test } from '@fixtures/site.fixture.js'

import type { Page } from '@playwright/test'

/** Post links only: `/blog/<slug>`, not pagination, tags or authors. */
function postLinks(page: Page) {
  return page.locator(
    'a[href^="/blog/"]:not([href^="/blog/page/"]):not([href^="/blog/tag/"]):not([href^="/blog/author/"])',
  )
}

test.describe('status.app blog', () => {
  test(
    'the list links to posts that open',
    { tag: '@status-app' },
    async ({ page }) => {
      await page.goto('/blog')
      const first = postLinks(page).first()
      await expect(first).toBeVisible()

      const href = await first.getAttribute('href')
      await page.goto(href!)
      await expect(page.locator('h1').first()).toHaveText(/\S/)
      await expect(page.getByRole('paragraph').first()).toHaveText(/\w+/)
    },
  )

  test('pagination opens page 2', { tag: '@status-app' }, async ({ page }) => {
    await page.goto('/blog')
    // Lazy images keep shifting the grid above the pager, so follow the link
    // instead of clicking it.
    const next = page
      .getByRole('navigation', { name: /blog pages/i })
      .getByRole('link', { name: '2', exact: true })
    await expect(next).toHaveAttribute('href', '/blog/page/2')

    const response = await page.goto('/blog/page/2')
    expect(response?.status()).toBe(200)
    await expect(postLinks(page).first()).toBeVisible()
  })

  test(
    'search finds a post by its title',
    { tag: '@status-app' },
    async ({ page }) => {
      await page.goto('/blog')
      const first = postLinks(page).first()
      const href = await first.getAttribute('href')
      // Two leading words of the slug are enough to find the post again.
      const query = href!.split('/').pop()!.split('-').slice(0, 2).join(' ')

      await page
        .getByRole('searchbox', { name: /search blog posts/i })
        .fill(query)
      await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible()
    },
  )

  test(
    'the RSS feed lists posts',
    { tag: '@status-app' },
    async ({ request }) => {
      const response = await request.get('/feed.xml')
      expect(response.status()).toBe(200)
      const body = await response.text()
      expect(body).toMatch(/<(rss|feed)\b/)
      expect(body).toMatch(/<(item|entry)>/)
    },
  )
})
