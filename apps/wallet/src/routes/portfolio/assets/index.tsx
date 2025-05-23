import { AssetsList } from '@status-im/wallet/components'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'
import { apiClient } from '@/providers/api-client'
import { useWallet } from '@/providers/wallet-context'

export const Route = createFileRoute('/portfolio/assets/')({
  component: Component,
})

function Component() {
  const router = useRouter()

  // const handleSelect = (url: string, options?: { scroll?: boolean }) => {
  //   // Handle the selection of an asset
  //   console.log('Selected asset URL:', url)
  //   console.log('Scroll option:', options?.scroll)
  // }

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

  return (
    <SplittedLayout
      list={
        assets ? (
          <AssetsList
            assets={assets}
            onSelect={url => {
              const ticker = url.split('/').pop()
              if (!ticker) return
              router.navigate({
                to: '/portfolio/assets/$ticker',
                params: { ticker },
              })
            }}
            clearSearch={() => {
              console.log('Search cleared')
            }}
            searchParams={new URLSearchParams()}
            pathname="/portfolio/assets"
          />
        ) : (
          <div className="mt-4 flex flex-col gap-3">Empty state</div>
        )
      }
      detail={<>Detail for asset</>}
      isLoading={isLoading}
    />
  )
}
