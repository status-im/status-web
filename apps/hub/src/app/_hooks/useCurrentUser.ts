import {
  type CurrentUser,
  getCurrentUser,
  KarmaApiClient,
} from '@status-im/karma-sdk'
import {
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'

import { clientEnv } from '~constants/env.client.mjs'

const QUERY_KEY_PREFIX = 'current-user' as const

let queryClientInstance: ReturnType<typeof useQueryClient> | null = null

export function useCurrentUser(): UseQueryResult<CurrentUser, Error> {
  const queryClient = useQueryClient()
  if (!queryClientInstance) {
    queryClientInstance = queryClient
  }

  const apiClient = new KarmaApiClient({
    baseUrl: clientEnv.NEXT_PUBLIC_STATUS_NETWORK_API_URL,
  })

  return useQuery({
    queryKey: [QUERY_KEY_PREFIX] as const,
    queryFn: () => getCurrentUser(apiClient),
    refetchInterval: 60_000,
  })
}

export function invalidateCurrentUser(): void {
  if (queryClientInstance) {
    queryClientInstance.invalidateQueries({
      queryKey: [QUERY_KEY_PREFIX],
    })
  }
}
