'use client'

import { useCallback, useMemo, useState } from 'react'

import { LiFiWidget, type WidgetConfig } from '@lifi/widget'
import {
  type Account,
  ExchangeDrawer as ExchangeDrawerUI,
} from '@status-im/wallet/components'
import { useAccount } from 'wagmi'

import { usePasswordSession } from '../providers/password-context'

const NATIVE_ETH_ADDRESS = '0x0000000000000000000000000000000000000000'
const ETHEREUM_MAINNET_CHAIN_ID = 1

export type ExchangeDrawerProps = {
  children: React.ReactElement
  account?: Account
  fromChain?: number
  fromToken?: string
}

export const ExchangeDrawer = (props: ExchangeDrawerProps) => {
  const {
    children,
    account,
    fromChain = ETHEREUM_MAINNET_CHAIN_ID,
    fromToken,
  } = props

  const [open, setOpen] = useState(false)
  const { hasActiveSession, requestPassword } = usePasswordSession()
  const { isConnected, address: connectedAddress } = useAccount()

  const handleOpenChange = useCallback(
    async (isOpen: boolean) => {
      if (!isOpen) {
        setOpen(false)
        return
      }

      if (hasActiveSession) {
        setOpen(true)
        return
      }

      const password = await requestPassword({
        title: 'Enter password',
        description: 'To use exchange feature',
        buttonLabel: 'Unlock & Exchange',
      })

      if (password) {
        setOpen(true)
      }
    },
    [hasActiveSession, requestPassword],
  )

  const widgetConfig: WidgetConfig = useMemo(
    () => ({
      integrator: 'StatusWallet',
      variant: 'compact',
      appearance: 'light',
      fromChain,
      fromToken: fromToken || NATIVE_ETH_ADDRESS,
      fromAddress: isConnected ? connectedAddress : account?.address,
      chains: {
        allow: [1],
      },
      hiddenUI: ['appearance'],
      theme: {
        container: {
          display: 'flex',
          height: '100%',
          borderRadius: '16px',
        },
      },
    }),
    [isConnected, connectedAddress, account?.address, fromChain, fromToken],
  )

  if (!account) {
    return null
  }

  const widgetContent = open ? (
    <LiFiWidget
      key={connectedAddress}
      integrator={widgetConfig.integrator}
      config={widgetConfig}
    />
  ) : null

  return (
    <ExchangeDrawerUI
      open={open}
      onOpenChange={handleOpenChange}
      trigger={children}
    >
      {widgetContent}
    </ExchangeDrawerUI>
  )
}
