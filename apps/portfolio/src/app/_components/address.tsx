'use client'

import { Address as AddressBase } from '@status-im/wallet/components'

import { useCurrentAccount } from '../_hooks/use-current-account'
import { useAccounts } from '../_providers/accounts-context'

import type { AddressProps } from '@status-im/wallet/components'

const Address = (props: AddressProps) => {
  const account = useCurrentAccount()
  const { activeAccounts } = useAccounts()
  return (
    <AddressBase {...props} account={account} activeAccounts={activeAccounts} />
  )
}

export { Address }
