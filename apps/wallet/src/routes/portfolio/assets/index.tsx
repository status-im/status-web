import { useToast } from '@status-im/components'
import {
  AssetsList,
  AssetsListLoading,
  FeedbackSection,
  PinExtension,
} from '@status-im/wallet/components'
import { ERROR_MESSAGES } from '@status-im/wallet/constants'
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

  const toast = useToast()

  const address = currentWallet?.activeAccounts?.[0]?.address

  const router = useRouter()
  const { data, isLoading, isError } = useAssets({
    address,
    isWalletLoading,
  })
  const isDesktop = useMediaQuery('xl')

  // Show error toast if there is an error fetching assets
  useEffect(() => {
    if (isError) {
      toast.negative(ERROR_MESSAGES.ASSETS_FETCH)
    }
  }, [isError, toast])

  if (!currentWallet || !address) return null

  return (
    <>
      <SplittedLayout
        list={
          <AssetsList
            assets={data?.assets ?? []}
            onSelect={url => {
              try {
                const ticker = url.split('/').pop()
                if (!ticker) {
                  console.error('Invalid ticker from URL:', url)
                  return
                }
                router.navigate({
                  to: '/portfolio/assets/$ticker',
                  params: { ticker },
                  ...(!isDesktop && {
                    viewTransition: true,
                  }),
                })
              } catch (error) {
                console.error('Navigation error:', error)
              }
            }}
            clearSearch={() => {
              console.log('Search cleared')
            }}
            searchParams={new URLSearchParams()}
            pathname="/portfolio/assets"
          />
        }
        detail={<FeedbackSection />}
        loadingState={<AssetsListLoading />}
        isLoading={isLoading}
      />
      {isPinExtension && (
        <div className="absolute right-5 top-20 z-20">
          <PinExtension onClose={handleClose} />
        </div>
      )}
    </>
  )
}
