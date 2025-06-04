// import 'server-only'

import { cache } from 'react'

import { headers as nextHeaders } from 'next/headers'

import { createCaller } from '../api'

const createContext = cache(async () => {
  const headers = new Headers(await nextHeaders())

  return {
    headers,
  }
})

export async function createAPI() {
  const ctx = await createContext()
  const api = createCaller(ctx)

  return api
}
