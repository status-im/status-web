'use client'

import { useEffect } from 'react'

import { usePathname, useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'

import { useAccounts } from '../_providers/accounts-context'
import { getRandomColor, getRandomEmoji } from '../_utils/get-default-values'

export const UNKNOWN_WALLET = 'Unknown wallet'

export function useWalletAccounts() {
  const { addAccount, accounts, updateAccount, activeAccounts } = useAccounts()
  const { address: connectedAddress, isConnected, connector } = useAccount()
  const router = useRouter()
  const pathname = usePathname()

  const isRoot = pathname === '/'

  useEffect(() => {
    if (isConnected && connectedAddress && isRoot) {
      const normalizedAddress = connectedAddress.toLowerCase()
      const account = accounts.find(
        account => account.address === normalizedAddress
      )
      const name = connector?.name ? `${connector?.name} wallet` : 'Wallet'

      if (!account) {
        addAccount({
          emoji: getRandomEmoji(),
          address: normalizedAddress,
          name,
          color: getRandomColor(),
          wallet: {
            connector: connector?.name ?? UNKNOWN_WALLET,
            connected: true,
          },
        })
      } else {
        if (!account.wallet?.connected) {
          updateAccount({
            ...account,
            wallet: {
              connector: connector?.name ?? UNKNOWN_WALLET,
              connected: true,
            },
          })
        }

        if (isRoot) {
          router.push(`/${normalizedAddress}/assets`)
        }
      }
    } else if (isRoot && activeAccounts.length > 0) {
      router.push(`/${activeAccounts[0].address}/assets`)
    }
  }, [
    isConnected,
    connectedAddress,
    addAccount,
    accounts,
    connector,
    router,
    pathname,
    updateAccount,
    isRoot,
    activeAccounts,
  ])

  return { isConnected, connectedAddress }
}
