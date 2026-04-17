import { useInfiniteQuery } from '@tanstack/react-query'

import { getAnvilCollectiblesPage } from '@/lib/anvil-collectibles'

import { useConfigEnv } from './use-config-env'

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

      const response = await getAnvilCollectiblesPage({
        address,
        search,
        sort,
      })

      return {
        collectibles: response.collectibles,
        hasMore: response.hasMore,
        nextPage: usePageKeys
          ? { pages: response.pages }
          : (pageParam as number) + 1,
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
