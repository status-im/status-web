import { useMemo } from 'react'

import {
  CollectiblesGrid as CollectiblesList,
  CollectiblesGridSkeleton,
  EmptyState,
  FeedbackSection,
  PinExtension,
} from '@status-im/wallet/components'
import { createFileRoute } from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'
import { useCollectibles } from '@/hooks/use-collectibles'
import { usePinExtension } from '@/hooks/use-pin-extension'
import { LinkCollectible } from '@/routes/portfolio/collectibles/-components/link-collectibe'

import { useWallet } from '../../../providers/wallet-context'

export const Route = createFileRoute('/portfolio/collectibles/')({
  component: Component,
})

function Component() {
  const { currentWallet, isLoading: isWalletLoading } = useWallet()
  const { isPinExtension, handleClose } = usePinExtension()

  const searchParams = new URLSearchParams(window.location.search)
  const search = searchParams.get('search') ?? undefined

  const pathname = window.location.pathname
  const address = currentWallet?.activeAccounts[0].address

  const { data, fetchNextPage, isFetchingNextPage, isLoading, hasNextPage } =
    useCollectibles({
      address,
      isWalletLoading,
    })

  const collectibles = useMemo(() => {
    return data?.pages.flatMap(page => page.collectibles ?? []) ?? []
  }, [data?.pages])

  if (!currentWallet || !address) {
    return null
  }

  return (
    <>
      <SplittedLayout
        list={
          collectibles.length === 0 && !isLoading ? (
            <EmptyState variant="collectible" />
          ) : (
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
          )
        }
        loadingState={<CollectiblesGridSkeleton />}
        detail={<FeedbackSection />}
        isLoading={isLoading}
      />
      {isPinExtension && (
        <div className="absolute right-5 top-20">
          <PinExtension onClose={handleClose} />
        </div>
      )}
    </>
  )
}
