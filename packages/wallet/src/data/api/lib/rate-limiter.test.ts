import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getRetryAfterSeconds } from '../../../utils/error-cause'
import {
  clearRateLimitCache,
  createRateLimitMiddleware,
  getClientIp,
} from './rate-limiter'

type Middleware = (opts: {
  ctx: { headers: Headers }
  next: () => Promise<string>
  path?: string
  rawInput?: unknown
}) => Promise<string>

function setupMiddleware(maxRequests = 2) {
  let middleware: Middleware | undefined
  const trpc = {
    middleware: (fn: Middleware) => {
      middleware = fn
      return fn
    },
  }

  createRateLimitMiddleware(trpc, {
    windowMs: 60_000,
    maxRequests,
    keyPrefix: 'test',
  })

  if (!middleware) throw new Error('Middleware was not created')
  return middleware
}

async function request(middleware: Middleware, ip: string) {
  return await middleware({
    ctx: { headers: new Headers({ 'x-forwarded-for': ip }) },
    next: async () => 'ok',
  })
}

describe('rate limiter', () => {
  beforeEach(() => {
    clearRateLimitCache()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('allows the configured limit and rejects the next request', async () => {
    const middleware = setupMiddleware()

    await expect(request(middleware, '192.0.2.1')).resolves.toBe('ok')
    await expect(request(middleware, '192.0.2.1')).resolves.toBe('ok')
    const rejectedRequest = request(middleware, '192.0.2.1')
    await expect(rejectedRequest).rejects.toMatchObject({
      code: 'TOO_MANY_REQUESTS',
    })
    await expect(rejectedRequest).rejects.toSatisfy(
      error => getRetryAfterSeconds(error) === 60,
    )
  })

  it('keeps independent counters per client IP', async () => {
    const middleware = setupMiddleware(1)

    await expect(request(middleware, '192.0.2.1')).resolves.toBe('ok')
    await expect(request(middleware, '192.0.2.2')).resolves.toBe('ok')
  })

  it('resets a counter after its window', async () => {
    const middleware = setupMiddleware(1)

    await expect(request(middleware, '192.0.2.1')).resolves.toBe('ok')
    vi.advanceTimersByTime(60_001)
    await expect(request(middleware, '192.0.2.1')).resolves.toBe('ok')
  })
})

describe('getClientIp', () => {
  it('prefers the Vercel forwarding header', () => {
    const headers = new Headers({
      'x-vercel-forwarded-for': '192.0.2.10, 192.0.2.11',
      'x-forwarded-for': '198.51.100.1',
    })

    expect(getClientIp(headers)).toBe('192.0.2.10')
  })
})
