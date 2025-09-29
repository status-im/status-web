import { GraphQLClient } from 'graphql-request'

import { clientEnv } from '~/config/env.client.mjs'

import type { RequestDocument, Variables } from 'graphql-request'

export const api = <T, V extends Variables = Variables>(
  operation: RequestDocument,
  variables?: V,
  headers?: Record<string, string>
): Promise<T> => {
  const client = new GraphQLClient(clientEnv.NEXT_PUBLIC_HASURA_API_URL, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })

  return client.request<T>(operation, variables as Variables)
}

export const createFetcher = <T, V extends Variables = Variables>(
  operation: string,
  variables?: V
) => {
  return () => api<T, V>(operation, variables)
}
