// import { Suspense } from 'react'

import { AssetsList, FeedbackSection } from '@status-im/wallet/components'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

// import { DetailDrawer } from '../../../../portfolio/src/app/[address]/@detail/_drawer'
// import { Loading as LoadingNav } from '../../../../portfolio/src/app/[address]/@nav/loading'

export const Route = createFileRoute('/portfolio/')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Extension | Wallet | Portfolio',
      },
    ],
  }),
})

function RouteComponent() {
  const handleSelect = (url: string, options?: { scroll?: boolean }) => {
    // Handle the selection of an asset
    console.log('Selected asset URL:', url)
    console.log('Scroll option:', options?.scroll)
  }

  // todo: export trpc client with api router and used instead
  // todo: cache
  const { data: assets, isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const url = new URL(
        `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/assets.all`,
      )
      url.searchParams.set(
        'input',
        // encodeURIComponent(
        JSON.stringify({
          json: {
            address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
            networks: [
              'ethereum',
              'optimism',
              'arbitrum',
              'base',
              'polygon',
              'bsc',
            ],
          },
        }),
        // ),
      )

      // note: http://localhost:3030/api/trpc/assets.all?input={"json":{"address":"0xd8da6bf26964af9d7eed9e03e53415d37aa96045","networks":["ethereum","optimism","arbitrum","base","polygon","bsc"]}}
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch.')
      }

      const body = await response.json()

      return body.result.data.json.assets
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  return (
    <div className="flex min-h-full overflow-hidden px-1">
      <div className="grid flex-1 grid-cols-1 divide-x divide-neutral-10 overflow-hidden xl:grid-cols-[auto_1fr]">
        <div className="flex divide-x divide-default-neutral-20 overflow-auto">
          <div className="flex w-full">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <AssetsList
                assets={assets}
                onSelect={handleSelect}
                clearSearch={() => {
                  // Clear the search input
                  console.log('Search cleared')
                }}
                searchParams={new URLSearchParams()}
                pathname="/portfolio/"
              />
            )}
          </div>
        </div>

        <div className="hidden h-full xl:flex">
          <FeedbackSection />
        </div>
      </div>
    </div>
  )
}
