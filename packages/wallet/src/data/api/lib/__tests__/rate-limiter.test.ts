import { describe, expect, it, vi } from 'vitest'

import {
  createRateLimitMiddleware,
  type RateLimitMiddlewareOptions,
} from '../rate-limiter'

describe('rate-limiter', () => {
  type TestOpts = RateLimitMiddlewareOptions & { category?: string }

  const trpc = {
    middleware: (fn: (opts: TestOpts) => Promise<unknown>) => fn,
  }

  it('should allow requests within limit', async () => {
    const middleware = createRateLimitMiddleware(trpc, {
      windowMs: 1000,
      maxRequests: 2,
      keyPrefix: 'test1',
    })

    const ctx = { headers: new Map([['x-forwarded-for', '1.2.3.4']]) }
    const next = vi.fn().mockResolvedValue('ok')

    await expect(middleware({ ctx, next })).resolves.toBe('ok')
    await expect(middleware({ ctx, next })).resolves.toBe('ok')
    expect(next).toHaveBeenCalledTimes(2)
  })

  it('should block requests exceeding limit', async () => {
    const middleware = createRateLimitMiddleware(trpc, {
      windowMs: 1000,
      maxRequests: 1,
      keyPrefix: 'test2',
    })

    const ctx = { headers: new Map([['x-forwarded-for', '1.2.3.4']]) }
    const next = vi.fn().mockResolvedValue('ok')

    await expect(middleware({ ctx, next })).resolves.toBe('ok')
    await expect(middleware({ ctx, next })).rejects.toThrow(
      'Rate limit exceeded',
    )
  })

  it('should use separate buckets for different categories', async () => {
    const middleware = createRateLimitMiddleware(trpc, {
      windowMs: 1000,
      maxRequests: 1,
      keyPrefix: 'test3',
      getCategory: opts => opts.category,
    })

    const ctx = { headers: new Map([['x-forwarded-for', '1.2.3.4']]) }
    const next = vi.fn().mockResolvedValue('ok')

    // Category A
    await expect(middleware({ ctx, next, category: 'A' })).resolves.toBe('ok')
    await expect(middleware({ ctx, next, category: 'A' })).rejects.toThrow(
      'Rate limit exceeded',
    )

    // Category B should still be allowed
    await expect(middleware({ ctx, next, category: 'B' })).resolves.toBe('ok')
    await expect(middleware({ ctx, next, category: 'B' })).rejects.toThrow(
      'Rate limit exceeded',
    )
  })

  it('should support dynamic maxRequests based on category', async () => {
    const middleware = createRateLimitMiddleware(trpc, {
      windowMs: 1000,
      maxRequests: opts => (opts.category === 'VIP' ? 2 : 1),
      keyPrefix: 'test_dynamic',
      getCategory: opts => opts.category,
    })

    const ctx = { headers: new Map([['x-forwarded-for', '1.2.3.4']]) }
    const next = vi.fn().mockResolvedValue('ok')

    // Normal category should have limit 1
    await expect(middleware({ ctx, next, category: 'Normal' })).resolves.toBe(
      'ok',
    )
    await expect(middleware({ ctx, next, category: 'Normal' })).rejects.toThrow(
      'Rate limit exceeded',
    )

    // VIP category should have limit 2
    await expect(middleware({ ctx, next, category: 'VIP' })).resolves.toBe('ok')
    await expect(middleware({ ctx, next, category: 'VIP' })).resolves.toBe('ok')
    await expect(middleware({ ctx, next, category: 'VIP' })).rejects.toThrow(
      'Rate limit exceeded',
    )
  })

  it('should reset after windowMs', async () => {
    vi.useFakeTimers()
    const middleware = createRateLimitMiddleware(trpc, {
      windowMs: 1000,
      maxRequests: 1,
      keyPrefix: 'test4',
    })

    const ctx = { headers: new Map([['x-forwarded-for', '1.2.3.4']]) }
    const next = vi.fn().mockResolvedValue('ok')

    await expect(middleware({ ctx, next })).resolves.toBe('ok')
    await expect(middleware({ ctx, next })).rejects.toThrow(
      'Rate limit exceeded',
    )

    vi.advanceTimersByTime(1001)

    await expect(middleware({ ctx, next })).resolves.toBe('ok')
    vi.useRealTimers()
  })
})
