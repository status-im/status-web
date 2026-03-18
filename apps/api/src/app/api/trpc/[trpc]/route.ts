// todo: rate limiting

// @see https://trpc.io/docs/server/adapters/nextjs#route-handlers for nextjs app router implementation
// @see https://github.com/trpc/trpc/blob/8cef54eaf95d8abc8484fe1d454b6620eeb57f2f/www/versioned_docs/version-10.x/further/rpc.md for http rpc spec
// @see https://stackoverflow.com/questions/78800979/trpc-giving-error-when-trying-to-test-with-postman for calling via postman
// @see https://github.com/trpc/trpc/issues/752 for use of superjson

import { type ApiRouter, apiRouter } from '@status-im/wallet/data'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { headers as nextHeaders } from 'next/headers'

// import superjson from 'superjson'
import type { NextRequest } from 'next/server'

export type { ApiRouter }

export const dynamic = 'force-dynamic'

async function handler(request: NextRequest) {
  const url = new URL(request.url)
  const isRpcProxyPath = url.pathname.endsWith('/rpc.proxy')
  const isTrpcFormat = url.searchParams.has('input')

  // Handle JSON-RPC requests to rpc.proxy
  // Transform JSON-RPC format to tRPC format, use fetchRequestHandler, then transform back
  // Skip if already in tRPC format (let fetchRequestHandler handle it normally)
  if (request.method === 'POST' && isRpcProxyPath && !isTrpcFormat) {
    return handleJsonRpcProxy(request)
  }

  if (request.method === 'POST' && isRpcProxyPath && isTrpcFormat) {
    console.log('NORMAL::')
  }

  try {
    const response = await fetchRequestHandler({
      // return await fetchRequestHandler({
      endpoint: '/api/trpc',
      router: apiRouter,
      req: request,
      // allowBatching: true,
      createContext: async () => {
        const headers = new Headers(await nextHeaders())

        return { headers }
      },
      /**
       * @see https://trpc.io/docs/v10/server/error-handling#handling-errors
       */
      // onError: opts => {
      //   error = opts.error.cause
      // },
      responseMeta: opts => {
        // note: opts.error does not have original cause (status code), contrary to onError
        // note!: status code is inferred from TRPCError.code (TOO_MANY_REQUESTS, INTERNAL_SERVER_ERROR, etc.)
        // const error = opts.errors?.[0]

        // todo?: unset cache and revalidate and revalidate based on tag
        // @see https://github.com/vercel/next.js/discussions/57792 for vercel caching error response
        let cacheControl = 'public, max-age=3600'

        if (
          opts?.paths?.some(path =>
            [
              'nodes.broadcastTransaction',
              'nodes.getNonce',
              'nodes.getTransactionCount',
              'nodes.getFeeRate',
              'activities.page',
              'activities.activities',
              'assets.all',
              'assets.nativeToken',
              'assets.token',
              'collectibles.page',
              'market.tokenPrice',
              'rpc.proxy',
            ].includes(path)
          ) ||
          opts?.type === 'mutation'
        ) {
          cacheControl = 'private, no-store'
        }

        return {
          headers: {
            'cache-control': cacheControl,
            ...getCorsHeaders(),
          },
        }
      },
      // unstable_onChunk: undefined,
    })

    const status = response.status
    const result = await response.json()

    return Response.json(result, { status })
  } catch {
    const status = 500
    // @see https://github.com/trpc/trpc/discussions/3640#discussioncomment-5511435 for returning explicit trpc error in superjson construct as result and preventing possible timeouts due to additional parsing
    const result = {
      error: {
        json: {
          message: 'Internal server error',
          code: -32603,
          data: {
            code: 'INTERNAL_SERVER_ERROR',
            httpStatus: status,
            // stack: undefined
          },
        },
      },
    }

    // @see https://vercel.com/docs/errors/FUNCTION_INVOCATION_TIMEOUT for ensuring response is always returned
    return Response.json(result, { status: status })
  }
}

/**
 * Creates a tRPC-formatted request from a JSON-RPC request
 */
