'use client'

import { AccountMenu as AccountMenuBase } from '@status-im/wallet/components'

import { useCopyToClipboard } from '../_hooks/use-copy-to-clipboard'
import { useCurrentAccount } from '../_hooks/use-current-account'
import { useAccounts } from '../_providers/accounts-context'

type Props = {
  size: '24' | '32'
}

const AccountMenu = (props: Props) => {
  const [, copy] = useCopyToClipboard()

  const account = useCurrentAccount()
  const { removeAccount, disconnectWalletAccount } = useAccounts()

  return (
    <AccountMenuBase
      {...props}
      account={account}
      onCopy={copy}
      onDisconnect={disconnectWalletAccount}
      onRemove={removeAccount}
    />
  )
}

export { AccountMenu }
