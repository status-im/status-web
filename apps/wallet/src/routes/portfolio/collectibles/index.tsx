import { CollectiblesGrid as CollectiblesList } from '@status-im/wallet/components'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  createFileRoute,
  Link as LinkBase,
  useRouter,
} from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'

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

const PAGE_LIMIT = 20

const Link = (props: LinkProps) => {
  const { href, className, children } = props
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('URL recebido:', href)
    const [network, contract, id] = href.split('/').slice(-3)
    console.log('Parâmetros extraídos:', { network, contract, id })
    router.navigate({
      to: '/portfolio/collectibles/$network/$contract/$id',
      params: { network, contract, id },
    })
  }

  return (
    <LinkBase to={href} className={className} onClick={handleClick}>
      {children}
    </LinkBase>
  )
}

export const Route = createFileRoute('/portfolio/collectibles/')({
  component: Component,
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
  offset = 0,
) => {
  const url = new URL('http://localhost:3030/api/trpc/collectibles.page')

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
  return body.result.data.json.collectibles
}

function Component() {
  const router = useRouter()

  const searchParams = new URLSearchParams(window.location.search)
  const search = searchParams.get('search') ?? undefined
  const sortParam = searchParams.get('sort')

  const pathname = window.location.pathname
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
        const offset = pageParam * PAGE_LIMIT
        const collectibles = await getCollectibles(
          address,
          networks as NetworkType[],
          search,
          sort,
          offset,
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
    <SplittedLayout
      list={
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
          onSelect={url => {
            const [network, contract, id] = url.split('/').slice(-3)
            router.navigate({
              to: '/portfolio/collectibles/$network/$contract/$id',
              params: { network, contract, id },
            })
          }}
        />
      }
      detail={<>Detail</>}
      isLoading={isLoading}
    />
  )
}
