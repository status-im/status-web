import { useToast } from '@status-im/components'
import {
  ActivityList,
  ActivityListSkeleton,
  EmptyState,
  EmptyStateActions,
} from '@status-im/wallet/components'
import { ERROR_MESSAGES } from '@status-im/wallet/constants'
import { createFileRoute } from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'
import { useActivities } from '@/hooks/use-activities'
import { usePendingTransactionsCleanup } from '@/hooks/use-pending-transactions-cleanup'
import { usePendingTransactions } from '@/providers/pending-transactions-context'
import { useWallet } from '@/providers/wallet-context'

export const Route = createFileRoute('/portfolio/activity/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { currentWallet, isLoading: isWalletLoading } = useWallet()
  const { pendingTransactions } = usePendingTransactions()
  const address = currentWallet?.activeAccounts[0].address

  const toast = useToast()

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useActivities({ address })
  const activities = data?.pages.flatMap(page => page.activities) ?? []

  usePendingTransactionsCleanup(activities)

  // Show error toast if there is an error fetching activities
  useEffect(() => {
    if (isError) {
      toast.negative(ERROR_MESSAGES.ACTIVITIES)
    }
  }, [isError, toast])

  return (
    <SplittedLayout
      list={
        activities.length > 0 && address ? (
          <ActivityList
            activities={activities}
            userAddress={address}
            onLoadMore={fetchNextPage}
            hasNextPage={hasNextPage}
            isLoadingMore={isFetchingNextPage}
            pendingTransactions={pendingTransactions}
          />
        ) : (
          <div className="flex flex-1 flex-col gap-3">
            {!address ? (
              <p className="mt-4">No wallet selected</p>
            ) : (
              <EmptyState variant="activity" />
            )}
          </div>
        )
      }
      loadingState={<ActivityListSkeleton />}
      detail={<EmptyStateActions />}
      isLoading={isLoading || isWalletLoading}
    />
  )
}
