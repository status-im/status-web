import { ActivityList, FeedbackSection } from '@status-im/wallet/components'
import { createFileRoute } from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'
import { useActivities } from '@/hooks/use-activities'
import { useWallet } from '@/providers/wallet-context'

export const Route = createFileRoute('/portfolio/activity/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { currentWallet, isLoading: isWalletLoading } = useWallet()
  const address = currentWallet?.activeAccounts[0].address

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useActivities({ address })
  const activities = data?.pages.flatMap(page => page.activities) ?? []

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
          />
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {!address ? 'No wallet selected' : 'No activity'}
          </div>
        )
      }
      detail={<FeedbackSection />}
      isLoading={isLoading || isWalletLoading}
    />
  )
}
