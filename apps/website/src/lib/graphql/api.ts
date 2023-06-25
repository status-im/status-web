/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLClient } from 'graphql-request'

import type { RequestDocument, Variables } from 'graphql-request/src/types'

export const GRAPHQL_ENDPOINT = `https://hasura.infra.status.im/v1/graphql`

export const api = <T = any, K extends Variables = Variables>(
  operation: RequestDocument,
  variables?: K,
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

export const createFetcher = <T = any, K extends Variables = Variables>(
  operation: string,
  variables?: K
): (() => Promise<T>) => {
  return () => api<T, K>(operation, variables)
}
