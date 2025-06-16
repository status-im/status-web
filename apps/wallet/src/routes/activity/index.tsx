'use client'

import { createFileRoute } from '@tanstack/react-router'

import { useActivities } from '@/hooks/use-activities'

export const Route = createFileRoute('/activity/')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Extension | Wallet | Activity',
      },
    ],
  }),
})

function RouteComponent() {
  // Hardcoded addresses for testing purposes : https://etherscan.io/address/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
  const fromAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useActivities({ fromAddress })

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>Error loading activities</div>

  // Reverse the page order so the latest transactions are on top
  const activities =
    data?.pages
      .slice()
      .reverse()
      .flatMap(page => page.activities) ?? []

  return (
    <div className="relative flex min-h-full overflow-auto px-1 py-4">
      <pre className="text-sm whitespace-pre-wrap break-all">
        {JSON.stringify(activities, null, 2)}
      </pre>
      {hasNextPage && (
        <button
          className="text-white text-xl fixed right-10 top-20 z-[100] bg-neutral-30 px-5 py-3"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading more...' : 'Load more'}
        </button>
      )}
    </div>
  )
}
