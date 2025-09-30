'use client'

import { ConnectKitButton } from 'connectkit'

import { Button } from '../button'
import { ShortenAddress } from '../shorten-address'

import type { ComponentProps } from 'react'

type Props = {
  variant?: ComponentProps<typeof Button>['variant']
  size?: ComponentProps<typeof Button>['size']
  label?: string
}

const ConnectButton = (props: Props) => {
  const { variant = 'primary', size = '32', label = 'Connect wallet' } = props

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, address }) => {
        return (
          <Button onClick={show} variant={variant} size={size}>
            {isConnected && variant !== 'primary' ? (
              <span className="flex items-center gap-2">
                <span className="text-13 font-600">
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
export type { Props as ConnectButtonProps }
