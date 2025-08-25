import { useQuery } from '@tanstack/react-query'

import type { ApiOutput } from '@status-im/wallet/data'

const NETWORKS = ['ethereum'] as const

export const useEthBalance = (address: string, enabled: boolean = true) => {
  return useQuery<ApiOutput['assets']['nativeToken']>({
    queryKey: ['ethBalance', address],
    queryFn: async () => {
      const url = new URL(
        `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/assets.nativeToken`,
      )
      url.searchParams.set(
        'input',
        JSON.stringify({
          json: {
            address,
            networks: NETWORKS,
            symbol: 'ETH',
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
        throw new Error('Failed to fetch ETH balance.')
      }

      const body = await response.json()
      return body.result.data.json
    },
    enabled,
    staleTime: 30 * 1000,
    gcTime: 60 * 1000,
  })
}
