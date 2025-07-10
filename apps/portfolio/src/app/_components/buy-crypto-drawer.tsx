'use client'

import {
  BuyCryptoDrawer as BuyCryptoDrawerBase,
  type Provider,
} from '@status-im/wallet/components'

import { handleCryptoOnRamp } from '../_actions'
import { useCurrentAccount } from '../_hooks/use-current-account'

type Props = {
  children: React.ReactElement
}

export const BuyCryptoDrawer = (props: Props) => {
  const { children } = props
  const account = useCurrentAccount()

  const handleProviderSelect = async (
    provider: Provider,
    network: string,
    asset?: string
  ) => {
    return handleCryptoOnRamp({
      name: provider,
      network,
      address: account.address,
      asset: asset || 'EUR',
    })
  }

  const handleOpenTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (!account) {
    return null
  }

  return (
    <BuyCryptoDrawerBase
      account={account}
      onProviderSelect={handleProviderSelect}
      onOpenTab={handleOpenTab}
    >
      {children}
    </BuyCryptoDrawerBase>
  )
}
