import { useInfiniteQuery } from '@tanstack/react-query'

import type { NetworkType } from '@status-im/wallet/data'

const PAGE_LIMIT = 20

type Props = {
  fromAddress: string
  toAddress: string
}

const getTransfers = async (
  fromAddress: string,
  toAddress: string,
  networks: NetworkType[],
  offset = 0,
) => {
  const url = new URL('http://localhost:3030/api/trpc/activities.page')

  url.searchParams.set(
    'input',
    JSON.stringify({
      json: {
        fromAddress,
        toAddress,
        networks,
        limit: PAGE_LIMIT,
        offset,
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
    hasMore: data.hasMore,
  }
}

export const useActivities = ({ fromAddress, toAddress }: Props) => {
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
    queryKey: ['activities', fromAddress, toAddress, networks],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam * PAGE_LIMIT
      const result = await getTransfers(
        fromAddress,
        toAddress,
        networks as NetworkType[],
        offset,
      )
      return {
        activities: result.activities,
        nextPage: result.hasMore ? pageParam + 1 : undefined,
      }
    },
    getNextPageParam: lastPage => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
