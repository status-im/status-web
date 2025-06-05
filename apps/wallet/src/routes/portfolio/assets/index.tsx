import { AssetsList } from '@status-im/wallet/components'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'
import { useAssets } from '@/hooks/use-assets'
import { useMediaQuery } from '@/hooks/use-media-query'

export const Route = createFileRoute('/portfolio/assets/')({
  component: Component,
})

function Component() {
  const router = useRouter()
  const { data: assets, isLoading } = useAssets()
  const isDesktop = useMediaQuery('xl')

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
                ...(!isDesktop && {
                  viewTransition: true,
                }),
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
