// todo: rate limiting

// @see https://trpc.io/docs/server/adapters/nextjs#route-handlers for nextjs app router implementation
// @see https://github.com/trpc/trpc/blob/8cef54eaf95d8abc8484fe1d454b6620eeb57f2f/www/versioned_docs/version-10.x/further/rpc.md for http rpc spec
// @see https://stackoverflow.com/questions/78800979/trpc-giving-error-when-trying-to-test-with-postman for calling via postman
// @see https://github.com/trpc/trpc/issues/752 for use of superjson

import {
  type ApiRouter,
  apiRouter,
  createCaller,
  createTRPCContext,
} from '@status-im/wallet/data'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { headers as nextHeaders } from 'next/headers'

// import superjson from 'superjson'
import type { NextRequest } from 'next/server'

export type { ApiRouter }

export const dynamic = 'force-dynamic'

async function handler(request: NextRequest) {
  // Handle JSON-RPC requests to rpc.proxy
  // tRPC's fetchRequestHandler expects tRPC format, not JSON-RPC format
  // So we need to intercept JSON-RPC requests and translate them
  const url = new URL(request.url)
  const isRpcProxyPath = url.pathname.endsWith('/rpc.proxy')

  // Handle CORS preflight for rpc.proxy
  if (request.method === 'OPTIONS' && isRpcProxyPath) {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  if (request.method === 'POST' && isRpcProxyPath) {
    let body: any
    try {
      body = await request.json()
      // Extract chainId from query parameters (wagmi can include it in the URL)
      const chainIdParam = url.searchParams.get('chainId')
      const chainId = chainIdParam
        ? Number.parseInt(chainIdParam, 10)
        : undefined

      const headers = new Headers(await nextHeaders())
      const ctx = await createTRPCContext({ headers })
      const caller = createCaller(ctx)

      const result = await caller.rpc.proxy({
        method: body.method,
        params: body.params,
        id: body.id,
        jsonrpc: '2.0',
        chainId,
      })

      return Response.json(result, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Request-Method': '*',
          'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
          'Access-Control-Allow-Headers': '*',
          'cache-control': 'private, no-store',
        },
      })
    } catch (error) {
      console.error('RPC proxy error:', error)

      let errorId: string | number | null = null
      try {
        errorId = body?.id ?? null
      } catch {
        // Ignore errors when accessing body
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
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
            'Access-Control-Allow-Headers': '*',
          },
        }
      )
    }
  }

  // let error: Error | undefined

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
          // status: 429,
          headers: {
            'cache-control': cacheControl,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Method': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
            'Access-Control-Allow-Headers': '*',
          },
        }
      },
      // unstable_onChunk: undefined,
    })

    const status = response.status
    const result = await response.json()

    // Get CORS headers from responseMeta
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Request-Method': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
      'Access-Control-Allow-Headers': '*',
    }

    return Response.json(
      result,
      // { status: result.httpStatus }
      // { status: 429 }
      {
        status: status,
        headers: corsHeaders,
      }
    )
  } catch (error) {
    console.error(error)

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
    return Response.json(result, {
      status: status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Request-Method': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
        'Access-Control-Allow-Headers': '*',
      },
    })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Request-Method': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
      'Access-Control-Allow-Headers': '*',
    },
  })
}

export { handler as GET, handler as POST }
