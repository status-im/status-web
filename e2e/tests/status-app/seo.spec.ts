import { SITEMAP_SAMPLE } from '@config/site.js'
import { expect, test } from '@fixtures/site.fixture.js'

/** Spread `size` picks over the whole list so every section gets a look. */
function sample<T>(items: T[], size: string): T[] {
  if (size === 'all') return items
  const count = Math.min(Number(size), items.length)
  const step = items.length / count
  return Array.from({ length: count }, (_, i) => items[Math.floor(i * step)]!)
}

test.describe('status.app crawler files', () => {
  test(
    'robots.txt points crawlers at the sitemap',
    { tag: '@status-app' },
    async ({ request }) => {
      const response = await request.get('/robots.txt')
      expect(response.status()).toBe(200)
      const body = await response.text()
      expect(body).toMatch(/^Sitemap: https:\/\/\S+\/sitemap\.xml$/m)
      expect(body).toMatch(/^Disallow: \/admin/m)
    },
  )

  test(
    'sitemap entries answer 200',
    { tag: '@status-app' },
    async ({ request }) => {
      test.setTimeout(SITEMAP_SAMPLE === 'all' ? 600_000 : 180_000)

      const response = await request.get('/sitemap.xml')
      expect(response.status()).toBe(200)
      const xml = await response.text()

      // Entries carry the production host on every environment; request the
      // same path on the site under test.
      const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
        ([, loc]) => new URL(loc!).pathname,
      )
      expect(paths.length).toBeGreaterThan(10)

      const failures: string[] = []
      const queue = sample(paths, SITEMAP_SAMPLE)
      const worker = async () => {
        for (let path = queue.shift(); path; path = queue.shift()) {
          const page = await request.get(path)
          if (page.status() !== 200) failures.push(`${page.status()} ${path}`)
        }
      }
      await Promise.all(Array.from({ length: 6 }, worker))

      expect(failures, 'sitemap entries that did not answer 200').toEqual([])
    },
  )
})