function createTrpcRequest(
  request: NextRequest,
  jsonRpcBody: {
    method: string
    params?: unknown[]
    id?: string | number
  },
  chainId?: number
): Request {
  const trpcInput = {
    method: jsonRpcBody.method,
    params: jsonRpcBody.params,
    id: jsonRpcBody.id,
    jsonrpc: '2.0' as const,
    chainId,
  }

  const trpcUrl = new URL(request.url)
  trpcUrl.pathname = '/api/trpc/rpc.proxy'
  trpcUrl.searchParams.set('input', JSON.stringify({ json: trpcInput }))

  return new Request(trpcUrl.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...Object.fromEntries(request.headers),
    },
    body: JSON.stringify({ json: trpcInput }),
  })
}

/**
 * Creates CORS headers for JSON-RPC responses
 */
function getCorsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

/**
 * Handles JSON-RPC requests by transforming them to tRPC format
 */
async function handleJsonRpcProxy(request: NextRequest): Promise<Response> {
  try {
    const url = new URL(request.url)
    const jsonRpcBody = await request.json()
    const chainIdParam = url.searchParams.get('chainId')
    const chainId = chainIdParam ? Number.parseInt(chainIdParam, 10) : undefined

    const trpcRequest = createTrpcRequest(request, jsonRpcBody, chainId)

    const response = await fetchRequestHandler({
      endpoint: '/api/trpc',
      router: apiRouter,
      req: trpcRequest,
      createContext: async () => {
        const headers = new Headers(await nextHeaders())
        return { headers }
      },
      responseMeta: () => ({
        headers: {
          'cache-control': 'private, no-store',
          ...getCorsHeaders(),
        },
      }),
    })

    if (!response.ok) {
      throw new Error(
        `tRPC handler error: ${response.status} ${response.statusText}`
      )
    }

    const trpcResponse = await response.json()
    const jsonRpcResult = extractJsonRpcResult(trpcResponse)

    if (!jsonRpcResult) {
      throw new Error('Failed to process RPC request: no result data')
    }

    return Response.json(jsonRpcResult, {
      headers: {
        ...getCorsHeaders(),
        'cache-control': 'private, no-store',
      },
    })
  } catch (error) {
    let errorId: string | number | null = null
    try {
      const body = await request.clone().json()
      errorId = body.id ?? null
    } catch {
      // Ignore if we can't parse the body for error ID
    }

    return Response.json(
      {
        jsonrpc: '2.0',
        id: errorId,
        error: {
          code: -32603,
          message:
            error instanceof Error ? error.message : 'Internal server error',
        },
      },
      {
        status: 500,
        headers: getCorsHeaders(),
      }
    )
  }
}

/**
 * Extracts JSON-RPC response from tRPC response structure
 * tRPC wraps responses: { "result": { "data": { "json": {...} } } }
 */
function extractJsonRpcResult(trpcResponse: unknown): unknown {
  if (Array.isArray(trpcResponse)) {
    // Batch format
    const data = trpcResponse[0]?.result?.data
    const result =
      data &&
      typeof data === 'object' &&
      'json' in data &&
      data.json !== undefined
        ? data.json
        : data

    if (!result && trpcResponse[0]?.error) {
      const trpcError = trpcResponse[0].error
      throw new Error(
        trpcError.message ||
          trpcError.json?.message ||
          'Failed to process RPC request'
      )
    }
    return result
  }

  if (
    trpcResponse &&
    typeof trpcResponse === 'object' &&
    'result' in trpcResponse &&
    trpcResponse.result &&
    typeof trpcResponse.result === 'object' &&
    'data' in trpcResponse.result
  ) {
    // Single call success
    const data = trpcResponse.result.data
    return data &&
      typeof data === 'object' &&
      'json' in data &&
      data.json !== undefined
      ? data.json
      : data
  }

  if (
    trpcResponse &&
    typeof trpcResponse === 'object' &&
    'error' in trpcResponse
  ) {
    // Single call error
    const trpcError = trpcResponse.error as {
      message?: string
      json?: { message?: string }
    }
    throw new Error(
      trpcError.message ||
        trpcError.json?.message ||
        'Failed to process RPC request'
    )
  }

  throw new Error('Failed to process RPC request: unexpected response format')
}

export { handler as GET, handler as POST }
