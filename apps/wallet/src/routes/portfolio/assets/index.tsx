import { useEffect, useState } from 'react'

import { useToast } from '@status-im/components'
import {
  AssetsList,
  AssetsListLoading,
  EmptyStateActions,
  PinExtension,
} from '@status-im/wallet/components'
import { ERROR_MESSAGES } from '@status-im/wallet/constants'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import SplittedLayout from '@/components/splitted-layout'
import { useAssets } from '@/hooks/use-assets'
import { useMediaQuery } from '@/hooks/use-media-query'
import { usePinExtension } from '@/hooks/use-pin-extension'

import { useWallet } from '../../../providers/wallet-context'

import type { HideAssetsBelowOneToggle } from '@/components/action-buttons'

export const Route = createFileRoute('/portfolio/assets/')({
  component: Component,
})

function Component() {
  const {
    currentWallet,
    currentAccount,
    isLoading: isWalletLoading,
  } = useWallet()
  const { isPinExtension, handleClose } = usePinExtension()

  const toast = useToast()

  const address = currentAccount?.address

  const router = useRouter()
  const { data, isLoading, isError } = useAssets({
    address,
    isWalletLoading,
  })
  const isDesktop = useMediaQuery('xl')
  const [hideBelowOneEur, setHideBelowOneEur] = useState(false)
  const hideAssetsBelowOneToggle: HideAssetsBelowOneToggle = {
    checked: hideBelowOneEur,
    onCheckedChange: setHideBelowOneEur,
  }

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
        hideAssetsBelowOneToggle={hideAssetsBelowOneToggle}
        list={
          <AssetsList
            assets={data?.assets ?? []}
            hideBelowOneEur={hideBelowOneEur}
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
        detail={<EmptyStateActions address={address} />}
        loadingState={<AssetsListLoading />}
        isLoading={isLoading}
      />
      {isPinExtension && (
        <div className="absolute right-2 top-14 z-20">
          <PinExtension onClose={handleClose} />
        </div>
      )}
    </>
  )
}
