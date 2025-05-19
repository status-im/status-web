// import { Suspense } from 'react'

import { AssetsList } from '@status-im/wallet/components'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { TabLink } from '@/components/tab-link'

// import { DetailDrawer } from '../../../../portfolio/src/app/[address]/@detail/_drawer'
// import { Loading as LoadingNav } from '../../../../portfolio/src/app/[address]/@nav/loading'

export const Route = createFileRoute('/portfolio/assets/')({
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
      const url = new URL('http://localhost:3030/api/trpc/assets.all')
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
    <div className="grid flex-1 divide-x divide-neutral-10 overflow-hidden xl:grid-cols-[auto_1fr]">
      <div className="hidden px-3 py-2 xl:block">
        {/* {nav} */}
        nav
      </div>

      <div className="flex divide-x divide-default-neutral-20">
        {/* {list} */}
        <div className="flex grow flex-col 2xl:basis-1/2">
          <div className="sticky top-0 z-20 flex gap-3 px-3 py-2">
            <TabLink href="/portfolio/assets">Assets</TabLink>
            <TabLink href="/portfolio/collectibles">Collectibles</TabLink>
          </div>
          <div className="h-[calc(100vh-100px)] overflow-auto px-3">
            {isLoading ? (
              <div className="flex min-h-full items-center justify-center">
                <div className="size-5 animate-spin rounded-full border-b-2 border-neutral-50"></div>
              </div>
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

        <div className="hidden basis-1/2 flex-col bg-neutral-10 2xl:flex">
          {/* {detail} */}
        </div>
      </div>
    </div>
  )
}
