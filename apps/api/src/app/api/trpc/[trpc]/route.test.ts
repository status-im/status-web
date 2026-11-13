import { getRetryAfterSeconds } from '@status-im/wallet/data'
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
    vi.mocked(getRetryAfterSeconds).mockReturnValue(undefined)
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

  it('adds Retry-After from the original middleware error', async () => {
    vi.mocked(getRetryAfterSeconds).mockReturnValue(1)
    vi.mocked(fetchRequestHandler).mockImplementation(async options => {
      options.onError?.({ error: new Error('Rate limited') } as never)
      return Response.json(
        { error: { message: 'Rate limited' } },
        { status: 429 }
      )
    })

    const request = new Request(
      'http://localhost/api/trpc/activities.page?input={}',
      { method: 'GET' }
    ) as NextRequest
    const response = await POST(request)

    expect(response.status).toBe(429)
    expect(response.headers.get('retry-after')).toBe('1')
  })
})

describe('batch size limits', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects JSON-RPC batches over 20 calls', async () => {
    const calls = Array.from({ length: 21 }, (_, id) => ({
      jsonrpc: '2.0',
      id,
      method: 'eth_blockNumber',
    }))
    const request = new Request('http://localhost/api/trpc/rpc.proxy', {
      method: 'POST',
      body: JSON.stringify(calls),
    }) as NextRequest
    const response = await POST(request)

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({
      id: null,
      error: { code: -32600 },
    })
    expect(fetchRequestHandler).not.toHaveBeenCalled()
  })

  it('rejects tRPC batches over 10 procedures', async () => {
    const paths = Array(11).fill('market.tokenPrice').join(',')
    const request = new Request(
      `http://localhost/api/trpc/${paths}?batch=1&input={}`,
      { method: 'GET' }
    ) as NextRequest
    const response = await POST(request)

    expect(response.status).toBe(400)
    expect(fetchRequestHandler).not.toHaveBeenCalled()
  })

  it('rejects malformed path encoding with a 400 and CORS headers', async () => {
    const request = new Request(
      'http://localhost/api/trpc/%E0%A4%A?batch=1&input={}',
      { method: 'GET' }
    ) as NextRequest
    const response = await POST(request)

    expect(response.status).toBe(400)
    expect(response.headers.get('access-control-allow-origin')).toBe('*')
    expect(fetchRequestHandler).not.toHaveBeenCalled()
  })

  it('lets a 10-procedure tRPC batch through', async () => {
    vi.mocked(fetchRequestHandler).mockResolvedValue(Response.json([]))
    const paths = Array(10).fill('market.tokenPrice').join(',')
    const request = new Request(
      `http://localhost/api/trpc/${paths}?batch=1&input={}`,
      { method: 'GET' }
    ) as NextRequest
    const response = await POST(request)

    expect(response.status).toBe(200)
    expect(fetchRequestHandler).toHaveBeenCalledOnce()
  })
})
