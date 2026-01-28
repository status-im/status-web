import { TRPCError } from '@trpc/server'

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
}

export interface RateLimitOptions<TOpts extends RateLimitMiddlewareOptions> {
  windowMs: number
  maxRequests: number | ((opts: TOpts) => number)
  message?: string
  keyPrefix?: string
  getCategory?: (opts: TOpts) => string | undefined
  getKey?: (opts: TOpts) => string
}

const requestCounts = new Map<string, { count: number; resetTime: number }>()

let lastPruneAt = 0

const PRUNE_INTERVAL_MS = 60 * 1000

export const clearRateLimitCache = () => {
  requestCounts.clear()
  lastPruneAt = 0
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
      const ip =
        ctx.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
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

    if (record.count > limit) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message,
      })
    }

    return next()
  })
}
