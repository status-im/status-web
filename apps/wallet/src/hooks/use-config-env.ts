import { useQuery } from '@tanstack/react-query'

import type { ApiOutput } from '@status-im/wallet/data'
import type { UseQueryResult } from '@tanstack/react-query'

type ConfigEnv = ApiOutput['config']['env']

const DEFAULT_ENV: ConfigEnv = {
  refreshIntervalMs: 0,
  staleTimeMs: Infinity,
  gcTimeMs: Infinity,
}

type UseConfigEnvResult = Omit<UseQueryResult<ConfigEnv, never>, 'data'> & {
  data: ConfigEnv
}

const useConfigEnv = (): UseConfigEnvResult => {
  const query = useQuery<ConfigEnv, never>({
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
    initialData: DEFAULT_ENV,
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    retry: false,
  })

  return { ...query, data: query.data ?? DEFAULT_ENV }
}

export { useConfigEnv }
