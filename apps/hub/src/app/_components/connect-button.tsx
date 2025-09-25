'use client'

import { Button, ShortenAddress } from '@status-im/status-network/components'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'

import type { ComponentProps } from 'react'

type Props = {
  size?: ComponentProps<typeof Button>['size']
  label?: string
}

const ConnectButton = (props: Props) => {
  const { size = '32', label = 'Connect wallet' } = props

  const { address: accountAddress, isConnected: accountIsConnected } =
    useAccount()

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
