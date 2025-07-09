'use client'

import { useInfiniteLoading } from '../../hooks/use-infinite-loading'
import { ActivityItem } from './components/activity-item'

import type { ApiOutput } from '../../data'

type Activity = ApiOutput['activities']['activities']['activities'][0]

export type ActivityListProps = {
  activities: Activity[]
  userAddress: string
  onLoadMore: () => void
  hasNextPage: boolean
  isLoadingMore: boolean
}

const ActivityList = (props: ActivityListProps) => {
  const { activities, userAddress, onLoadMore, hasNextPage, isLoadingMore } =
    props

  const { endOfPageRef, isLoading } = useInfiniteLoading({
    rootMargin: '200px',
    fetchNextPage: onLoadMore,
    isFetchingNextPage: isLoadingMore,
    hasNextPage: hasNextPage,
  })

  return (
    <div className="pb-10">
      <div className="flex min-h-[calc(100svh-362px)] w-full overflow-auto">
        <div className="w-full">
          {activities.map(activity => {
            return (
              <ActivityItem
                key={activity.uniqueId}
                activity={activity}
                userAddress={userAddress}
              />
            )
          })}
          {hasNextPage && (
            <div
              ref={endOfPageRef}
              className="flex h-20 items-center justify-center"
            >
              {isLoading ? (
                <div className="text-13 font-400 text-neutral-50">
                  Loading more activities...
                </div>
              ) : (
                <div className="h-1" />
              )}
            </div>
          )}

          {!hasNextPage && activities.length > 0 && (
            <div className="py-8 text-center text-13 font-400 text-neutral-40">
              No more activities to load
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { ActivityList }
