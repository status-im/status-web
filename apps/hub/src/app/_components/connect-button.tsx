'use client'

import { Button, ShortenAddress } from '@status-im/status-network/components'
import { ConnectKitButton } from 'connectkit'

import type { ComponentProps } from 'react'

type Props = {
  size?: ComponentProps<typeof Button>['size']
  label?: string
  className?: string
  /** If true, shows the label instead of the shortened address when connected */
  alwaysShowLabel?: boolean
}

const ConnectButton = (props: Props) => {
  const {
    size = '32',
    label = 'Connect wallet',
    className,
    alwaysShowLabel = false,
  } = props

  return (
    <ConnectKitButton.Custom>
      {({ show, isConnected, address }) => {
        return (
          <Button
            onClick={show}
            variant={isConnected ? 'secondary' : 'primary'}
            size={size}
            className={className}
          >
            {address && isConnected && !alwaysShowLabel ? (
              <ShortenAddress address={address} />
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
