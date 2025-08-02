'use client'

import { createContext, useContext } from 'react'

import { useToast } from '@status-im/components'
import { shortenAddress } from '@status-im/wallet/components'
import { useQuery } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAccount, useDisconnect } from 'wagmi'

import { getAccountsData } from '../_actions'
import { useLocalStorage } from '../_hooks/use-local-storage'

import type { Account } from '../_components/sidenav'
import type { ApiOutput, NetworkType } from '@status-im/wallet/data'
import type { ReactNode } from 'react'

type AccountsContextType = {
  accounts: Account[]
  activeAccounts: Account[]
  setAccounts: (accounts: Account[] | ((prev: Account[]) => Account[])) => void
  addAccount: (account: Account) => void
  removeAccount: (address: string) => void
  updateAccount: (account: Partial<Account>) => void
  disconnectWalletAccount: (address: string) => void
  accountsData: Record<string, ApiOutput['assets']['all']>
}

const AccountsContext = createContext<AccountsContextType | undefined>(
  undefined
)

export const AccountsProvider = ({ children }: { children: ReactNode }) => {
  const [accounts, setAccounts] = useLocalStorage<Account[]>('accounts', [])
  const router = useRouter()
  const { disconnect } = useDisconnect()
  const toast = useToast()
  const { address: connectedAddress } = useAccount()
  const searchParams = useSearchParams()
  const networks = (searchParams.get('networks')?.split(',') ?? [
    'ethereum',
  ]) as NetworkType[]

  const activeAccounts = accounts.filter(
    account =>
      !account.wallet ||
      (account.wallet.connected &&
        account.address === connectedAddress?.toLowerCase())
  )

  const addresses = activeAccounts.map(account => account.address)

  const { data: accountsData = {} } = useQuery({
    queryKey: ['accountsData', addresses.join(','), networks.join(',')],
    queryFn: () => getAccountsData(addresses, networks),
    enabled: addresses.length > 0,
    staleTime: 60000,
  })

  const addAccount = (account: Account) => {
    setAccounts(prev => [...prev, account])

    router.push(`/${account.address}/assets`)
  }

  const removeAccount = (address: string) => {
    const updatedAccounts = accounts.filter(
      account => account.address !== address
    )
    setAccounts(updatedAccounts)

    const newActiveAccounts = updatedAccounts.filter(
      account =>
        !account.wallet ||
        (account.wallet.connected &&
          account.address === connectedAddress?.toLowerCase())
    )

    if (newActiveAccounts.length === 0) {
      router.push('/')
    } else {
      router.push(`/${newActiveAccounts[0].address}/assets`)
    }
  }

  const updateAccount = (updatedAccount: Partial<Account>) => {
    setAccounts(prev =>
      prev.map(account =>
        account.address === updatedAccount.address
          ? { ...account, ...updatedAccount }
          : account
      )
    )
  }

  const disconnectWalletAccount = (address: string) => {
    setTimeout(() => {
      disconnect()
      toast.positive(`${shortenAddress(address)} successfully disconnected`)
    }, 300)
  }

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        activeAccounts,
        setAccounts,
        addAccount,
        removeAccount,
        updateAccount,
        disconnectWalletAccount,
        accountsData,
      }}
    >
      {children}
    </AccountsContext.Provider>
  )
}

export const useAccounts = () => {
  const context = useContext(AccountsContext)
  if (!context) {
    throw new Error('useAccounts must be used within an AccountsProvider')
  }
  return context
}
