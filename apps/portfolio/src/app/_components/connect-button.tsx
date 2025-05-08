'use client'

import { Button } from '@status-im/components'
import { WalletIcon } from '@status-im/icons/20'
import { ShortenAddress } from '@status-im/wallet/components'
import { ConnectKitButton } from 'connectkit'

import type { CustomisationColorType } from '@status-im/components'
import type { ComponentProps } from 'react'

type Props = {
  variant?: ComponentProps<typeof Button>['variant']
  size?: ComponentProps<typeof Button>['size']
  label?: string
  activeAccounts?: Account[]
}

// Since this was tightly coupled with the side nav, we need to keep this type here because sidenav will be deprecated and this component will be used in the new wallet connect flow
type Account = {
  name: string
  emoji: string
  color: CustomisationColorType
  address: string
  wallet?: {
    connector: string
    connected: boolean
  }
}

const ConnectButton = (props: Props) => {
  const {
    variant = 'primary',
    size = '40',
    label = 'Connect wallet',
    activeAccounts = [],
  } = props

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address }) => {
        const currentAccount = activeAccounts.find(
          account => account.address === address?.toLowerCase()
        )

        return (
          <Button
            iconBefore={!currentAccount ? <WalletIcon /> : undefined}
            onClick={show}
            variant={variant}
            size={size}
          >
            {currentAccount && variant !== 'primary' ? (
              <span className="flex items-center gap-2">
                <span>{currentAccount.emoji}</span>
                <span className="font-mono text-13 font-600">
                  {isConnected ? <ShortenAddress address={address!} /> : label}
                </span>
              </span>
            ) : (
              <>
                {isConnected && variant !== 'primary' ? (
                  <ShortenAddress address={address!} />
                ) : (
                  label
                )}
              </>
            )}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}

export { ConnectButton }
export type { Account, Props as ConnectButtonProps }
