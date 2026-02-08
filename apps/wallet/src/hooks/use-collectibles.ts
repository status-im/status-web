import { useInfiniteQuery } from '@tanstack/react-query'

import { useConfigEnv } from './use-config-env'

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
  pages?: Record<NetworkType, string>,
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
        pages,
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
    throw new Error(response.statusText, { cause: response.status })
  }

  const body = await response.json()
  return body.result.data.json
}

const useCollectibles = (props: Props) => {
  const { address, isWalletLoading } = props
  const { data: configEnv } = useConfigEnv()

  const searchParams = new URLSearchParams(window.location.search)
  const search = searchParams.get('search') ?? undefined
  const sortParam = searchParams.get('sort')

  // Sort comes from URL, defaults to name asc
  const sort = {
    column:
      (sortParam?.split(',')[0] as 'name' | 'collection') ||
      DEFAULT_SORT.collectibles.column,
    direction:
      (sortParam?.split(',')[1] as 'asc' | 'desc') ||
      DEFAULT_SORT.collectibles.direction,
  }

  const networks = searchParams.get('networks')?.split(',') ?? ['ethereum']

  // Use pageKey pagination only for the default sort with no search
  const isDefaultSort =
    sort.column === DEFAULT_SORT.collectibles.column &&
    sort.direction === DEFAULT_SORT.collectibles.direction

  const usePageKeys = !search && isDefaultSort

  return useInfiniteQuery({
    queryKey: ['collectibles', address, networks, search, sort, usePageKeys],
    // pageParam is either { pages } for pageKey mode or a numeric page index for offset mode
    queryFn: async ({ pageParam = usePageKeys ? { pages: {} } : 0 }) => {
      if (!address) {
        throw new Error('No wallet address available')
      }

      if (usePageKeys) {
        // Fast path: continue from server-provided page keys
        const pages =
          typeof pageParam === 'object' && pageParam
            ? (pageParam as { pages?: Record<NetworkType, string> }).pages
            : undefined

        const response = await getCollectibles(
          address,
          networks as NetworkType[],
          search,
          sort,
          0,
          pages,
        )
        return {
          collectibles: response.collectibles,
          hasMore: response.hasMore,
          nextPage: { pages: response.pages },
        }
      }

      const offset = (pageParam as number) * PAGE_LIMIT

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
        nextPage: (pageParam as number) + 1,
      }
    },
    getNextPageParam: lastPage =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    initialPageParam: usePageKeys ? { pages: {} } : 0,
    enabled: !!address && !isWalletLoading,
    staleTime: configEnv.staleTimeMs,
    gcTime: configEnv.gcTimeMs,
  })
}

export { useCollectibles }
