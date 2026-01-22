import { TRPCError } from '@trpc/server'

/**
 * Rate limiting configuration
 */
export interface RateLimitOptions {
  windowMs: number
  maxRequests: number
  message?: string
  keyPrefix?: string
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
  } = options

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return t.middleware(async (opts: any) => {
    const { ctx, next } = opts
    const ip = ctx.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const now = Date.now()

    const key = `${keyPrefix}:${ip}`
    let record = requestCounts.get(key)

    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + windowMs }
    }

    record.count++
    requestCounts.set(key, record)

    if (record.count > maxRequests) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message,
      })
    }

    return next()
  })
}
