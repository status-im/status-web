import { TRPCError } from '@trpc/server'

/**
 * Rate limiting configuration
 */
export interface RateLimitOptions {
  windowMs: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  maxRequests: number | ((opts: any) => number)
  message?: string
  keyPrefix?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCategory?: (opts: any) => string | undefined
}

const requestCounts = new Map<string, { count: number; resetTime: number }>()

/**
 * Higher-order function to create a rate limiting middleware
 */
export const createRateLimitMiddleware = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: { middleware: (fn: any) => any },
  options: RateLimitOptions,
) => {
  const {
    windowMs,
    maxRequests,
    message = 'Rate limit exceeded. Please try again later.',
    keyPrefix = 'default',
    getCategory,
  } = options

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return t.middleware(async (opts: any) => {
    const { ctx, next } = opts
    const ip = ctx.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const now = Date.now()

    const category = getCategory ? getCategory(opts) : undefined
    const key = `${keyPrefix}:${category ? category + ':' : ''}${ip}`
    let record = requestCounts.get(key)

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
