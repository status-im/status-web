import { Suspense } from 'react'

import { AssetsList } from '@status-im/wallet/components'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'
import { useAssets } from '@/hooks/use-assets'

import { Token } from './-components/token'

export const Route = createFileRoute('/portfolio/assets/$ticker')({
  component: Component,
})

function Component() {
  const params = Route.useParams()
  const ticker = params.ticker
  const router = useRouter()
  const { data: assets, isLoading } = useAssets()

  return (
    <>
      <div className="hidden 2xl:block">
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
          detail={
            <Suspense fallback={<p>Loading token...</p>}>
              <Token ticker={ticker} />
            </Suspense>
          }
          isLoading={isLoading}
        />
      </div>
      <div className="block 2xl:hidden">
        <Token ticker={ticker} />
      </div>
    </>
  )
}
