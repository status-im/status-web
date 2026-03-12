import { useMemo } from 'react'

import {
  getKarmaTiers,
  KARMA_CHAIN_IDS,
  type KarmaLevel,
} from '@status-im/karma-sdk'
import { useQuery } from '@tanstack/react-query'
import { usePublicClient } from 'wagmi'

const STALE_TIME = 5 * 60 * 1_000

export interface UseProcessedKarmaTiersReturn {
  karmaLevels: KarmaLevel[]
  isLoading: boolean
}

export function useProcessedKarmaTiers(): UseProcessedKarmaTiersReturn {
  const publicClient = usePublicClient({
    chainId: KARMA_CHAIN_IDS.STATUS_SEPOLIA,
  })

  const { data: tiers, isLoading } = useQuery({
    queryKey: ['karma-tiers'],
    queryFn: async () => {
      if (!publicClient) throw new Error('No client')

      return getKarmaTiers(publicClient as any)
    },
    enabled: !!publicClient,
    staleTime: STALE_TIME,
    retry: 2,
  })

  const karmaLevels = useMemo<KarmaLevel[]>(() => {
    if (!tiers || tiers.length === 0) return []
    return tiers.map((tier, index) => ({
      level: index,
      minKarma: BigInt(tier.minKarma),
      maxKarma: BigInt(tier.maxKarma),
    }))
  }, [tiers])

  return { karmaLevels, isLoading }
}
