/** Rate limit test:
 * pnpm exec vitest packages/wallet/src/data/api/lib/__tests__/rate-limiter.test.ts --run
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  clearRateLimitCache,
  createRateLimitMiddleware,
  type RateLimitMiddlewareOptions,
} from '../rate-limiter'

describe('rate-limiter', () => {
  beforeEach(() => {
    clearRateLimitCache()
  })

  type TestOpts = RateLimitMiddlewareOptions & { category?: string }

  const trpc = {
    middleware: (fn: (opts: TestOpts) => Promise<unknown>) => {
      return async (opts: TestOpts) => {
        return await fn(opts)
      }
    },
  }

  const createHeaders = (ip?: string) => {
    const headers = new Map<string, string>()
    if (ip) {
      headers.set('x-forwarded-for', ip)
    }
    return headers
  }

  const createContext = (ip?: string) => ({
    ctx: { headers: createHeaders(ip) },
  })

  const createMiddleware = (
    options: Parameters<typeof createRateLimitMiddleware>[1],
  ) => createRateLimitMiddleware(trpc, options)

  const createNext = () => vi.fn().mockResolvedValue('ok')

  const expectRequest = async (
    middleware: ReturnType<typeof createMiddleware>,
    opts: Parameters<typeof middleware>[0],
    shouldSucceed: boolean,
  ) => {
    if (shouldSucceed) {
      await expect(middleware(opts)).resolves.toBe('ok')
    } else {
      await expect(middleware(opts)).rejects.toThrow('Rate limit exceeded')
    }
  }

  // ============================================================================
  // Basic Rate Limiting Tests
  // ============================================================================

  describe('basic rate limiting', () => {
    it('should allow requests within limit', async () => {
      // Requests within the limit should pass successfully
      const middleware = createMiddleware({
        windowMs: 1000,
        maxRequests: 2,
        keyPrefix: 'basic',
      })

      const { ctx } = createContext('1.2.3.4')
      const next = createNext()

      await expectRequest(middleware, { ctx, next }, true)
      await expectRequest(middleware, { ctx, next }, true)
      expect(next).toHaveBeenCalledTimes(2)
    })

    it('should block requests exceeding limit', async () => {
      // Requests exceeding the limit should be blocked
      const middleware = createMiddleware({
        windowMs: 1000,
        maxRequests: 1,
        keyPrefix: 'block',
      })

      const { ctx } = createContext('1.2.3.4')
      const next = createNext()

      await expectRequest(middleware, { ctx, next }, true)
      await expectRequest(middleware, { ctx, next }, false)
    })
  })

  // ============================================================================
  // IP-based Isolation Tests
  // ============================================================================

  describe('IP-based isolation', () => {
    it('should isolate different IPs', async () => {
      // Different IPs should use independent buckets
      // When one IP exceeds the limit, other IPs should not be affected
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 1,
        keyPrefix: 'ip-isolation',
      })

      const ip1Ctx = createContext('1.2.3.4')
      const ip2Ctx = createContext('5.6.7.8')
      const next1 = vi.fn().mockResolvedValue('ok')
      const next2 = vi.fn().mockResolvedValue('ok')

      await expect(middleware({ ...ip1Ctx, next: next1 })).resolves.toBe('ok')
      await expect(middleware({ ...ip1Ctx, next: next1 })).rejects.toThrow(
        'Rate limit exceeded',
      )

      await expect(middleware({ ...ip2Ctx, next: next2 })).resolves.toBe('ok')
      await expect(middleware({ ...ip2Ctx, next: next2 })).rejects.toThrow(
        'Rate limit exceeded',
      )

      expect(next1).toHaveBeenCalledTimes(1)
      expect(next2).toHaveBeenCalledTimes(1)
    })

    it('should share bucket for same IP', async () => {
      // Requests from the same IP should share the same bucket
      // Multiple requests should accumulate and be blocked when exceeding the limit
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 2,
        keyPrefix: 'ip-shared',
      })

      const { ctx } = createContext('1.2.3.4')
      const next = vi.fn().mockResolvedValue('ok')

      await expect(middleware({ ctx, next })).resolves.toBe('ok')
      await expect(middleware({ ctx, next })).resolves.toBe('ok')
      await expect(middleware({ ctx, next })).rejects.toThrow(
        'Rate limit exceeded',
      )

      expect(next).toHaveBeenCalledTimes(2)
    })

    it('should use unknown for missing IP', async () => {
      // Missing IP header should be treated as 'unknown'
      // All requests without IP should share the same 'unknown' bucket
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 1,
        keyPrefix: 'ip-unknown',
      })

      const { ctx } = createContext()
      const next = vi.fn().mockResolvedValue('ok')

      await expect(middleware({ ctx, next })).resolves.toBe('ok')
      await expect(middleware({ ctx, next })).rejects.toThrow(
        'Rate limit exceeded',
      )

      const { ctx: ctx2 } = createContext()
      const next2 = vi.fn().mockResolvedValue('ok')

      await expect(middleware({ ctx: ctx2, next: next2 })).rejects.toThrow(
        'Rate limit exceeded',
      )
    })

    it('should handle x-forwarded-for with multiple IPs', async () => {
      // When x-forwarded-for contains multiple IPs, only the first IP should be used
      // Verifies extraction of the original client IP from proxy chain
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 1,
        keyPrefix: 'ip-forwarded',
      })

      const headers = new Map([['x-forwarded-for', '1.2.3.4, 5.6.7.8']])
      const ctx = { headers }
      const next = vi.fn().mockResolvedValue('ok')

      await expect(middleware({ ctx, next })).resolves.toBe('ok')
      await expect(middleware({ ctx, next })).rejects.toThrow(
        'Rate limit exceeded',
      )
    })
  })

  // ============================================================================
  // Category-based Rate Limiting Tests
  // ============================================================================

  describe('category-based rate limiting', () => {
    it('should use separate buckets for different categories', async () => {
      // Different categories should use independent buckets
      // Even with the same IP, different categories should not affect each other
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 1,
        keyPrefix: 'category',
        getCategory: opts => opts.category,
      })

      const { ctx } = createContext('1.2.3.4')
      const next = vi.fn().mockResolvedValue('ok')

      await expect(middleware({ ctx, next, category: 'A' })).resolves.toBe('ok')
      await expect(middleware({ ctx, next, category: 'A' })).rejects.toThrow(
        'Rate limit exceeded',
      )

      await expect(middleware({ ctx, next, category: 'B' })).resolves.toBe('ok')
      await expect(middleware({ ctx, next, category: 'B' })).rejects.toThrow(
        'Rate limit exceeded',
      )
    })

    it('should support dynamic maxRequests based on category', async () => {
      // Should be able to apply different limits based on category
      // VIP can have higher limits, normal can have lower limits
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: opts => (opts.category === 'VIP' ? 2 : 1),
        keyPrefix: 'category-dynamic',
        getCategory: opts => opts.category,
      })

      const { ctx } = createContext('1.2.3.4')
      const next = vi.fn().mockResolvedValue('ok')

      await expect(middleware({ ctx, next, category: 'Normal' })).resolves.toBe(
        'ok',
      )
      await expect(
        middleware({ ctx, next, category: 'Normal' }),
      ).rejects.toThrow('Rate limit exceeded')

      await expect(middleware({ ctx, next, category: 'VIP' })).resolves.toBe(
        'ok',
      )
      await expect(middleware({ ctx, next, category: 'VIP' })).resolves.toBe(
        'ok',
      )
      await expect(middleware({ ctx, next, category: 'VIP' })).rejects.toThrow(
        'Rate limit exceeded',
      )
    })
  })

  // ============================================================================
  // Host-based Rate Limiting Tests
  // ============================================================================

  describe('host-based rate limiting', () => {
    const createHeadersWithHost = (host?: string, ip?: string) => {
      const headers = new Map<string, string>()
      if (host) {
        headers.set('host', host)
      }
      if (ip) {
        headers.set('x-forwarded-for', ip)
      }
      return headers
    }

    it('should isolate different hosts', async () => {
      // Different hosts should use independent buckets
      // When one host exceeds the limit, other hosts should not be affected
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 1,
        keyPrefix: 'host-isolation',
        getKey: opts => opts.ctx.headers.get('host') || 'unknown',
      })

      const host1Headers = createHeadersWithHost('api.example.com', '1.2.3.4')
      const host2Headers = createHeadersWithHost('api.test.com', '1.2.3.4')
      const next1 = vi.fn().mockResolvedValue('ok')
      const next2 = vi.fn().mockResolvedValue('ok')

      await expect(
        middleware({ ctx: { headers: host1Headers }, next: next1 }),
      ).resolves.toBe('ok')
      await expect(
        middleware({ ctx: { headers: host1Headers }, next: next1 }),
      ).rejects.toThrow('Rate limit exceeded')

      // Different host should have its own limit
      await expect(
        middleware({ ctx: { headers: host2Headers }, next: next2 }),
      ).resolves.toBe('ok')
      await expect(
        middleware({ ctx: { headers: host2Headers }, next: next2 }),
      ).rejects.toThrow('Rate limit exceeded')

      expect(next1).toHaveBeenCalledTimes(1)
      expect(next2).toHaveBeenCalledTimes(1)
    })

    it('should share bucket for same host regardless of IP', async () => {
      // Requests to the same host should share the same bucket
      // Even if IPs are different, they should accumulate and be blocked
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 2,
        keyPrefix: 'host-shared',
        getKey: opts => opts.ctx.headers.get('host') || 'unknown',
      })

      const host1Ip1 = createHeadersWithHost('api.example.com', '1.2.3.4')
      const host1Ip2 = createHeadersWithHost('api.example.com', '5.6.7.8')
      const next = vi.fn().mockResolvedValue('ok')

      await expect(
        middleware({ ctx: { headers: host1Ip1 }, next }),
      ).resolves.toBe('ok')
      await expect(
        middleware({ ctx: { headers: host1Ip2 }, next }),
      ).resolves.toBe('ok')
      await expect(
        middleware({ ctx: { headers: host1Ip1 }, next }),
      ).rejects.toThrow('Rate limit exceeded')

      expect(next).toHaveBeenCalledTimes(2)
    })

    it('should use unknown for missing host', async () => {
      // Missing host header should be treated as 'unknown'
      // All requests without host should share the same 'unknown' bucket
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 1,
        keyPrefix: 'host-unknown',
        getKey: opts => opts.ctx.headers.get('host') || 'unknown',
      })

      const noHostHeaders = createHeadersWithHost(undefined, '1.2.3.4')
      const next = vi.fn().mockResolvedValue('ok')

      await expect(
        middleware({ ctx: { headers: noHostHeaders }, next }),
      ).resolves.toBe('ok')
      await expect(
        middleware({ ctx: { headers: noHostHeaders }, next }),
      ).rejects.toThrow('Rate limit exceeded')

      // Another request without host should also be blocked
      const noHostHeaders2 = createHeadersWithHost(undefined, '5.6.7.8')
      const next2 = vi.fn().mockResolvedValue('ok')

      await expect(
        middleware({ ctx: { headers: noHostHeaders2 }, next: next2 }),
      ).rejects.toThrow('Rate limit exceeded')
    })

    it('should support high-volume host-based limits', async () => {
      // Should handle realistic global API limits
      // 3000 requests per 60 seconds per host
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 60 * 1000,
        maxRequests: 3000,
        keyPrefix: 'host-global',
        getKey: opts => opts.ctx.headers.get('host') || 'unknown',
      })

      const headers = createHeadersWithHost('api.example.com', '1.2.3.4')
      const next = vi.fn().mockResolvedValue('ok')

      // Should allow 3000 requests
      for (let i = 0; i < 3000; i++) {
        await expect(middleware({ ctx: { headers }, next })).resolves.toBe('ok')
      }

      // 3001st request should be blocked
      await expect(middleware({ ctx: { headers }, next })).rejects.toThrow(
        'Rate limit exceeded',
      )

      expect(next).toHaveBeenCalledTimes(3000)
    })
  })

  // ============================================================================
  // Time-based Reset Tests
  // ============================================================================

  describe('time-based reset', () => {
    it('should reset after windowMs', async () => {
      // Counter should reset after the time window expires
      // After exceeding the limit, requests should be allowed again after time passes
      vi.useFakeTimers()

      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 1,
        keyPrefix: 'time-reset',
      })

      const { ctx } = createContext('1.2.3.4')
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
})
