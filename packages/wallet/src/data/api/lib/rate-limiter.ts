import { TRPCError } from '@trpc/server'

import { RateLimitError } from '../../../utils/error-cause'

/**
 * Rate limiting configuration
 */
type RateLimitContext = {
  headers: {
    get(name: string): string | null | undefined
  }
}

export interface RateLimitMiddlewareOptions<TNextResult = Promise<unknown>> {
  ctx: RateLimitContext
  next: () => TNextResult
  path?: string
  rawInput?: unknown
}

export interface RateLimitOptions<TOpts extends RateLimitMiddlewareOptions> {
  windowMs: number
  maxRequests: number | ((opts: TOpts) => number)
  message?: string
  keyPrefix?: string
  getCategory?: (opts: TOpts) => string | undefined
  getKey?: (opts: TOpts) => string
}

export interface TokenBucketRateLimitOptions<
  TOpts extends RateLimitMiddlewareOptions,
> {
  capacity: number
  refillTokens: number
  refillIntervalMs: number
  message?: string
  keyPrefix?: string
  getKey?: (opts: TOpts) => string
}

// Best-effort request throttling for each warm application instance. The
// upstream Status proxies remain the authority for aggregate provider quotas.
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const tokenBuckets = new Map<
  string,
  { tokens: number; lastRefillTime: number }
>()

let lastPruneAt = 0
const tokenBucketLastPruneAt = new Map<string, number>()

const PRUNE_INTERVAL_MS = 60 * 1000

export function getClientIp(headers: RateLimitContext['headers']): string {
  return (
    headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip')?.trim() ||
    'unknown'
  )
}

export const clearRateLimitCache = () => {
  requestCounts.clear()
  tokenBuckets.clear()
  lastPruneAt = 0
  tokenBucketLastPruneAt.clear()
}

/**
 * Token-bucket limiter for bursty browser traffic. A caller may use the full
 * capacity immediately, after which tokens refill at a steady rate.
 */
export const createTokenBucketRateLimitMiddleware = <
  TOpts extends RateLimitMiddlewareOptions<TNextResult>,
  TNextResult extends Promise<unknown>,
  TMiddlewareReturn,
>(
  trpc: {
    middleware: (fn: (opts: TOpts) => TNextResult) => TMiddlewareReturn
  },
  options: TokenBucketRateLimitOptions<TOpts>,
) => {
  const {
    capacity,
    refillTokens,
    refillIntervalMs,
    message = 'Rate limit exceeded. Please try again later.',
    keyPrefix = 'token-bucket',
    getKey,
  } = options

  if (capacity <= 0 || refillTokens <= 0 || refillIntervalMs <= 0) {
    throw new Error('Token bucket values must be greater than zero')
  }

  const refillRate = refillTokens / refillIntervalMs
  const timeToFullMs = capacity / refillRate

  return trpc.middleware((opts: TOpts) => {
    const now = Date.now()

    const lastTokenPruneAt = tokenBucketLastPruneAt.get(keyPrefix) ?? 0
    if (now - lastTokenPruneAt >= PRUNE_INTERVAL_MS) {
      for (const [storedKey, storedBucket] of tokenBuckets) {
        if (
          storedKey.startsWith(`${keyPrefix}:`) &&
          now - storedBucket.lastRefillTime >= timeToFullMs
        ) {
          tokenBuckets.delete(storedKey)
        }
      }
      tokenBucketLastPruneAt.set(keyPrefix, now)
    }

    const clientKey = getKey ? getKey(opts) : getClientIp(opts.ctx.headers)
    const key = `${keyPrefix}:${clientKey}`
    const existing = tokenBuckets.get(key)
    const elapsed = existing ? Math.max(0, now - existing.lastRefillTime) : 0
    const tokens = existing
      ? Math.min(capacity, existing.tokens + elapsed * refillRate)
      : capacity

    if (tokens < 1) {
      tokenBuckets.set(key, { tokens, lastRefillTime: now })
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message,
        cause: new RateLimitError(
          message,
          Math.max(1, Math.ceil((1 - tokens) / refillRate / 1000)),
        ),
      })
    }

    tokenBuckets.set(key, {
      tokens: tokens - 1,
      lastRefillTime: now,
    })

    return opts.next()
  })
}

/**
 * Higher-order function to create a rate limiting middleware
 */
export const createRateLimitMiddleware = <
  TOpts extends RateLimitMiddlewareOptions<TNextResult>,
  TNextResult extends Promise<unknown>,
  TMiddlewareReturn,
>(
  trpc: {
    middleware: (fn: (opts: TOpts) => TNextResult) => TMiddlewareReturn
  },
  options: RateLimitOptions<TOpts>,
) => {
  const {
    windowMs,
    maxRequests,
    message = 'Rate limit exceeded. Please try again later.',
    keyPrefix = 'default',
    getCategory,
    getKey,
  } = options

  return trpc.middleware((opts: TOpts) => {
    const { ctx, next } = opts

    const now = Date.now()

    // Use custom key function if provided, otherwise default to IP-based key
    let key: string
    if (getKey) {
      key = `${keyPrefix}:${getKey(opts)}`
    } else {
      const ip = getClientIp(ctx.headers)
      const category = getCategory ? getCategory(opts) : undefined
      key = `${keyPrefix}:${category ? category + ':' : ''}${ip}`
    }

    let record = requestCounts.get(key)

    if (now - lastPruneAt >= PRUNE_INTERVAL_MS) {
      for (const [storedKey, storedRecord] of requestCounts) {
        if (now > storedRecord.resetTime) {
          requestCounts.delete(storedKey)
        }
      }
      lastPruneAt = now
    }

    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + windowMs }
    }

    record.count++
    requestCounts.set(key, record)

    const limit =
      typeof maxRequests === 'function' ? maxRequests(opts) : maxRequests

    // Debug logging
    // console.log('[Rate Limiter]', {
    //   key,
    //   count: record.count,
    //   limit,
    //   timeUntilReset: Math.round((record.resetTime - now) / 1000) + 's',
    // })

    if (record.count > limit) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message,
        cause: new RateLimitError(
          message,
          Math.max(1, Math.ceil((record.resetTime - now) / 1000)),
        ),
      })
    }

    return next()
  })
}
