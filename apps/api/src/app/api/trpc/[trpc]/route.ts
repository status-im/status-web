// todo: rate limiting

// @see https://trpc.io/docs/server/adapters/nextjs#route-handlers for nextjs app router implementation
// @see https://github.com/trpc/trpc/blob/8cef54eaf95d8abc8484fe1d454b6620eeb57f2f/www/versioned_docs/version-10.x/further/rpc.md for http rpc spec
// @see https://stackoverflow.com/questions/78800979/trpc-giving-error-when-trying-to-test-with-postman for calling via postman
// @see https://github.com/trpc/trpc/issues/752 for use of superjson
// @see https://blog.logrocket.com/using-cors-next-js-handle-cross-origin-requests/ for CORS configuration

import { type ApiRouter, apiRouter } from '@status-im/wallet/data'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { headers as nextHeaders } from 'next/headers'

import { getCorsHeaders } from '../../../../config/cors'

import type { NextRequest } from 'next/server'

// import superjson from 'superjson'

export type { ApiRouter }

export const dynamic = 'force-dynamic'

// Layer 3: Application-level CORS headers
// Multi-layer CORS protection strategy:
// 1. Middleware (src/middleware.ts) - First line of defense, handles OPTIONS preflight
// 2. next.config.mjs headers() - Framework-level headers applied to all API routes
// 3. Route handler explicit headers (this file) - Application-level headers for tRPC responses
// 4. crossOrigin config in next.config.mjs - Next.js resource loading configuration
//
// Note: nextjs-cors package is installed but primarily designed for Pages Router.
// For App Router with tRPC, our multi-layer approach provides better control.

async function handler(request: NextRequest) {
  const origin = request.headers.get('origin')
  const method = request.method
  const url = request.url
  const pathname = new URL(url).pathname

  console.log('[CORS] Request received:', {
    method,
    origin,
    url,
    pathname,
    // Check if middleware headers might be present (they would be in response headers, not request)
    userAgent: request.headers.get('user-agent'),
  })

  // Get CORS headers based on origin
  const corsHeaders = getCorsHeaders(origin)

  console.log('[CORS] CORS headers determined:', {
    origin,
    allowedOrigin: corsHeaders['Access-Control-Allow-Origin'],
  })

  // Handle OPTIONS preflight requests
  if (request.method === 'OPTIONS') {
    console.log(
      '[CORS] Handling OPTIONS preflight request from origin:',
      origin
    )
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    })
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

        console.log('[CORS] responseMeta called:', {
          paths: opts?.paths,
          type: opts?.type,
          errors: opts?.errors?.map(e => ({
            code: e.code,
            message: e.message,
          })),
        })

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
            ].includes(path)
          ) ||
          opts?.type === 'mutation'
        ) {
          cacheControl = 'private, no-store'
        }

        const metaHeaders = {
          'cache-control': cacheControl,
          ...corsHeaders,
        }

        console.log('[CORS] responseMeta returning headers:', metaHeaders)

        return {
          // status: 429,
          headers: metaHeaders,
        }
      },
      // unstable_onChunk: undefined,
    })

    // Read response body and status
    const status = response.status
    const originalHeaders = Object.fromEntries(response.headers.entries())

    console.log('[CORS] tRPC response received:', {
      status,
      originalHeaders,
      hasCorsHeaders: {
        'Access-Control-Allow-Origin': response.headers.get(
          'Access-Control-Allow-Origin'
        ),
        'Access-Control-Allow-Methods': response.headers.get(
          'Access-Control-Allow-Methods'
        ),
      },
    })

    const bodyText = await response.text()

    // Parse JSON if possible, otherwise use text
    let result: unknown
    try {
      result = bodyText ? JSON.parse(bodyText) : {}
    } catch (parseError) {
      console.log('[CORS] Failed to parse response as JSON, using text:', {
        bodyTextLength: bodyText.length,
        parseError,
      })
      result = bodyText
    }

    // Preserve original response headers and merge CORS headers
    const responseHeaders = new Headers(response.headers)
    // Always ensure CORS headers are present (override any existing ones)
    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, String(value))
    })

    const finalHeaders = Object.fromEntries(responseHeaders.entries())

    console.log('[CORS] Final response being sent:', {
      status,
      headers: finalHeaders,
      origin,
    })

    // Return response with CORS headers always included
    return new Response(JSON.stringify(result), {
      status: status,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error('[CORS] Error in handler:', {
      error,
      errorMessage: error instanceof Error ? error.message : String(error),
      errorStack: error instanceof Error ? error.stack : undefined,
      origin,
      method,
      url,
    })

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
    // Ensure CORS headers are included even in error responses
    console.log('[CORS] Returning error response with CORS headers:', {
      status,
      headers: corsHeaders,
      origin,
    })

    return Response.json(result, {
      status: status,
      headers: corsHeaders,
    })
  }
}

export { handler as GET, handler as OPTIONS, handler as POST }
