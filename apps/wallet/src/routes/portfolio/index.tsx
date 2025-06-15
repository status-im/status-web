// import { Suspense } from 'react'

import { AssetsList } from '@status-im/wallet/components'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'

import { apiClient } from '../../providers/api-client'
import { useWallet } from '../../providers/wallet-context'

// import { DetailDrawer } from '../../../../portfolio/src/app/[address]/@detail/_drawer'
// import { Loading as LoadingNav } from '../../../../portfolio/src/app/[address]/@nav/loading'

export const Route = createFileRoute('/portfolio/')({
  component: RouteComponent,
  beforeLoad: async () => {
    const wallets = await apiClient.wallet.all.query()
    if (!wallets || wallets.length === 0) {
      throw redirect({ to: '/onboarding' })
    }
  },
  head: () => ({
    meta: [
      {
        title: 'Extension | Wallet | Portfolio',
      },
    ],
  }),
})

function RouteComponent() {
  const { currentWallet, isLoading: isWalletLoading } = useWallet()

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
    <div className="flex min-h-full overflow-hidden px-1">
      <div className="grid flex-1 grid-cols-1 divide-x divide-neutral-10 overflow-hidden xl:grid-cols-[auto_1fr]">
        <div className="flex divide-x divide-default-neutral-20 overflow-auto">
          <div className="flex w-full">
            {isWalletLoading || isLoading ? (
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

          <div className="hidden basis-1/2 flex-col xl:flex">Detail</div>
        </div>
      </div>
    </div>
  )
}
