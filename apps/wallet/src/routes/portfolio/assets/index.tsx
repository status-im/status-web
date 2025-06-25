// import { Suspense } from 'react'

import { AssetsList, PinExtension, TabLink } from '@status-im/wallet/components'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouterState } from '@tanstack/react-router'

import { Link } from '@/components/link'
import { usePinExtension } from '@/hooks/use-pin-extension'

import { useWallet } from '../../../providers/wallet-context'

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
  const { location } = useRouterState()
  const pathname = location.pathname
  const { currentWallet, isLoading: isWalletLoading } = useWallet()
  const { isPinExtension, handleClose } = usePinExtension()

  const handleSelect = (url: string, options?: { scroll?: boolean }) => {
    // Handle the selection of an asset
    console.log('Selected asset URL:', url)
    console.log('Scroll option:', options?.scroll)
  }

  // todo: export trpc client with api router and used instead
  // todo: cache
  const { data: assets, isLoading } = useQuery({
    queryKey: ['assets', currentWallet?.activeAccounts[0].address],
    queryFn: async () => {
      if (!currentWallet?.activeAccounts[0].address) {
        throw new Error('No wallet address available')
      }

      const url = new URL(
        `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/assets.all`,
      )
      url.searchParams.set(
        'input',
        // encodeURIComponent(
        JSON.stringify({
          json: {
            address: currentWallet.activeAccounts[0].address,
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

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch assets.')
      }

      const body = await response.json()
      return body.result.data.json.assets
    },
    enabled: !!currentWallet?.activeAccounts[0].address && !isWalletLoading,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  if (!currentWallet) {
    return <div>No wallet selected</div>
  }

  return (
    <div className="grid flex-1 divide-x divide-neutral-10 overflow-hidden">
      <div className="flex divide-x divide-default-neutral-20">
        <div className="flex grow flex-col">
          <div className="sticky top-0 z-20 flex gap-3 px-3 py-2">
            <TabLink
              href="/portfolio/assets"
              LinkComponent={Link}
              isActive={pathname === '/portfolio/assets'}
            >
              Assets
            </TabLink>
            <TabLink href="/portfolio/collectibles" LinkComponent={Link}>
              Collectibles
            </TabLink>
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

      {isPinExtension && (
        <div className="absolute right-5 top-20">
          <PinExtension onClose={handleClose} />
        </div>
      )}
    </div>
  )
}
