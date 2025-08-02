import { useInfiniteQuery } from '@tanstack/react-query'

import { QUERY_GC_TIME_MS, QUERY_STALE_TIME_MS } from './constants'

import type { Activity, NetworkType } from '@status-im/wallet/data'

const PAGE_LIMIT = 20

type Props = {
  address: string | undefined
}

const getTransfers = async (
  address: string,
  networks: NetworkType[],
  pageKeys: Partial<Record<NetworkType, string>> = {},
) => {
  const url = new URL(
    `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/activities.page`,
  )

  url.searchParams.set(
    'input',
    JSON.stringify({
      json: {
        address,
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

export const useActivities = ({ address }: Props) => {
  const searchParams = new URLSearchParams(window.location.search)

  const networks = searchParams.get('networks')?.split(',') ?? ['ethereum']

  return useInfiniteQuery({
    queryKey: ['activities', address, networks],
    queryFn: async ({ pageParam = {} }) => {
      if (!address) {
        return { activities: [], nextPage: {} }
      }
      const result = await getTransfers(
        address,
        networks as NetworkType[],
        pageParam,
      )
      return {
        activities: result.activities,
        nextPage: result.nextPageKeys,
      }
    },
    enabled: !!address,
    getNextPageParam: (lastPage: {
      activities: Activity[]
      nextPage: Partial<Record<NetworkType, string | undefined>>
    }) => {
      const hasMore = Object.values(lastPage.nextPage).some(Boolean)
      return hasMore ? lastPage.nextPage : undefined
    },

    initialPageParam: {},
    staleTime: QUERY_STALE_TIME_MS,
    gcTime: QUERY_GC_TIME_MS,
  })
}
