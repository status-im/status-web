import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { GhostContentAPI, ghostFetch, resetGhostBreaker } from './client'

const URL = 'https://ghost.test/ghost/api/content/posts/'

describe('GhostContentAPI pagination', () => {
  it('bounds the first bulk request and follows the next page', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({
          posts: [{ slug: 'first' }],
          meta: { pagination: { next: 2 } },
        })
      )
      .mockResolvedValueOnce(
        Response.json({
          posts: [{ slug: 'second' }],
          meta: { pagination: { next: null } },
        })
      )
    vi.stubGlobal('fetch', fetchMock)
    try {
      const api = GhostContentAPI({
        url: 'https://ghost.test',
        key: '0123456789abcdef0123456789',
        version: 'v5.0',
      })
      const posts = await api.posts.browse({ limit: 'all' })
      expect(posts.map(post => post.slug)).toEqual(['first', 'second'])
      for (const [url] of fetchMock.mock.calls) {
        expect(new URL(url).searchParams.get('limit')).toBe('100')
      }
      expect(new URL(fetchMock.mock.calls[1][0]).searchParams.get('page')).toBe(
        '2'
      )
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('collects every page when Ghost caps limit=all', async () => {
    const makeRequest = vi
      .fn()
      .mockResolvedValueOnce({
        posts: [{ slug: 'first' }],
        meta: { pagination: { next: 2 } },
      })
      .mockResolvedValueOnce({
        posts: [{ slug: 'second' }],
        meta: { pagination: { next: null } },
      })
    const api = GhostContentAPI({
      url: 'https://ghost.test',
      key: '0123456789abcdef0123456789',
      version: 'v5.0',
      makeRequest,
    })

    const posts = await api.posts.browse({ limit: 'all' })
    expect(posts.map(post => post.slug)).toEqual(['first', 'second'])
    expect(makeRequest.mock.calls[1][0].params).toMatchObject({
      page: 2,
      limit: 100,
    })
  })

  it('propagates an error on a later page', async () => {
    const makeRequest = vi
      .fn()
      .mockResolvedValueOnce({
        posts: [{ slug: 'first' }],
        meta: { pagination: { next: 2 } },
      })
      .mockRejectedValueOnce(new Error('Ghost unavailable'))
    const api = GhostContentAPI({
      url: 'https://ghost.test',
      key: '0123456789abcdef0123456789',
      version: 'v5.0',
      makeRequest,
    })

    await expect(api.posts.browse({ limit: 'all' })).rejects.toThrow(
      'Ghost unavailable'
    )
  })
})

function fetchFailed() {
  return Promise.reject(new TypeError('fetch failed'))
}

describe('ghostFetch', () => {
  const fetchMock = vi.fn()

  beforeEach(() => {
    resetGhostBreaker()
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
    vi.stubEnv('NEXT_PHASE', 'phase-production-build')
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('times out a hanging request', async () => {
    vi.stubEnv('NEXT_PHASE', '')
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_, reject) => {
          init.signal?.addEventListener('abort', () =>
            reject(init.signal?.reason)
          )
        })
    )

    await expect(ghostFetch(URL)).rejects.toMatchObject({
      name: 'TimeoutError',
    })
  }, 5_000)

  it('keeps sending requests after one transport failure', async () => {
    fetchMock.mockImplementationOnce(fetchFailed)
    fetchMock.mockResolvedValueOnce(new Response('{}'))

    await expect(ghostFetch(URL)).rejects.toThrow('fetch failed')
    await expect(ghostFetch(URL)).resolves.toBeInstanceOf(Response)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('skips requests after two transport failures', async () => {
    fetchMock.mockImplementation(fetchFailed)

    await expect(ghostFetch(URL)).rejects.toThrow('fetch failed')
    await expect(ghostFetch(URL)).rejects.toThrow('fetch failed')
    const error = await ghostFetch(URL).catch(error => error)

    expect(error).toMatchObject({ name: 'TimeoutError' })
    expect(error).not.toHaveProperty('statusCode')
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(console.warn).toHaveBeenCalledTimes(1)
  })

  it('does not count HTTP errors', async () => {
    fetchMock.mockImplementationOnce(fetchFailed)
    fetchMock.mockResolvedValueOnce(new Response('', { status: 404 }))
    fetchMock.mockImplementationOnce(fetchFailed)
    fetchMock.mockResolvedValueOnce(new Response('{}'))

    await expect(ghostFetch(URL)).rejects.toThrow()
    await expect(ghostFetch(URL)).resolves.toMatchObject({ status: 404 })
    await expect(ghostFetch(URL)).rejects.toThrow()
    await expect(ghostFetch(URL)).resolves.toMatchObject({ status: 200 })
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })

  it('resets the count on success', async () => {
    fetchMock.mockImplementationOnce(fetchFailed)
    fetchMock.mockResolvedValueOnce(new Response('{}'))
    fetchMock.mockImplementationOnce(fetchFailed)
    fetchMock.mockResolvedValueOnce(new Response('{}'))

    await expect(ghostFetch(URL)).rejects.toThrow()
    await ghostFetch(URL)
    await expect(ghostFetch(URL)).rejects.toThrow()
    await expect(ghostFetch(URL)).resolves.toBeInstanceOf(Response)
  })

  it('never opens outside the build phase', async () => {
    vi.stubEnv('NEXT_PHASE', '')
    fetchMock.mockImplementation(fetchFailed)

    for (let i = 0; i < 4; i++) {
      await expect(ghostFetch(URL)).rejects.toThrow('fetch failed')
    }
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })

  it('lets one probe through after the cooldown', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(0)
    fetchMock.mockImplementation(fetchFailed)
    await ghostFetch(URL).catch(() => {})
    await ghostFetch(URL).catch(() => {})

    now.mockReturnValue(29_999)
    await expect(ghostFetch(URL)).rejects.toThrow('request skipped')
    expect(fetchMock).toHaveBeenCalledTimes(2)

    now.mockReturnValue(30_000)
    fetchMock.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 0, new Response('{}')))
    )
    const probe = ghostFetch(URL)
    await expect(ghostFetch(URL)).rejects.toThrow('request skipped')
    await probe
    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  it('closes after a successful probe', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(0)
    fetchMock.mockImplementationOnce(fetchFailed)
    fetchMock.mockImplementationOnce(fetchFailed)
    fetchMock.mockResolvedValue(new Response('{}'))
    await ghostFetch(URL).catch(() => {})
    await ghostFetch(URL).catch(() => {})

    now.mockReturnValue(30_000)
    await ghostFetch(URL)
    await ghostFetch(URL)
    await ghostFetch(URL)
    expect(fetchMock).toHaveBeenCalledTimes(5)
  })

  it('re-opens after a failed probe', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(0)
    fetchMock.mockImplementation(fetchFailed)
    await ghostFetch(URL).catch(() => {})
    await ghostFetch(URL).catch(() => {})

    now.mockReturnValue(30_000)
    await expect(ghostFetch(URL)).rejects.toThrow('fetch failed')

    now.mockReturnValue(59_999)
    await expect(ghostFetch(URL)).rejects.toThrow('request skipped')
    now.mockReturnValue(60_000)
    await expect(ghostFetch(URL)).rejects.toThrow('fetch failed')
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })
})
