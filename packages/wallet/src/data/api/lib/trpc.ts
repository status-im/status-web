import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'

import { hasErrorCause } from '../../../utils/error-cause'
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

type RPCCategory = 'permanent' | 'short' | 'minimal'

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
 * Request throttling for Market-backed routes
 *
 * RATIONALE:
 * - Uses the Market Proxy's CoinGecko limit as a conservative per-client
 *   request budget.
 * - This counts API procedures, not internal upstream fan-out. The Market
 *   Proxy remains responsible for its aggregate provider quota.
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
const RPC_METHOD_CATEGORY_MAP: Record<string, RPCCategory> = {
  // Permanent: Immutable data (60 RPM)
  eth_getBlockByNumber: 'permanent',
  eth_getTransactionReceipt: 'permanent',
  alchemy_getAssetTransfers: 'permanent',
  'assets.nativeTokenBalanceChart': 'permanent',
  'assets.tokenBalanceChart': 'permanent',
  'activities.page': 'permanent',
  'activities.activities': 'permanent',
  'collectibles.page': 'permanent',
  'collectibles.collectible': 'permanent',

  // Short: Semi-static data (40 RPM). Keep raw JSON-RPC methods aligned with
  // eth-rpc-proxy/go-proxy-cache/cache_rules.yaml.
  eth_getBalance: 'short',
  eth_estimateGas: 'short',
  eth_maxPriorityFeePerGas: 'short',
  eth_blockNumber: 'short',
  'nodes.getNonce': 'short',
  eth_getTransactionCount: 'short',
  eth_feeHistory: 'short',
  alchemy_getTokenBalances: 'short',
  'assets.all': 'short',
  'assets.nativeToken': 'short',
  'assets.token': 'short',
  'assets.nativeTokenPriceChart': 'short',
  'assets.tokenPriceChart': 'short',

  // Minimal: Highly dynamic data (15 RPM)
  'nodes.getFeeRate': 'minimal',
  'nodes.broadcastTransaction': 'minimal',
  eth_sendRawTransaction: 'minimal',
}

/**
 * Category-specific limits (RPM)
 * - permanent: Highly cacheable, higher limit allowed as hits likely won't reach provider.
 * - short: Standard semi-static data.
 * - minimal: Highly dynamic data, more restrictive to protect provider capacity.
 */
const RPC_CATEGORY_LIMITS: Record<string, number> = {
  permanent: 60,
  short: 40, // default was 30
  minimal: 15,
}

function getRpcMethod(rawInput: unknown): string | undefined {
  if (!rawInput || typeof rawInput !== 'object') return undefined

  const input = rawInput as {
    method?: unknown
    json?: { method?: unknown }
  }
  const method = input.method ?? input.json?.method

  return typeof method === 'string' ? method : undefined
}

export function getRpcCategory(
  path: string | undefined,
  rawInput?: unknown,
): RPCCategory {
  const method = path === 'rpc.proxy' ? getRpcMethod(rawInput) : undefined
  return RPC_METHOD_CATEGORY_MAP[method ?? path ?? ''] ?? 'short'
}

/**
 * Request throttling for ETH RPC-backed routes
 *
 * RATIONALE:
 * - Applies conservative per-client request budgets split by cache category.
 * - This counts API procedures, not internal upstream fan-out. The ETH RPC
 *   Proxy remains responsible for its aggregate provider quota.
 * - Reference: https://github.com/status-im/eth-rpc-proxy/blob/master/nginx-proxy/cache.md#yaml-configuration-system
 */
const ethRPCRateLimitMiddleware = createRateLimitMiddleware(trpc, {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: opts => {
    const category = getRpcCategory(opts.path, opts.rawInput)
    return RPC_CATEGORY_LIMITS[category]
  },
  keyPrefix: 'eth-rpc',
  getCategory: opts => getRpcCategory(opts.path, opts.rawInput),
  message: 'RPC request rate limit exceeded. Please try again in a minute.',
})

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

const errorMiddleware = trpc.middleware(async opts => {
  const result = await opts.next()

  if (!result.ok && result.error) {
    const error = result.error
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

// Procedure for Market data endpoints
export const marketProcedure = publicProcedure.use(marketRateLimitMiddleware)

// Procedure for Node/RPC endpoints
export const ethRPCProcedure = publicProcedure.use(ethRPCRateLimitMiddleware)

// Procedures that call both upstreams must consume both independent budgets.
export const ethRPCAndMarketProcedure = ethRPCProcedure.use(
  marketRateLimitMiddleware,
)
