import { useQuery } from '@tanstack/react-query'

import { useConfigEnv } from './use-config-env'

import type { ApiOutput } from '@status-im/wallet/data'
import type { UseQueryResult } from '@tanstack/react-query'

type Props = {
  isWalletLoading: boolean
  address?: string
}

// todo: export trpc client with api router and used instead
// todo: cache
const useAssets = (
  props: Props,
): UseQueryResult<ApiOutput['assets']['all'], Error> => {
  const { address, isWalletLoading } = props
  const { data: configEnv } = useConfigEnv()

  return useQuery({
    queryKey: ['assets', address],
    queryFn: async () => {
      if (!address) {
        throw new Error('No wallet address available')
      }

      const url = new URL(
        `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/assets.all`,
      )
      url.searchParams.set(
        'input',
        JSON.stringify({
          json: {
            address,
            networks: ['ethereum'],
          },
        }),
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
    enabled: !!address && !isWalletLoading,
    staleTime: configEnv?.staleTimeMs ?? 0,
    gcTime: configEnv?.gcTimeMs ?? 0,
  })
}

export { useAssets }
