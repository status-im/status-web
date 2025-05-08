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

async function handler(request: NextRequest) {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    router: apiRouter,
    req: request,
    // allowBatching: true,
    createContext: async () => {
      const headers = new Headers(await nextHeaders())

      return { headers }
    },
    // onError: opts => {
    //   // console.error('opts::', opts)
    // },
    responseMeta: () => {
      return {
        headers: {
          'cache-control': 'public, max-age=3600', // for public data (e.g. configs, token lists?)
          // 'cache-control': 'private, no-store', // for user-specific data
        },
      }
    },
  })
}

export { handler as GET, handler as POST }
