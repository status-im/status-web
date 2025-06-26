import { CollectiblesGrid as CollectiblesList } from '@status-im/wallet/components'
import { useInfiniteQuery } from '@tanstack/react-query'
import { createFileRoute, Link as LinkBase } from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'

import { useWallet } from '../../../providers/wallet-context'

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

type LinkProps = {
  href: string
  className?: string
  children: React.ReactNode
}

const Link = (props: LinkProps) => {
  const { href, className, children } = props
  return (
    <LinkBase to={href} className={className}>
      {children}
    </LinkBase>
  )
}

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
  const { currentWallet, isLoading: isWalletLoading } = useWallet()

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

  const pathname = window.location.pathname
  const address = currentWallet?.activeAccounts[0].address
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
        if (!address) {
          throw new Error('No wallet address available')
        }

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
      enabled: !!address && !isWalletLoading,
      staleTime: 60 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    })

  const collectibles = useMemo(() => {
    return data?.pages.flatMap(page => page.collectibles ?? []) ?? []
  }, [data?.pages])

  if (!currentWallet) {
    return <div>No wallet selected</div>
  }

  return (
    <SplittedLayout
      list={
        <CollectiblesList
          LinkComponent={Link}
          address={address!}
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
      }
      detail={<>Detail</>}
      isLoading={isLoading}
    />
  )
}
