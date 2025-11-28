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

export const Route = createFileRoute('/portfolio/assets/$ticker')({
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

  const findAsset = (ticker: string) =>
    assets?.assets?.find(a => {
      if (ticker.startsWith('0x')) {
        return (
          'contract' in a && a.contract?.toLowerCase() === ticker.toLowerCase()
        )
      } else {
        return a.symbol?.toLowerCase() === ticker.toLowerCase()
      }
    })

  return (
    <>
      <div className="hidden 2xl:block">
        <SplittedLayout
          list={
            <AssetsList
              assets={assets?.assets ?? []}
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
              pathname={pathname}
            />
          }
          loadingState={<AssetsListLoading />}
          detail={
            <Token
              ticker={ticker}
              address={address}
              asset={findAsset(ticker)}
            />
          }
          isLoading={isLoading}
        />
      </div>
      <div className="block 2xl:hidden">
        <Token ticker={ticker} address={address} asset={findAsset(ticker)} />
      </div>
    </>
  )
}
