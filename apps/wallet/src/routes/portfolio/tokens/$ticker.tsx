import { AssetsList, AssetsListLoading } from '@status-im/wallet/components'
import {
  createFileRoute,
  useRouter,
  useRouterState,
} from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'
import { useAssets } from '@/hooks/use-assets'
import { useMediaQuery } from '@/hooks/use-media-query'

import { useWallet } from '../../../providers/wallet-context'
import { Token } from './-components/token'

export const Route = createFileRoute('/portfolio/tokens/$ticker')({
  component: Component,
})

function Component() {
  const { currentWallet, isLoading: isWalletLoading } = useWallet()
  const isDesktop = useMediaQuery('xl')

  const params = Route.useParams()
  const ticker = params.ticker
  const router = useRouter()
  const routerState = useRouterState()
  const pathname = routerState.location.pathname
  const address = currentWallet?.activeAccounts[0].address

  const { data: assets, isLoading } = useAssets({
    address,
    isWalletLoading,
  })

  if (!currentWallet || !address) {
    return null
  }

  return (
    <>
      <div className="hidden 2xl:block">
        <SplittedLayout
          list={
            assets ? (
              <AssetsList
                assets={assets.assets}
                onSelect={url => {
                  const ticker = url.split('/').pop()
                  if (!ticker) return
                  router.navigate({
                    to: '/portfolio/tokens/$ticker',
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
                pathname={pathname}
              />
            ) : (
              <div className="mt-4 flex flex-col gap-3">
                {/* todo: empty state */}
              </div>
            )
          }
          loadingState={<AssetsListLoading />}
          detail={<Token ticker={ticker} address={address} />}
          isLoading={isLoading}
        />
      </div>
      <div className="block 2xl:hidden">
        <Token ticker={ticker} address={address} />
      </div>
    </>
  )
}
