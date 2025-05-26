import { Suspense } from 'react'

import { AssetsList } from '@status-im/wallet/components'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'
import { Token } from '@/components/token'
import { useAssets } from '@/hooks/use-assets'

export const Route = createFileRoute('/portfolio/assets/$ticker')({
  component: Component,
})

function Component() {
  const params = Route.useParams()
  const ticker = params.ticker
  const router = useRouter()
  const { data: assets, isLoading } = useAssets()

  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1280)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!isDesktop) {
    // ✅ Mobile: render just the detail
    return (
      <Suspense fallback={<p>Loading...</p>}>
        <Token ticker={ticker} />
      </Suspense>
    )
  }

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
      detail={
        <Suspense fallback={<p>Loading token...</p>}>
          <Token ticker={ticker} />
        </Suspense>
      }
      isLoading={isLoading}
    />
  )
}
