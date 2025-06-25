import {
  CollectiblesGrid as CollectiblesList,
  TabLink,
} from '@status-im/wallet/components'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute, useRouterState } from '@tanstack/react-router'

import { Link } from '@/components/link'

import type { NetworkType } from '@status-im/wallet/data'

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

export const Route = createFileRoute('/portfolio/collectibles/')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Extension | Wallet | Portfolio',
      },
    ],
  }),
})

const getCollectibles = async (
  address: string,
  networks: NetworkType[],
  search?: string,
  sort?: {
    column: 'name' | 'collection'
    direction: 'asc' | 'desc'
  },
) => {
  const url = new URL('http://localhost:3030/api/trpc/collectibles.page')

  url.searchParams.set(
    'input',
    JSON.stringify({
      json: {
        address,
        networks,
        limit: 20,
        offset: 0,
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
  return body.result.data.json.collectibles
}

function RouteComponent() {
  const { location } = useRouterState()
  const pathname = location.pathname

  const handleSelect = (url: string, options?: { scroll?: boolean }) => {
    // Handle the selection of an asset
    console.log('Selected asset URL:', url)
    console.log('Scroll option:', options?.scroll)
  }

  // todo: export trpc client with api router and used instead
  // todo: cache
  const searchParams = new URLSearchParams(window.location.search)
  const search = searchParams.get('search') ?? undefined
  const sortParam = searchParams.get('sort')

  const address = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
  const sort = {
    column:
      (sortParam?.split(',')[0] as 'name' | 'collection') ||
      DEFAULT_SORT.collectibles.column,
    direction:
      (sortParam?.split(',')[1] as 'asc' | 'desc') ||
      DEFAULT_SORT.collectibles.direction,
  }

  const networks = searchParams.get('networks')?.split(',') ?? [
    'ethereum',
    'optimism',
    'arbitrum',
    'base',
    'polygon',
    'bsc',
  ]

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['collectibles', address, networks, search, sort],
      queryFn: async ({ pageParam = 0 }) => {
        const collectibles = await getCollectibles(
          address,
          networks as NetworkType[],
          search,
          sort,
        )
        return {
          collectibles,
          nextPage: pageParam + 1,
        }
      },
      getNextPageParam: lastPage => lastPage.nextPage,
      initialPageParam: 0,
      staleTime: 60 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    })

  const collectibles = useMemo(() => {
    return data?.pages.flatMap(page => page.collectibles ?? []) ?? []
  }, [data?.pages])

  return (
    <div className="grid flex-1 divide-x divide-neutral-10 overflow-hidden">
      <div className="flex divide-x divide-default-neutral-20">
        {/* {list} */}
        <div className="flex grow flex-col 2xl:basis-1/2">
          <div className="sticky top-0 z-20 flex gap-3 px-3 py-2">
            <TabLink href="/portfolio/assets" LinkComponent={Link}>
              Assets
            </TabLink>
            <TabLink
              href="/portfolio/collectibles"
              LinkComponent={Link}
              isActive={pathname === '/portfolio/collectibles'}
            >
              Collectibles
            </TabLink>
          </div>
          <div className="h-[calc(100vh-100px)] overflow-auto px-3">
            {isLoading ? (
              <div className="flex min-h-full items-center justify-center">
                <div className="size-5 animate-spin rounded-full border-b-2 border-neutral-50"></div>
              </div>
            ) : (
              <CollectiblesList
                LinkComponent={Link}
                address={address}
                collectibles={collectibles}
                fetchNextPage={fetchNextPage}
                isFetchingNextPage={isFetchingNextPage}
                pathname={pathname}
                search={search}
                searchParams={searchParams}
                clearSearch={() => {
                  // Clear the search input
                  console.log('Search cleared')
                }}
                hasNextPage={hasNextPage}
                onSelect={handleSelect}
              />
            )}
          </div>
        </div>

        <div className="hidden basis-1/2 flex-col bg-neutral-10 2xl:flex">
          {/* {detail} */}
        </div>
      </div>
    </div>
  )
}
