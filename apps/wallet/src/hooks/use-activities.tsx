import { useInfiniteQuery } from '@tanstack/react-query'

import type { NetworkType } from '@status-im/wallet/data'

const PAGE_LIMIT = 20

type Props = {
  fromAddress: string
}

const getTransfers = async (
  fromAddress: string,
  networks: NetworkType[],
  pageKeys: Partial<Record<NetworkType, string>> = {},
) => {
  const url = new URL('http://localhost:3030/api/trpc/activities.page')

  url.searchParams.set(
    'input',
    JSON.stringify({
      json: {
        fromAddress,
        networks,
        limit: PAGE_LIMIT,
        pageKeys,
      },
    }),
  )

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`Failed to fetch activities. ${errorBody}`)
  }

  const body = await response.json()
  const data = body.result?.data?.json

  if (!data) {
    throw new Error('Unexpected response structure.')
  }

  return {
    activities: data.activities,
    nextPageKeys: data.nextPageKeys,
  }
}

export const useActivities = ({ fromAddress }: Props) => {
  const searchParams = new URLSearchParams(window.location.search)

  const networks = searchParams.get('networks')?.split(',') ?? [
    'ethereum',
    // 'optimism',
    // 'arbitrum',
    // 'base',
    // 'polygon',
    // 'bsc',
  ]

  return useInfiniteQuery({
    queryKey: ['activities', fromAddress, networks],
    queryFn: async ({ pageParam = {} }) => {
      const result = await getTransfers(
        fromAddress,
        networks as NetworkType[],
        pageParam,
      )
      return {
        activities: result.activities,
        nextPage: result.nextPageKeys,
      }
    },
    getNextPageParam: (lastPage: {
      activities: []
      nextPage: Partial<Record<NetworkType, string | undefined>>
    }) => {
      const hasMore = Object.values(lastPage.nextPage).some(Boolean)
      return hasMore ? lastPage.nextPage : undefined
    },

    initialPageParam: {},
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
