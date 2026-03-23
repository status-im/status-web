import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'

import { clientEnv } from '~constants/env.client.mjs'

export interface VaultAPRData {
  vaultAddress: string
  apr: number
}

interface VaultsAPRResponse {
  result: VaultAPRData[]
}

export type VaultsAPRMap = Record<string, number | undefined>

export function useVaultsAPR(): UseQueryResult<VaultsAPRMap, Error> {
  const t = useTranslations()

  return useQuery({
    queryKey: ['vaults-apr'],
    queryFn: async (): Promise<VaultsAPRMap> => {
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
        throw new Error(
          t('errors.failed_fetch_vaults_apr', { error: response.statusText })
        )
      }

      const data: VaultsAPRResponse = await response.json()

      const aprMap: VaultsAPRMap = {}
      for (const vault of data.result) {
        aprMap[vault.vaultAddress.toLowerCase()] = vault.apr
      }

      return aprMap
    },
  })
}
