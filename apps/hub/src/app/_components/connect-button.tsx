'use client'

import { Button, ShortenAddress } from '@status-im/status-network/components'
import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'

import type { ComponentProps } from 'react'

type Props = {
  size?: ComponentProps<typeof Button>['size']
  label?: string
  shortLabel?: string
}

const ConnectButton = (props: Props) => {
  const {
    size = '32',
    label = 'Connect wallet',
    shortLabel = 'Connect',
  } = props

  const { address, isConnected } = useAccount()

  return (
    <ConnectKitButton.Custom>
      {({ show }) => {
        return (
          <Button
            onClick={show}
            variant={isConnected ? 'secondary' : 'primary'}
            size={size}
          >
            {address && isConnected ? (
              <ShortenAddress address={address} />
            ) : (
              <>
                <span className="hidden whitespace-nowrap lg:block">
                  {label}
                </span>
                <span className="block whitespace-nowrap lg:hidden">
                  {shortLabel}
                </span>
              </>
            )}
          </Button>
        )
      }}
    </ConnectKitButton.Custom>
  )
}

export { ConnectButton }
export type { Props as ConnectButtonProps }
