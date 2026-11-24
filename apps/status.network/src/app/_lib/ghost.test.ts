import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.resetModules()
})

describe('network Ghost posts', () => {
  it('fetches every page for the blog listing', async () => {
    vi.stubEnv('GHOST_API_KEY', 'test')
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({
          posts: [{ slug: 'one' }],
          meta: { pagination: { next: 2 } },
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          posts: [{ slug: 'two' }],
          meta: { pagination: { next: null } },
        }),
      )
    vi.stubGlobal('fetch', fetchMock)
    const { getPosts } = await import('./ghost')

    const result = await getPosts({ limit: 'all' })
    expect(result.posts.map(post => post.slug)).toEqual(['one', 'two'])
    expect(new URL(fetchMock.mock.calls[1][0]).searchParams.get('page')).toBe(
      '2',
    )
  })

  it('loads only registered fallback slugs when the network tag is empty', async () => {
    vi.stubEnv('GHOST_API_KEY', 'test')
    const fetchMock = vi.fn(async (url: string) => {
      const filter = new URL(url).searchParams.get('filter') ?? ''
      const slug = /slug:([^+]+)/.exec(filter)?.[1]
      return Response.json({
        posts: slug ? [{ slug }] : [],
        meta: { pagination: { next: null } },
      })
    })
    vi.stubGlobal('fetch', fetchMock)
    const { getPosts, getPostBySlug } = await import('./ghost')

    const result = await getPosts({ limit: 'all' })
    expect(result.posts.map(post => post.slug)).toEqual([
      'snt-staking-earn-karma',
      'privacy-l2-stealth-addresses-bermuda',
      'what-is-mev-maximal-extractable-value',
    ])
    await getPostBySlug('unregistered')
    expect(
      new URL(fetchMock.mock.calls.at(-1)![0]).searchParams.get('filter'),
    ).toContain('tag:status-network-blog')
  })
})
