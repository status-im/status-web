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
  const fromAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  const toAddress = '0x1810c87a85B1d3AFf71F3bd7fe45e4dc03EFF10E'

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useActivities({ fromAddress, toAddress })

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>Error loading activities</div>

  const activities = data?.pages.flatMap(page => page.activities) ?? []

  return (
    <div className="flex min-h-full overflow-auto px-1 py-4">
      <pre className="text-sm whitespace-pre-wrap break-all">
        {JSON.stringify(activities, null, 2)}
      </pre>
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading more...' : 'Load more'}
        </button>
      )}
    </div>
  )
}
