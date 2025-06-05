'use client'

import { ReceiveCryptoDrawer as ReceiveCryptoDrawerBase } from '@status-im/wallet/components'
import { useCopyToClipboard } from '@status-im/wallet/hooks'

import { useCurrentAccount } from '../_hooks/use-current-account'

import type React from 'react'

type Props = {
  children: React.ReactNode
}

export const ReceiveCryptoDrawer = (props: Props) => {
  const [, copy] = useCopyToClipboard()
  const account = useCurrentAccount()

  if (!account) {
    return null
  }

  return <ReceiveCryptoDrawerBase account={account} {...props} onCopy={copy} />
}
