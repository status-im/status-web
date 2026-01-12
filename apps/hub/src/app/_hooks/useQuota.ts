import { useQuery, type UseQueryResult } from '@tanstack/react-query'

import { getQuota } from '~constants/siwe'

interface QuotaData {
  used: number
  total: number
}

interface QuotaResponse {
  address: string
  tier: {
    name: string
    quotaPerEpoch: string
  }
  epoch: {
    id: string
    txCount: string
    remainingQuota: string
    resetsAt: string
  }
  denyList: {
    isActive: boolean
    expiresAt: string | null
  }
  lastUpdatedAt: string
}

interface UseQuotaOptions {
  enabled?: boolean
  refetchInterval?: number
}

const QUERY_KEY_PREFIX = 'quota' as const
const DEFAULT_REFETCH_INTERVAL = 60_000

export function useQuota(
  options?: UseQuotaOptions
): UseQueryResult<QuotaData, Error> {
  const { enabled = true, refetchInterval = DEFAULT_REFETCH_INTERVAL } =
    options ?? {}

  return useQuery({
    queryKey: [QUERY_KEY_PREFIX] as const,
    queryFn: async (): Promise<QuotaData> => {
      const result = await getQuota()
      if (!result) {
        throw new Error('Failed to fetch quota')
      }

      const quotaResponse = result as QuotaResponse
      const total =
        Number.parseInt(quotaResponse.tier.quotaPerEpoch, 10) || 10000
      const remainingQuota =
        Number.parseInt(quotaResponse.epoch.remainingQuota, 10) || 0
      const used = total - remainingQuota

      return {
        used,
        total,
      }
    },
    enabled,
    refetchInterval,
  })
}
