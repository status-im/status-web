import { GraphQLClient } from 'graphql-request'

import type { RequestDocument, Variables } from 'graphql-request'

export const GRAPHQL_ENDPOINT = `https://hasura.infra.status.im/v1/graphql`

export const api = <T, V extends Variables = Variables>(
  operation: RequestDocument,
  variables?: V,
  headers?: Record<string, string>
): Promise<T> => {
  const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
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
