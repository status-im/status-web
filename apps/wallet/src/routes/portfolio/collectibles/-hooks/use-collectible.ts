import { useEffect } from 'react'

import { useToast } from '@status-im/components'
import { ERROR_MESSAGES } from '@status-im/wallet/constants'
import { useQuery } from '@tanstack/react-query'

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
    queryFn: async () => {
      const url = new URL(
        `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/collectibles.collectible`,
      )
      url.searchParams.set(
        'input',
        JSON.stringify({
          json: { contract, tokenId: id, network },
        }),
      )

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error(response.statusText, { cause: response.status })
      }

      const body = await response.json()
      return body.result.data.json
    },
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
