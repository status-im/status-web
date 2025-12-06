import { useQuery, type UseQueryResult } from '@tanstack/react-query'

import { clientEnv } from '~constants/env.client.mjs'

export interface VaultAPYData {
  vaultAddress: string
  apy: number
}

interface VaultsAPYResponse {
  result: VaultAPYData[]
}

export type VaultsAPYMap = Record<string, number>

export function useVaultsAPY(): UseQueryResult<VaultsAPYMap, Error> {
  return useQuery({
    queryKey: ['vaults-apy'],
    queryFn: async (): Promise<VaultsAPYMap> => {
      const response = await fetch(
        `${clientEnv.NEXT_PUBLIC_STATUS_NETWORK_API_URL}/predeposit/vaults`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch vaults APY: ${response.statusText}`)
      }

      const data: VaultsAPYResponse = await response.json()

      const apyMap: VaultsAPYMap = {}
      for (const vault of data.result) {
        apyMap[vault.vaultAddress.toLowerCase()] = vault.apy
      }

      return apyMap
    },
  })
}
