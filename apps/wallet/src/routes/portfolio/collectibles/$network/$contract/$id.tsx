import { Suspense } from 'react'

import { CollectiblesGrid as CollectiblesList } from '@status-im/wallet/components'
import {
  createFileRoute,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'

import { useWallet } from '../../../../../providers/wallet-context'
import { Collectible } from '../../-components/collectible'
import { LinkCollectible } from '../../-components/link-collectibe'

import type { NetworkType } from '@status-im/wallet/data'

export const Route = createFileRoute(
  '/portfolio/collectibles/$network/$contract/$id',
)({
  component: Component,
})

function Component() {
  const { currentWallet, isLoading: isWalletLoading } = useWallet()
  const router = useRouter()
  const routerState = useRouterState()
  const params = Route.useParams()
  const { network, contract, id } = params

  const searchParams = new URLSearchParams(window.location.search)
  const search = searchParams.get('search') ?? undefined

  const pathname = routerState.location.pathname
  const address = currentWallet?.activeAccounts[0].address

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, isLoading } =
    useCollectibles({
      address,
      isWalletLoading,
    })

  const collectibles = useMemo(() => {
    return data?.pages.flatMap(page => page.collectibles ?? []) ?? []
  }, [data?.pages])

  if (!currentWallet || !address) {
    return <div>No wallet selected</div>
  }

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
              onSelect={url => {
                const [network, contract, id] = url.split('/').slice(-3)
                router.navigate({
                  to: '/portfolio/collectibles/$network/$contract/$id',
                  params: { network, contract, id },
                })
              }}
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
