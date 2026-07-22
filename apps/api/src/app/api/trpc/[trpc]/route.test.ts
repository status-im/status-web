import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { POST } from './route'

import type { NextRequest } from 'next/server'

vi.mock('@status-im/wallet/data', () => ({
  apiRouter: {},
  getRetryAfterSeconds: vi.fn(),
  parseRetryAfterSeconds: vi.fn(),
}))

vi.mock('@trpc/server/adapters/fetch', () => ({
  fetchRequestHandler: vi.fn(),
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Headers()),
}))

describe('tRPC route response metadata', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('preserves status, body, and responseMeta headers', async () => {
    const trpcResponse = Response.json(
      { error: { message: 'Rate limited' } },
      {
        status: 429,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'cache-control': 'private, no-store',
          'Retry-After': '17',
        },
      }
    )
    vi.mocked(fetchRequestHandler).mockResolvedValue(trpcResponse)

    const request = new Request(
      'http://localhost/api/trpc/market.tokenPrice?input={}',
      { method: 'POST' }
    ) as NextRequest
    const response = await POST(request)

    expect(response).toBe(trpcResponse)
    expect(response.status).toBe(429)
    expect(response.headers.get('retry-after')).toBe('17')
    expect(response.headers.get('cache-control')).toBe('private, no-store')
    expect(response.headers.get('access-control-allow-origin')).toBe('*')
    await expect(response.json()).resolves.toEqual({
      error: { message: 'Rate limited' },
    })
  })
})
