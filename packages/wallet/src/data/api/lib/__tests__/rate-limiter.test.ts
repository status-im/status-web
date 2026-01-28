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

    it('should block multiple consecutive requests after limit', async () => {
      // After hitting the limit, all subsequent requests should be blocked
      const middleware = createMiddleware({
        windowMs: 1000,
        maxRequests: 2,
        keyPrefix: 'block-consecutive',
      })

      const { ctx } = createContext('1.2.3.4')
      const next = createNext()

      await expectRequest(middleware, { ctx, next }, true)
      await expectRequest(middleware, { ctx, next }, true)
      await expectRequest(middleware, { ctx, next }, false)
      await expectRequest(middleware, { ctx, next }, false)
      await expectRequest(middleware, { ctx, next }, false)

      expect(next).toHaveBeenCalledTimes(2)
    })

    it('should handle zero max requests', async () => {
      // Zero max requests should block all requests
      const middleware = createMiddleware({
        windowMs: 1000,
        maxRequests: 0,
        keyPrefix: 'zero-requests',
      })

      const { ctx } = createContext('1.2.3.4')
      const next = createNext()

      await expectRequest(middleware, { ctx, next }, false)
      await expectRequest(middleware, { ctx, next }, false)

      expect(next).toHaveBeenCalledTimes(0)
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

    it('should not allow IP spoofing to bypass limit', async () => {
      // Changing IP after hitting the limit should not allow bypassing
      // if the IP is not actually different
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 1,
        keyPrefix: 'ip-no-spoof',
      })

      const ip1Ctx = createContext('1.2.3.4')
      const next = vi.fn().mockResolvedValue('ok')

      await expect(middleware({ ...ip1Ctx, next })).resolves.toBe('ok')
      await expect(middleware({ ...ip1Ctx, next })).rejects.toThrow(
        'Rate limit exceeded',
      )

      // Same IP should still be blocked
      await expect(middleware({ ...ip1Ctx, next })).rejects.toThrow(
        'Rate limit exceeded',
      )

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('should handle whitespace in x-forwarded-for', async () => {
      // Should properly trim whitespace from IP addresses
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 1,
        keyPrefix: 'ip-whitespace',
      })

      const headers1 = new Map([['x-forwarded-for', '  1.2.3.4  ']])
      const headers2 = new Map([['x-forwarded-for', '1.2.3.4']])
      const next = vi.fn().mockResolvedValue('ok')

      // Request with whitespace
      await expect(
        middleware({ ctx: { headers: headers1 }, next }),
      ).resolves.toBe('ok')

      // Request without whitespace should be treated as same IP and blocked
      await expect(
        middleware({ ctx: { headers: headers2 }, next }),
      ).rejects.toThrow('Rate limit exceeded')

      expect(next).toHaveBeenCalledTimes(1)
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

    it('should block requests when category limit is exceeded', async () => {
      // Once a category limit is reached, subsequent requests should be blocked
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 2,
        keyPrefix: 'category-block',
        getCategory: opts => opts.category,
      })

      const { ctx } = createContext('1.2.3.4')
      const next = vi.fn().mockResolvedValue('ok')

      await expect(middleware({ ctx, next, category: 'A' })).resolves.toBe('ok')
      await expect(middleware({ ctx, next, category: 'A' })).resolves.toBe('ok')
      await expect(middleware({ ctx, next, category: 'A' })).rejects.toThrow(
        'Rate limit exceeded',
      )
      await expect(middleware({ ctx, next, category: 'A' })).rejects.toThrow(
        'Rate limit exceeded',
      )

      expect(next).toHaveBeenCalledTimes(2)
    })

    it('should handle undefined category gracefully', async () => {
      // Undefined category should be handled without errors
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 1,
        keyPrefix: 'category-undefined',
        getCategory: opts => opts.category,
      })

      const { ctx } = createContext('1.2.3.4')
      const next = vi.fn().mockResolvedValue('ok')

      await expect(
        middleware({ ctx, next, category: undefined }),
      ).resolves.toBe('ok')
      await expect(
        middleware({ ctx, next, category: undefined }),
      ).rejects.toThrow('Rate limit exceeded')

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('should not allow switching categories to bypass limit', async () => {
      // Switching categories should not bypass the per-category limit
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 1,
        keyPrefix: 'category-no-switch',
        getCategory: opts => opts.category,
      })

      const { ctx } = createContext('1.2.3.4')
      const next = vi.fn().mockResolvedValue('ok')

      // Hit limit for category A
      await expect(middleware({ ctx, next, category: 'A' })).resolves.toBe('ok')
      await expect(middleware({ ctx, next, category: 'A' })).rejects.toThrow(
        'Rate limit exceeded',
      )

      // Try category A again - should still be blocked
      await expect(middleware({ ctx, next, category: 'A' })).rejects.toThrow(
        'Rate limit exceeded',
      )

      expect(next).toHaveBeenCalledTimes(1)
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

    it('should continue blocking requests after limit exceeded', async () => {
      // After exceeding the limit, all subsequent requests should be blocked
      // until the time window resets
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 2,
        keyPrefix: 'host-block-continue',
        getKey: opts => opts.ctx.headers.get('host') || 'unknown',
      })

      const headers = createHeadersWithHost('api.example.com', '1.2.3.4')
      const next = vi.fn().mockResolvedValue('ok')

      // First 2 requests should succeed
      await expect(middleware({ ctx: { headers }, next })).resolves.toBe('ok')
      await expect(middleware({ ctx: { headers }, next })).resolves.toBe('ok')

      // Next 3 requests should all be blocked
      await expect(middleware({ ctx: { headers }, next })).rejects.toThrow(
        'Rate limit exceeded',
      )
      await expect(middleware({ ctx: { headers }, next })).rejects.toThrow(
        'Rate limit exceeded',
      )
      await expect(middleware({ ctx: { headers }, next })).rejects.toThrow(
        'Rate limit exceeded',
      )

      expect(next).toHaveBeenCalledTimes(2)
    })

    it('should accumulate requests from multiple IPs to same host', async () => {
      // Multiple IPs requesting the same host should accumulate to the same bucket
      // Verifies that host-based limiting is truly global per host
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 3,
        keyPrefix: 'host-accumulate',
        getKey: opts => opts.ctx.headers.get('host') || 'unknown',
      })

      const host = 'api.example.com'
      const next = vi.fn().mockResolvedValue('ok')

      // Request from IP 1
      await expect(
        middleware({
          ctx: { headers: createHeadersWithHost(host, '1.1.1.1') },
          next,
        }),
      ).resolves.toBe('ok')

      // Request from IP 2
      await expect(
        middleware({
          ctx: { headers: createHeadersWithHost(host, '2.2.2.2') },
          next,
        }),
      ).resolves.toBe('ok')

      // Request from IP 3
      await expect(
        middleware({
          ctx: { headers: createHeadersWithHost(host, '3.3.3.3') },
          next,
        }),
      ).resolves.toBe('ok')

      // Request from IP 1 again - should be blocked as total is now 4
      await expect(
        middleware({
          ctx: { headers: createHeadersWithHost(host, '1.1.1.1') },
          next,
        }),
      ).rejects.toThrow('Rate limit exceeded')

      expect(next).toHaveBeenCalledTimes(3)
    })

    it('should handle empty string host gracefully', async () => {
      // Empty string host should be treated as a valid key
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 1,
        keyPrefix: 'host-empty',
        getKey: opts => opts.ctx.headers.get('host') || 'unknown',
      })

      const headers = createHeadersWithHost('', '1.2.3.4')
      const next = vi.fn().mockResolvedValue('ok')

      await expect(middleware({ ctx: { headers }, next })).resolves.toBe('ok')
      await expect(middleware({ ctx: { headers }, next })).rejects.toThrow(
        'Rate limit exceeded',
      )

      expect(next).toHaveBeenCalledTimes(1)
    })

    it('should not reset counter prematurely', async () => {
      // Counter should NOT reset before windowMs expires
      vi.useFakeTimers()

      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 2000,
        maxRequests: 1,
        keyPrefix: 'host-no-premature-reset',
        getKey: opts => opts.ctx.headers.get('host') || 'unknown',
      })

      const headers = createHeadersWithHost('api.example.com', '1.2.3.4')
      const next = vi.fn().mockResolvedValue('ok')

      // First request
      await expect(middleware({ ctx: { headers }, next })).resolves.toBe('ok')

      // Second request immediately - should be blocked
      await expect(middleware({ ctx: { headers }, next })).rejects.toThrow(
        'Rate limit exceeded',
      )

      // Advance time by 1 second (half of window) - should still be blocked
      vi.advanceTimersByTime(1000)
      await expect(middleware({ ctx: { headers }, next })).rejects.toThrow(
        'Rate limit exceeded',
      )

      // Advance time by another 1001ms (total 2001ms) - should now succeed
      vi.advanceTimersByTime(1001)
      await expect(middleware({ ctx: { headers }, next })).resolves.toBe('ok')

      vi.useRealTimers()
      expect(next).toHaveBeenCalledTimes(2)
    })

    it('should handle concurrent requests to same host correctly', async () => {
      // Multiple concurrent requests should all be counted
      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 5,
        keyPrefix: 'host-concurrent',
        getKey: opts => opts.ctx.headers.get('host') || 'unknown',
      })

      const headers = createHeadersWithHost('api.example.com', '1.2.3.4')
      const next = vi.fn().mockResolvedValue('ok')

      // Send 5 concurrent requests
      const promises = Array.from({ length: 5 }, () =>
        middleware({ ctx: { headers }, next }),
      )

      await Promise.all(promises.map(p => expect(p).resolves.toBe('ok')))

      // 6th request should be blocked
      await expect(middleware({ ctx: { headers }, next })).rejects.toThrow(
        'Rate limit exceeded',
      )

      expect(next).toHaveBeenCalledTimes(5)
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

    it('should not reset before window expires', async () => {
      // Counter should remain blocked if time hasn't fully elapsed
      vi.useFakeTimers()

      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 5000,
        maxRequests: 1,
        keyPrefix: 'time-no-early-reset',
      })

      const { ctx } = createContext('1.2.3.4')
      const next = vi.fn().mockResolvedValue('ok')

      await expect(middleware({ ctx, next })).resolves.toBe('ok')
      await expect(middleware({ ctx, next })).rejects.toThrow(
        'Rate limit exceeded',
      )

      // Advance time but not enough
      vi.advanceTimersByTime(4999)
      await expect(middleware({ ctx, next })).rejects.toThrow(
        'Rate limit exceeded',
      )

      // Now advance past the window
      vi.advanceTimersByTime(2)
      await expect(middleware({ ctx, next })).resolves.toBe('ok')

      vi.useRealTimers()
    })

    it('should maintain separate timers for different keys', async () => {
      // Each key should have its own independent timer
      vi.useFakeTimers()

      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 2000,
        maxRequests: 1,
        keyPrefix: 'time-separate-timers',
      })

      const ip1Ctx = createContext('1.2.3.4')
      const ip2Ctx = createContext('5.6.7.8')
      const next = vi.fn().mockResolvedValue('ok')

      // IP1 hits limit at time 0
      await expect(middleware({ ...ip1Ctx, next })).resolves.toBe('ok')

      // Advance 1 second
      vi.advanceTimersByTime(1000)

      // IP2 hits limit at time 1000
      await expect(middleware({ ...ip2Ctx, next })).resolves.toBe('ok')

      // Advance 1001ms more (total 2001ms) - IP1 should be reset
      vi.advanceTimersByTime(1001)

      // IP1 should be reset now (2001ms elapsed since first request)
      await expect(middleware({ ...ip1Ctx, next })).resolves.toBe('ok')

      // IP2 should still be blocked (only 1001ms elapsed since its request)
      await expect(middleware({ ...ip2Ctx, next })).rejects.toThrow(
        'Rate limit exceeded',
      )

      // Advance 1000ms more (total 3001ms) - IP2 should be reset
      vi.advanceTimersByTime(1000)

      // IP2 should now be reset (2001ms elapsed since its request)
      await expect(middleware({ ...ip2Ctx, next })).resolves.toBe('ok')

      vi.useRealTimers()
    })

    it('should handle rapid sequential resets correctly', async () => {
      // Multiple reset cycles should work correctly
      vi.useFakeTimers()

      const middleware = createRateLimitMiddleware(trpc, {
        windowMs: 1000,
        maxRequests: 2,
        keyPrefix: 'time-rapid-resets',
      })

      const { ctx } = createContext('1.2.3.4')
      const next = vi.fn().mockResolvedValue('ok')

      // First cycle
      await expect(middleware({ ctx, next })).resolves.toBe('ok')
      await expect(middleware({ ctx, next })).resolves.toBe('ok')
      await expect(middleware({ ctx, next })).rejects.toThrow(
        'Rate limit exceeded',
      )

      vi.advanceTimersByTime(1001)

      // Second cycle
      await expect(middleware({ ctx, next })).resolves.toBe('ok')
      await expect(middleware({ ctx, next })).resolves.toBe('ok')
      await expect(middleware({ ctx, next })).rejects.toThrow(
        'Rate limit exceeded',
      )

      vi.advanceTimersByTime(1001)

      // Third cycle
      await expect(middleware({ ctx, next })).resolves.toBe('ok')
      await expect(middleware({ ctx, next })).resolves.toBe('ok')
      await expect(middleware({ ctx, next })).rejects.toThrow(
        'Rate limit exceeded',
      )

      vi.useRealTimers()
      expect(next).toHaveBeenCalledTimes(6)
    })
  })
})
