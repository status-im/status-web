'use client'

import { Button, ShortenAddress } from '@status-im/status-network/components'
import { ConnectKitButton } from 'connectkit'

import { useAccount } from '../_providers/account-provider'

import type { ComponentProps } from 'react'

type Props = {
  size?: ComponentProps<typeof Button>['size']
  label?: string
}

const ConnectButton = (props: Props) => {
  const { size = '32', label = 'Connect wallet' } = props

  const { address: accountAddress, isConnected: accountIsConnected } =
    useAccount()

  console.log('accountAddress', accountAddress)
  console.log('accountIsConnected', accountIsConnected)

  return (
    <ConnectKitButton.Custom>
      {({ show }) => {
        return (
          <Button
            onClick={show}
            variant={accountIsConnected ? 'secondary' : 'primary'}
            size={size}
          >
            {accountAddress && accountIsConnected ? (
              <ShortenAddress address={accountAddress!} />
            ) : (
              label
            )}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}

export { ConnectButton }
export type { Props as ConnectButtonProps }
