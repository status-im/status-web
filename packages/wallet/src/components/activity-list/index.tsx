'use client'

import { useEffect, useState } from 'react'

import { useInfiniteLoading } from '../../hooks/use-infinite-loading'
import { ActivityItem } from './components/activity-item'

import type { ApiOutput } from '../../data'

const fromAddress = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'

const mockPendingTransactions: Activity[] = [
  {
    hash: '0x29e89a248d456b1bc75a70b7b00d0d26a0ca2419acf116145b7501a354578c9d',
    from: fromAddress,
    to: '0x742d35cc6634c0532925a3b8d4c9db96c4b4d8b6',
    value: 0.5,
    asset: 'ETH',
    network: 'ethereum',
    status: 'pending',
    uniqueId: 'pending-1',
    category: 'external',
    blockNum: '0',
    metadata: {
      blockTimestamp: new Date().toISOString(),
    },
    rawContract: {
      value: '500000000000000000',
      address: null,
      decimal: '18',
    },
    eurRate: 0,
  },
  {
    hash: '0xd724d0a819d08fe3546bb16e9bb4caf597632139c72c7fd9144ddfabf4995fec',
    from: fromAddress,
    to: '0xC82fd7E60E7eFD9675edc8aa498B59Bea1aCa3f4',
    value: 100,
    asset: 'USDC',
    network: 'optimism',
    status: 'pending',
    uniqueId: 'pending-2',
    category: 'external',
    blockNum: '0',
    metadata: {
      // 1 hour before https://etherscan.io/tx/0xa5e5f0f93422fa64e3ad4156f0f72a154c3add2a262270ee4d217b46dcd672f5
      blockTimestamp: '2025-07-02T11:45:47.000Z',
    },
    rawContract: {
      value: '100000000',
      address: '0xA0b86a33E6441b8c4C8C8C8C8C8C8C8C8C8C8C8C',
      decimal: '6',
    },
    eurRate: 0,
  },
]

type Activity = ApiOutput['activities']['activities']['activities'][0]

export type ActivityListProps = {
  activities: Activity[]
  userAddress: string
  onLoadMore: () => void
  hasNextPage: boolean
  isLoadingMore: boolean
}

const sortActivitiesByTime = (activities: Activity[]) => {
  return activities.sort(
    (a, b) =>
      new Date(b.metadata.blockTimestamp).getTime() -
      new Date(a.metadata.blockTimestamp).getTime(),
  )
}

const ActivityList = (props: ActivityListProps) => {
  const { activities, userAddress, onLoadMore, hasNextPage, isLoadingMore } =
    props
  const [allActivities, setAllActivities] = useState<Activity[]>([])

  const { endOfPageRef, isLoading } = useInfiniteLoading({
    rootMargin: '200px',
    fetchNextPage: onLoadMore,
    isFetchingNextPage: isLoadingMore,
    hasNextPage: hasNextPage,
  })

  useEffect(() => {
    const loadAndSortActivities = () => {
      setAllActivities(sortActivitiesByTime(activities))
    }

    const loadFromStorage = async () => {
      if (typeof window !== 'undefined' && window.chrome?.storage?.local) {
        try {
          // Set pending transactions to storage for testing
          await new Promise<void>(resolve => {
            window.chrome!.storage!.local.set(
              { pendingTransactions: mockPendingTransactions },
              resolve,
            )
          })

          const result = await new Promise<{
            pendingTransactions?: Activity[]
          }>(resolve => {
            window.chrome!.storage!.local.get(['pendingTransactions'], resolve)
          })

          console.log('storage result', result)

          if (
            result?.pendingTransactions &&
            result?.pendingTransactions?.length > 0
          ) {
            const combined = [...result.pendingTransactions, ...activities]
            setAllActivities(sortActivitiesByTime(combined))
          } else {
            loadAndSortActivities()
          }
        } catch (error) {
          console.error('Failed to load pending transactions:', error)
          loadAndSortActivities()
        }
      } else {
        loadAndSortActivities()
      }
    }

    loadFromStorage()
  }, [activities])

  return (
    <div className="pb-10">
      <div className="flex min-h-[calc(100svh-362px)] w-full overflow-auto">
        <div className="w-full">
          {allActivities.map(activity => {
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
