import { useEffect } from 'react'

import { useToast } from '@status-im/components'
import { ERROR_MESSAGES } from '@status-im/wallet/constants'
import { useQuery } from '@tanstack/react-query'

import { getAnvilCollectible } from '@/lib/anvil-collectibles'

import type { NetworkType } from '@status-im/wallet/data'

const STALE_TIME_MS = 15_000
const GC_TIME_MS = 60 * 60 * 1000

export const useCollectible = (
  network: NetworkType,
  contract: string,
  id: string,
) => {
  const toast = useToast()

  const query = useQuery({
    queryKey: ['collectible', network, contract, id],
    queryFn: async () => getAnvilCollectible({ contract, tokenId: id }),
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
  })

  useEffect(() => {
    if (query.isError) {
      toast.negative(ERROR_MESSAGES.COLLECTIBLE_INFO)
    }
  }, [query.isError, toast])

  return query
}
