'use client'

import { ConnectKitProvider as ConnectKit } from 'connectkit'
import { useRouter } from 'next/navigation'

import {
  UNKNOWN_WALLET,
  useWalletAccounts,
} from '../_hooks/use-wallet-accounts'
import { useAccounts } from '../_providers/accounts-context'
import { getRandomColor, getRandomEmoji } from '../_utils/get-default-values'

type ConnectKitProviderProps = {
  children: React.ReactNode
}

export function ConnectKitProvider({ children }: ConnectKitProviderProps) {
  const router = useRouter()
  const { accounts, addAccount, updateAccount, setAccounts } = useAccounts()
  useWalletAccounts()

  return (
    <ConnectKit
      theme="auto"
      mode="light"
      onConnect={({ address }) => {
        const normalizedAddress = address?.toLowerCase()

        if (normalizedAddress) {
          const account = accounts.find(
            account => account.address === normalizedAddress
          )

          if (!account) {
            addAccount({
              emoji: getRandomEmoji(),
              address: normalizedAddress,
              name: 'Unknown wallet',
              color: getRandomColor(),
              wallet: {
                connector: UNKNOWN_WALLET,
                connected: true,
              },
            })
          } else if (!account.wallet?.connected) {
            updateAccount({
              ...account,
              wallet: {
                connector: account.wallet?.connector ?? UNKNOWN_WALLET,
                connected: true,
              },
            })
          }

          router.push(`/${normalizedAddress}/assets`)
        }
      }}
      onDisconnect={() => {
        const updatedAccounts = accounts.map(account => {
          return account.wallet
            ? {
                ...account,
                wallet: {
                  connector: account.wallet?.connector ?? 'unknown',
                  connected: false,
                },
              }
            : account
        })

        setAccounts(updatedAccounts)

        const remainingActive = updatedAccounts.filter(
          account => !account.wallet
        )

        if (remainingActive.length === 0) {
          router.push('/')
        } else {
          router.push(`/${remainingActive[0].address}/assets`)
        }
      }}
    >
      {children}
    </ConnectKit>
  )
}
