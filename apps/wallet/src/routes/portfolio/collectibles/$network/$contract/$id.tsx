import { Suspense } from 'react'

import { CollectiblesGrid as CollectiblesList } from '@status-im/wallet/components'
import { createFileRoute, useRouterState } from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'

import { Collectible } from '../../-components/collectible'
import { LinkCollectible } from '../../-components/link-collectibe'

import type { NetworkType } from '@status-im/wallet/data'

export const Route = createFileRoute(
  '/portfolio/collectibles/$network/$contract/$id',
)({
  component: Component,
})

function Component() {
  const routerState = useRouterState()
  const params = Route.useParams()
  const { network, contract, id } = params

  const searchParams = new URLSearchParams(window.location.search)
  const search = searchParams.get('search') ?? undefined

  const pathname = routerState.location.pathname

  // todo?: replace address
  const address = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } =
    useCollectibles({
      address,
    })

  const collectibles = useMemo(() => {
    return data?.pages.flatMap(page => page.collectibles ?? []) ?? []
  }, [data?.pages])

  return (
    <>
      <div className="hidden 2xl:block">
        <SplittedLayout
          list={
            <CollectiblesList
              LinkComponent={LinkCollectible}
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
            />
          }
          isLoading={isLoading}
          detail={
            <Suspense fallback={<p>Loading collectible...</p>}>
              <Collectible
                network={network as NetworkType}
                contract={contract}
                id={id}
              />
            </Suspense>
          }
        />
      </div>
      <div className="block 2xl:hidden">
        <Collectible
          network={network as NetworkType}
          contract={contract}
          id={id}
        />
      </div>
    </>
  )
}
