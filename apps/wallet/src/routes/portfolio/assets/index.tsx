import { AssetsList } from '@status-im/wallet/components'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'
import { useAssets } from '@/hooks/use-assets'
import { useDefaultTokens } from '@/hooks/use-default-tokens'

export const Route = createFileRoute('/portfolio/assets/')({
  component: Component,
})

function Component() {
  const router = useRouter()
  const { data, isLoading } = useAssets()

  // todo improve default
  const { assets = [], summary = {} } = data || {}

  const isSomeBalance = summary?.total_balance

  const {
    data: { defaultTokens },
    // isLoading: isLoadingDefaultTokens,
  } = useDefaultTokens(isSomeBalance)

  const assetsToShow = isSomeBalance
    ? [...assets, ...defaultTokens]
    : defaultTokens

  return (
    <SplittedLayout
      list={
        assetsToShow ? (
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
      isLoading={isLoading}
    />
  )
}
