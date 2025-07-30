import { useToast } from '@status-im/components'
import {
  CollectiblesGrid as CollectiblesList,
  CollectiblesGridSkeleton,
} from '@status-im/wallet/components'
import { ERROR_MESSAGES } from '@status-im/wallet/constants'
import { createFileRoute, useRouterState } from '@tanstack/react-router'

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

  const routerState = useRouterState()
  const params = Route.useParams()
  const { network, contract, id } = params

  const toast = useToast()

  const searchParams = new URLSearchParams(window.location.search)
  const search = searchParams.get('search') ?? undefined

  const pathname = routerState.location.pathname
  const address = currentWallet?.activeAccounts[0].address

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    isError,
    isFetchNextPageError,
    isFetchPreviousPageError,
  } = useCollectibles({
    address,
    isWalletLoading,
  })

  const collectibles = useMemo(() => {
    return data?.pages.flatMap(page => page.collectibles ?? []) ?? []
  }, [data?.pages])

  // Show error toast if there is an error fetching collectibles
  useEffect(() => {
    if (isError) {
      toast.negative(ERROR_MESSAGES.COLLECTIBLES)
    }
  }, [isError, toast])

  // Show error toast if there is an error fetching next page of collectibles
  useEffect(() => {
    if (isFetchNextPageError) {
      toast.negative(ERROR_MESSAGES.COLLECTIBLES_PARTIAL)
    }
  }, [isFetchNextPageError, toast])

  // Show error toast if there is an error fetching previous page of collectibles
  useEffect(() => {
    if (isFetchPreviousPageError) {
      toast.negative(ERROR_MESSAGES.COLLECTIBLES_PARTIAL)
    }
  }, [isFetchPreviousPageError, toast])

  if (!currentWallet || !address) {
    return null
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
            />
          }
          loadingState={<CollectiblesGridSkeleton />}
          isLoading={isLoading}
          detail={
            <Collectible
              network={network as NetworkType}
              contract={contract}
              id={id}
            />
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
