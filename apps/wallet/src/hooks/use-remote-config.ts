import { useQuery } from '@tanstack/react-query'

import type { ApiOutput } from '@status-im/wallet/data'
import type { UseQueryResult } from '@tanstack/react-query'

const useRemoteConfig = (): UseQueryResult<
  ApiOutput['assets']['remoteConfig'],
  Error
> => {
  return useQuery({
    queryKey: ['remote-config'],
    queryFn: async () => {
      const url = new URL(
        `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/assets.remoteConfig`,
      )

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(response.statusText, { cause: response.status })
      }

      const body = await response.json()

      return body.result.data.json
    },
  })
}

export { useRemoteConfig }
