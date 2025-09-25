'use client'

import { createContext, useContext } from 'react'

import { useAccount as useWagmiAccount } from 'wagmi'

type AccountContextType = {
  address?: string
  isConnected: boolean
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

type Props = {
  children: React.ReactNode
}

function AccountProvider(props: Props) {
  const { children } = props
  const { address, isConnected } = useWagmiAccount()

  console.log('useWagmiAccount')
  console.log('address', address)
  console.log('isConnected', isConnected)

  const value: AccountContextType = {
    address,
    isConnected,
  }

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  )
}

function useAccount() {
  const context = useContext(AccountContext)
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider')
  }
  return context
}

export { AccountProvider, useAccount }
export type { AccountContextType }
