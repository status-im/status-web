import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'

import { createRateLimitMiddleware } from './rate-limiter'

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
 * Rate limiting for Market Proxy
 *
 * RATIONALE:
 * - Aligned with the Market Proxy's CoinGecko API rate limit (30 RPM for Demo/NoKey).
 * - Reference: https://github.com/status-im/market-proxy/blob/master/market-fetcher/config.yaml#L14-L19
 */
const marketRateLimitMiddleware = createRateLimitMiddleware(trpc, {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
  keyPrefix: 'market',
  message: 'Market data rate limit exceeded. Please try again in a minute.',
})

/**
 * RPC method categorization based on eth-rpc-proxy specs:
 * - permanent: Immutable data (blocks, receipts)
 * - short: Semi-static data (balances, calls)
 * - minimal: Highly dynamic data (gas prices, fees, nonces)
 */
const RPC_METHOD_CATEGORY_MAP: Record<
  string,
  'permanent' | 'short' | 'minimal'
> = {
  'nodes.getFeeRate': 'minimal',
  'nodes.getNonce': 'short',
  'nodes.broadcastTransaction': 'minimal',
  // Default to short for other potential node-related calls
}

/**
 * Category-specific limits (RPM)
 * - permanent: Highly cacheable, higher limit allowed as hits likely won't reach provider.
 * - short: Standard semi-static data.
 * - minimal: Highly dynamic data, more restrictive to protect provider capacity.
 */
const RPC_CATEGORY_LIMITS: Record<string, number> = {
  permanent: 60,
  short: 30,
  minimal: 15,
}

/**
 * Rate limiting for ETH RPC Proxy (Alchemy)
 *
 * RATIONALE:
 * - Aligned with the Alchemy Tier (30 RPM total for free bucket, but split by category).
 * - Reference: https://github.com/status-im/eth-rpc-proxy/blob/master/nginx-proxy/cache.md#yaml-configuration-system
 */
const ethRPCRateLimitMiddleware = createRateLimitMiddleware(trpc, {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: opts => {
    const category = RPC_METHOD_CATEGORY_MAP[opts.path] ?? 'short'
    return RPC_CATEGORY_LIMITS[category]
  },
  keyPrefix: 'eth-rpc',
  getCategory: opts => RPC_METHOD_CATEGORY_MAP[opts.path] ?? 'short',
  message: 'RPC request rate limit exceeded. Please try again in a minute.',
})

/**
 * Global rate limiting for all API requests
 *
 * RATIONALE:
 * - Protects the API from excessive requests to any domain
 * - Keys by host header to limit per domain (regardless of IP address)
 * - Fixed window: 60 seconds, 3000 requests per host
 */
const globalHostRateLimitMiddleware = createRateLimitMiddleware(trpc, {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 3000, // 3000 requests per minute per host
  keyPrefix: 'global-host',
  getKey: opts => {
    const host = opts.ctx.headers.get('host') || 'unknown'
    return host
  },
  message:
    'Too many requests to this API domain. Please try again in a minute.',
})

const errorMiddleware = trpc.middleware(async opts => {
  const result = await opts.next()

  if (!result.ok && result.error) {
    throw result.error
  }

  return result
})

// Unauthenticated procedure (Standard) with global host-based rate limiting
export const publicProcedure = trpc.procedure
  .use(globalHostRateLimitMiddleware)
  .use(errorMiddleware)

// Procedure for Market data endpoints
export const marketProcedure = publicProcedure.use(marketRateLimitMiddleware)

// Procedure for Node/RPC endpoints
export const ethRPCProcedure = publicProcedure.use(ethRPCRateLimitMiddleware)
