import {
  AssetsList,
  FeedbackSection,
  PinExtension,
} from '@status-im/wallet/components'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'
import { useAssets } from '@/hooks/use-assets'
import { useMediaQuery } from '@/hooks/use-media-query'
import { usePinExtension } from '@/hooks/use-pin-extension'

import { useWallet } from '../../../providers/wallet-context'

export const Route = createFileRoute('/portfolio/assets/')({
  component: Component,
})

function Component() {
  const { currentWallet, isLoading: isWalletLoading } = useWallet()
  const { isPinExtension, handleClose } = usePinExtension()

  const address = currentWallet?.activeAccounts[0].address

  const router = useRouter()
  const { data: assets, isLoading } = useAssets({
    address,
    isWalletLoading,
  })
  const isDesktop = useMediaQuery('xl')

  if (!currentWallet || !address) {
    return <div>No wallet selected</div>
  }

  return (
    <>
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
        detail={<FeedbackSection />}
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
