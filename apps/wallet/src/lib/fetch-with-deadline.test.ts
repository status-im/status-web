import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { fetchWithDeadline } from './fetch-with-deadline'

const URL = 'https://api.example/endpoint'
const DEADLINE_MS = 1000
const TIMEOUT_MESSAGE = 'Timed out'

let signal: AbortSignal | undefined

/** A fetch that never answers, the way a stalled server behaves. */
function stalledFetch() {
  return vi.fn((_url: string, init: RequestInit) => {
    signal = init.signal ?? undefined
    return new Promise<Response>((_, reject) => {
      signal?.addEventListener('abort', () =>
        reject(new DOMException('aborted', 'AbortError')),
      )
    })
  })
}

const readJson = (response: Response) => response.json()

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  signal = undefined
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('fetchWithDeadline', () => {
  it('returns what the response reads to and leaves no timer behind', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(JSON.stringify({ ok: 1 }))),
    )

    await expect(
      fetchWithDeadline(URL, {}, DEADLINE_MS, readJson, TIMEOUT_MESSAGE),
    ).resolves.toEqual({ ok: 1 })
    expect(vi.getTimerCount()).toBe(0)
  })

  it('rejects with the timeout message and aborts a request that never answers', async () => {
    vi.stubGlobal('fetch', stalledFetch())

    const result = fetchWithDeadline(
      URL,
      {},
      DEADLINE_MS,
      readJson,
      TIMEOUT_MESSAGE,
    )
    const settled = expect(result).rejects.toThrow(TIMEOUT_MESSAGE)
    await vi.advanceTimersByTimeAsync(DEADLINE_MS)

    await settled
    expect(signal?.aborted).toBe(true)
  })

  it('also times out a body that never finishes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('{}')),
    )

    const result = fetchWithDeadline(
      URL,
      {},
      DEADLINE_MS,
      () => new Promise(() => {}),
      TIMEOUT_MESSAGE,
    )
    const settled = expect(result).rejects.toThrow(TIMEOUT_MESSAGE)
    await vi.advanceTimersByTimeAsync(DEADLINE_MS)

    await settled
  })

  it('passes on any other failure unchanged', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new TypeError('Failed to fetch')
      }),
    )

    await expect(
      fetchWithDeadline(URL, {}, DEADLINE_MS, readJson, TIMEOUT_MESSAGE),
    ).rejects.toThrow(new TypeError('Failed to fetch'))
    expect(vi.getTimerCount()).toBe(0)
  })
})
