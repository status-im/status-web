'use client'

import { useCallback, useMemo, useState } from 'react'

import { LiFiWidget, type WidgetConfig } from '@lifi/widget'
import {
  type Account,
  ExchangeDrawer as ExchangeDrawerUI,
  PasswordModal,
} from '@status-im/wallet/components'
import { useAccount } from 'wagmi'

const NATIVE_ETH_ADDRESS = '0x0000000000000000000000000000000000000000'
const ETHEREUM_MAINNET_CHAIN_ID = 1

export type ExchangeDrawerProps = {
  children: React.ReactElement
  account?: Account
  fromChain?: number
  fromToken?: string
  isUnlocked?: boolean
  onUnlock?: (password: string) => Promise<boolean>
}

export const ExchangeDrawer = (props: ExchangeDrawerProps) => {
  const {
    children,
    account,
    fromChain = ETHEREUM_MAINNET_CHAIN_ID,
    fromToken,
    isUnlocked = false,
    onUnlock,
  } = props

  const [open, setOpen] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const { isConnected, address: connectedAddress } = useAccount()

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (isOpen && !isUnlocked) {
        setShowPasswordModal(true)
        return
      }
      setOpen(isOpen)
    },
    [isUnlocked],
  )

  const handlePasswordConfirm = useCallback(
    async (password: string) => {
      if (!onUnlock) return

      const success = await onUnlock(password)
      if (success) {
        setShowPasswordModal(false)
        setOpen(true)
      } else {
        throw new Error('Invalid password')
      }
    },
    [onUnlock],
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

  const widgetContent =
    isUnlocked && open ? (
      <LiFiWidget
        key={connectedAddress}
        integrator={widgetConfig.integrator}
        config={widgetConfig}
      />
    ) : null

  return (
    <>
      <ExchangeDrawerUI
        open={open}
        onOpenChange={handleOpenChange}
        trigger={children}
      >
        {widgetContent}
      </ExchangeDrawerUI>

      {onUnlock && (
        <PasswordModal
          open={showPasswordModal}
          onOpenChange={setShowPasswordModal}
          onConfirm={handlePasswordConfirm}
          buttonLabel="Unlock & Exchange"
        />
      )}
    </>
  )
}
