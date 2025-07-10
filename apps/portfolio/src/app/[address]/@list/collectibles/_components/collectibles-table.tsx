'use client'

import { useMemo } from 'react'

import { CollectiblesGrid as CollectiblesList } from '@status-im/wallet/components'
import { useInfiniteQuery } from '@tanstack/react-query'
import { usePathname, useSearchParams } from 'next/navigation'

import { Link } from '../../../../_components/link'
import { DEFAULT_SORT } from '../../../../_constants'
import { useSearchAndSort } from '../../../../_hooks/use-search-and-sort'

import type { GetCollectiblesProps, GetCollectiblesResponse } from '../_actions'
import type { Collectible, NetworkType } from '@status-im/wallet/data'

type Props = {
  initialCollectibles: Collectible[]
  address: string
  networks?: NetworkType[]
  getCollectibles: (
    props: GetCollectiblesProps
  ) => Promise<GetCollectiblesResponse>
  hasMore?: boolean
}

const CollectiblesGrid = ({
  initialCollectibles,
  address,
  networks = ['ethereum'],
  getCollectibles,
  hasMore: initialHasMore,
}: Props) => {
  const searchParams = useSearchParams()
  const search = searchParams.get('search') ?? undefined
  const sortParam = searchParams.get('sort')

  const pathname = usePathname()
  const { clearSearch } = useSearchAndSort()

  const sort = {
    column:
      (sortParam?.split(',')[0] as 'name' | 'collection') ||
      DEFAULT_SORT.collectibles.column,
    direction:
      (sortParam?.split(',')[1] as 'asc' | 'desc') ||
      DEFAULT_SORT.collectibles.direction,
  }

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      refetchOnWindowFocus: false,
      queryKey: ['collectibles', address, networks, search, sort],
      queryFn: async ({ pageParam = { offset: 0 } }) => {
        const response = await getCollectibles({
          address,
          networks,
          limit: 20,
          offset: pageParam.offset,
          search,
          sort,
        })

        return {
          collectibles: response.collectibles,
          hasMore: response.hasMore,
          offset: pageParam.offset + 20,
        }
      },
      getNextPageParam: lastPage => {
        if (!lastPage.hasMore) {
          return undefined
        }

        return {
          offset: lastPage.offset,
        }
      },
      initialData: {
        pages: [
          {
            collectibles: initialCollectibles,
            hasMore: initialHasMore,
            offset: 20,
          },
        ],
        pageParams: [{ offset: 0 }],
      },
      initialPageParam: { offset: 0 },
      staleTime: 0,
    })

  const collectibles = useMemo(() => {
    return data.pages.flatMap(page => page.collectibles ?? [])
  }, [data.pages])

  return (
    <CollectiblesList
      LinkComponent={Link}
      address={address}
      collectibles={collectibles}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
      pathname={pathname}
      search={search}
      searchParams={searchParams}
      clearSearch={clearSearch}
      hasNextPage={hasNextPage}
    />
  )
}

export { CollectiblesGrid }
