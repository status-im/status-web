import { afterEach, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(async () =>
    JSON.stringify({
      posts: Array.from({ length: 583 }, (_, id) => ({ id: String(id) })),
    })
  ),
}))

afterEach(() => vi.unstubAllGlobals())

it('serves the complete archive from the index without Ghost requests', async () => {
  const fetchMock = vi.fn(() => {
    throw new Error('Ghost unavailable')
  })
  vi.stubGlobal('fetch', fetchMock)
  const { readBlogPostsPage } = await import('./search.server')
  const first = await readBlogPostsPage(1, 7)
  const last = await readBlogPostsPage(84, 7)
  const missing = await readBlogPostsPage(85, 7)

  expect(first.posts).toHaveLength(7)
  expect(first.meta.pagination).toMatchObject({
    pages: 84,
    total: 583,
    next: 2,
  })
  expect(last.posts).toHaveLength(2)
  expect(last.meta.pagination.next).toBeNull()
  expect(missing.posts).toEqual([])
  expect(fetchMock).not.toHaveBeenCalled()
})
