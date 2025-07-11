import { useInfiniteQuery } from '@tanstack/react-query'

import { QUERY_GC_TIME_MS, QUERY_STALE_TIME_MS } from './constants'

import type { NetworkType } from '@status-im/wallet/data'

const PAGE_LIMIT = 20

const DEFAULT_SORT = {
  assets: { column: 'name', direction: 'asc' as const },
  collectibles: { column: 'name', direction: 'asc' as const },
} as const

export const SORT_OPTIONS = {
  assets: {
    name: 'Name',
    balance: 'Balance',
    '24h': '24H%',
    value: 'Value',
    price: 'Price',
  },
  collectibles: {
    name: 'Name',
    collection: 'Collection',
  },
} as const

type Props = {
  isWalletLoading: boolean
  address?: string
}

const getCollectibles = async (
  address: string,
  networks: NetworkType[],
  search?: string,
  sort?: {
    column: 'name' | 'collection'
    direction: 'asc' | 'desc'
  },
  offset = 0,
) => {
  const url = new URL(
    `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/collectibles.page`,
  )

  url.searchParams.set(
    'input',
    JSON.stringify({
      json: {
        address,
        networks,
        limit: PAGE_LIMIT,
        offset,
        search,
        sort,
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
    throw new Error('Failed to fetch.')
  }

  const body = await response.json()
  return body.result.data.json
}

const useCollectibles = (props: Props) => {
  const { address, isWalletLoading } = props

  const searchParams = new URLSearchParams(window.location.search)
  const search = searchParams.get('search') ?? undefined
  const sortParam = searchParams.get('sort')

  const sort = {
    column:
      (sortParam?.split(',')[0] as 'name' | 'collection') ||
      DEFAULT_SORT.collectibles.column,
    direction:
      (sortParam?.split(',')[1] as 'asc' | 'desc') ||
      DEFAULT_SORT.collectibles.direction,
  }

  const networks = searchParams.get('networks')?.split(',') ?? ['ethereum']

  return useInfiniteQuery({
    queryKey: ['collectibles', address, networks, search, sort],
    queryFn: async ({ pageParam = 0 }) => {
      if (!address) {
        throw new Error('No wallet address available')
      }

      const offset = pageParam * PAGE_LIMIT
      const response = await getCollectibles(
        address,
        networks as NetworkType[],
        search,
        sort,
        offset,
      )
      return {
        collectibles: response.collectibles,
        hasMore: response.hasMore,
        nextPage: pageParam + 1,
      }
    },
    getNextPageParam: lastPage =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    initialPageParam: 0,
    enabled: !!address && !isWalletLoading,
    staleTime: QUERY_STALE_TIME_MS,
    gcTime: QUERY_GC_TIME_MS,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })
}

export { useCollectibles }
