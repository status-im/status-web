// import 'server-only'

import { cache } from 'react'

import { headers as nextHeaders } from 'next/headers'

import { createCaller } from '../api'
import { createTRPCContext } from '../api/lib/trpc'

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const headers = new Headers(await nextHeaders())

  return createTRPCContext({
    headers,
  })
})

export const api = createCaller(createContext)
