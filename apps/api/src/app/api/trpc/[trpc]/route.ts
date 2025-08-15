// todo: rate limiting

// @see https://trpc.io/docs/server/adapters/nextjs#route-handlers for nextjs app router implementation
// @see https://github.com/trpc/trpc/blob/8cef54eaf95d8abc8484fe1d454b6620eeb57f2f/www/versioned_docs/version-10.x/further/rpc.md for http rpc spec
// @see https://stackoverflow.com/questions/78800979/trpc-giving-error-when-trying-to-test-with-postman for calling via postman
// @see https://github.com/trpc/trpc/issues/752 for use of superjson

import { type ApiRouter, apiRouter } from '@status-im/wallet/data'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { headers as nextHeaders } from 'next/headers'

import type { NextRequest } from 'next/server'

export type { ApiRouter }

// todo: use nodejs runtime
export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const format = (url: string, method: string, body?: unknown) => {
  const u = new URL(url, 'http://localhost')
  let fullUrl = u.origin + u.pathname + (u.search || '')

  if (method === 'POST' && body) {
    try {
      const bodyStr = typeof body === 'string' ? body : JSON.stringify(body)
      const separator = fullUrl.includes('?') ? '&' : '?'
      fullUrl += `${separator}body=${encodeURIComponent(bodyStr)}`
    } catch {
      // ignore
    }
  }

  return fullUrl
}

const originalFetch = globalThis.fetch
globalThis.fetch = async (input, init) => {
  const method = (init && init.method) || 'GET'
  const url =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url

  try {
    const response = await originalFetch(input, init)
    const fullUrl = format(url, method, init?.body)
    console.log(` ${method} ${fullUrl} ${response.status}`)

    return response
  } catch (err) {
    const fullUrl = format(url, method, init?.body)
    console.log(` ${method} ${fullUrl} 500`)

    throw err
  }
}

async function handler(request: NextRequest) {
  // let error: Error | undefined

  // const response = await fetchRequestHandler({
  return await fetchRequestHandler({
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
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    },
    // unstable_onChunk: undefined,
  })

  // const result = await response.json()

  // return Response.json(
  //   result
  //   // { status: result.httpStatus }
  //   // { status: 429 }
  // )
}

export { handler as GET, handler as POST }
