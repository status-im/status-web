import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ghostFetch, resetGhostBreaker } from './client'

const URL = 'https://ghost.test/ghost/api/content/posts/'

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
})
