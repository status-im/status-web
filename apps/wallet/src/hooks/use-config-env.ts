import { useQuery } from '@tanstack/react-query'

import type { ApiOutput } from '@status-im/wallet/data'
import type { UseQueryResult } from '@tanstack/react-query'

const DEFAULT_ENV = {
  refreshIntervalMs: 0,
  staleTimeMs: 0,
  gcTimeMs: 0,
}

const useConfigEnv = (): UseQueryResult<ApiOutput['config']['env'], Error> => {
  return useQuery({
    queryKey: ['config-env'],
    queryFn: async () => {
      try {
        const url = new URL(
          `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/config.env`,
        )
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          return DEFAULT_ENV
        }

        const body = await response.json()
        return body.result.data.json
      } catch {
        return DEFAULT_ENV
      }
    },
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 60 * 60 * 1000, // 1 hour
  })
}

export { useConfigEnv }
