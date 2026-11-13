import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { REQUEST_DEADLINE_MS } from '../../lib/fetch-with-deadline'
import { broadcast, BROADCAST_TIMEOUT_MESSAGE } from './ethereum'

const TX_HASH = `0x${'ab'.repeat(32)}`

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('broadcast', () => {
  it('returns the hash the node answers with', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ result: { data: { json: TX_HASH } } })),
      ),
    )

    await expect(broadcast('02f8', 'ethereum')).resolves.toBe(TX_HASH)
  })

  it("passes on the node's reason for a refusal", async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({ error: { json: { message: 'nonce too low' } } }),
            { status: 500 },
          ),
      ),
    )

    await expect(broadcast('02f8', 'ethereum')).rejects.toThrow('nonce too low')
  })

  it('gives up on a node that never answers, so the nonce can be released', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, init: RequestInit) =>
          new Promise<Response>((_, reject) => {
            init.signal?.addEventListener('abort', () =>
              reject(new DOMException('aborted', 'AbortError')),
            )
          }),
      ),
    )

    const settled = expect(broadcast('02f8', 'ethereum')).rejects.toThrow(
      BROADCAST_TIMEOUT_MESSAGE,
    )
    await vi.advanceTimersByTimeAsync(REQUEST_DEADLINE_MS)

    await settled
  })
})
