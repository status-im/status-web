import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'

import { hasErrorCause } from '../../../utils/error-cause'
import {
  createRateLimitMiddleware,
  createTokenBucketRateLimitMiddleware,
} from './rate-limiter'

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export async function createTRPCContext(opts: { headers: Headers }) {
  return {
    headers: opts.headers,
  }
}

type ApiContext = Awaited<ReturnType<typeof createTRPCContext>>

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const trpc = initTRPC.context<ApiContext>().create({
  transformer: superjson,
  isServer: true,
  allowOutsideOfServer: false,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const { createCallerFactory } = trpc

/**
 * 3. ROUTER & PROCEDURES
 *
 * @see https://trpc.io/docs/router
 */
export const router = trpc.router

/**
 * Global rate limiting for all API requests
 *
 * RATIONALE:
 * - Protects the API from excessive requests to any domain
 * - Keys by client IP so one caller cannot consume every user's allowance.
 * - Fixed window: 60 seconds, 3000 requests per client
 */
const globalClientRateLimitMiddleware = createRateLimitMiddleware(trpc, {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 3000, // 3000 requests per minute per client
  keyPrefix: 'global-client',
  message:
    'Too many requests to this API domain. Please try again in a minute.',
})

/**
 * Portfolio refresh throttling for expensive aggregate endpoints.
 *
 * Allows a burst of 20 requests, then refills 20 tokens every 10 seconds
 * (120 requests/minute sustained) for each client IP.
 */
const portfolioRefreshRateLimitMiddleware =
  createTokenBucketRateLimitMiddleware(trpc, {
    capacity: 20,
    refillTokens: 20,
    refillIntervalMs: 10 * 1000,
    keyPrefix: 'portfolio-refresh',
    message:
      'Too many portfolio refreshes. Please wait a moment and try again.',
  })

const errorMiddleware = trpc.middleware(async opts => {
  const result = await opts.next()

  if (!result.ok && result.error) {
    const error = result.error
    if (error.code === 'TOO_MANY_REQUESTS') {
      throw error
    }
    if (hasErrorCause(error, 429)) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message:
          'Provider rate limit exceeded. Please try again in a few moments.',
        cause: error.cause,
      })
    }

    throw result.error
  }

  return result
})

// Unauthenticated procedure (Standard) with global client-based rate limiting
export const publicProcedure = trpc.procedure
  .use(globalClientRateLimitMiddleware)
  .use(errorMiddleware)

export const portfolioRefreshProcedure = trpc.procedure
  .use(globalClientRateLimitMiddleware)
  .use(portfolioRefreshRateLimitMiddleware)
  .use(errorMiddleware)

// Status proxies enforce their own aggregate provider quotas. These semantic
// aliases intentionally use only the API-wide per-client abuse guard.
export const marketProcedure = publicProcedure
export const ethRPCProcedure = publicProcedure
export const ethRPCAndMarketProcedure = publicProcedure
