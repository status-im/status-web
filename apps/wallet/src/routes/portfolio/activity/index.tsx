import { ActivityList } from '@status-im/wallet/components'
import { createFileRoute } from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'
import { useActivities } from '@/hooks/use-activities'

export const Route = createFileRoute('/portfolio/activity/')({
  component: RouteComponent,
})

function RouteComponent() {
  const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'

  const { data, isLoading } = useActivities({ address })
  const activities = data?.pages.flatMap(page => page.activities) ?? []

  return (
    <SplittedLayout
      list={
        activities ? (
          <ActivityList activities={activities} />
        ) : (
          <div className="mt-4 flex flex-col gap-3">Empty state</div>
        )
      }
      isLoading={isLoading}
    />
  )
}
