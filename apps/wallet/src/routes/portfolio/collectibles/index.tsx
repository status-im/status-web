import { useMemo } from 'react'

import { useToast } from '@status-im/components'
import {
  CollectiblesGrid as CollectiblesList,
  CollectiblesGridSkeleton,
  EmptyState,
  FeedbackSection,
  PinExtension,
} from '@status-im/wallet/components'
import { ERROR_MESSAGES } from '@status-im/wallet/constants'
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

  const toast = useToast()

  const searchParams = new URLSearchParams(window.location.search)
  const search = searchParams.get('search') ?? undefined

  const pathname = window.location.pathname
  const address = currentWallet?.activeAccounts[0].address

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    hasNextPage,
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
        <div className="absolute right-5 top-20 z-20">
          <PinExtension onClose={handleClose} />
        </div>
      )}
    </>
  )
}
