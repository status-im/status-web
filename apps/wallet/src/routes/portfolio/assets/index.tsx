// import { Suspense } from 'react'

import { AssetsList, PinExtension } from '@status-im/wallet/components'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'
import { usePinExtension } from '@/hooks/use-pin-extension'

import { useWallet } from '../../../providers/wallet-context'

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
    <>
      <SplittedLayout
        list={
          assets ? (
            <AssetsList
              assets={assets}
              onSelect={handleSelect}
              clearSearch={() => {
                console.log('Search cleared')
              }}
              searchParams={new URLSearchParams()}
              pathname="/portfolio/"
            />
          ) : (
            <div className="mt-4 flex flex-col gap-3">Empty state</div>
          )
        }
        detail={<>Detail for asset</>}
        isLoading={isLoading}
      />
      {isPinExtension && (
        <div className="absolute right-5 top-20">
          <PinExtension onClose={handleClose} />
        </div>
      )}
    </>
  )
}
