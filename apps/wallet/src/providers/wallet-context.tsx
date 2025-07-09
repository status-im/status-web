import { createContext, useContext, useEffect, useState } from 'react'

import { useQuery } from '@tanstack/react-query'

import { apiClient } from './api-client'

import type { KeyStore } from '@trustwallet/wallet-core'

type Wallet = KeyStore.Wallet

type WalletContext = {
  currentWallet: Wallet | null
  wallets: Wallet[]
  isLoading: boolean
  hasWallets: boolean
  setCurrentWallet: (id: Wallet['id']) => void
  setMnemonic: (mnemonic: string | null) => void
  mnemonic: string | null
}

const WalletContext = createContext<WalletContext | undefined>(undefined)

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null)
  const [mnemonic, setMnemonic] = useState<string | null>(null)

  const { data: wallets = [], isLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => apiClient.wallet.all.query(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const hasWallets = wallets.length > 0

  const currentWallet = useMemo(() => {
    if (!hasWallets) return null

    if (selectedWalletId) {
      const selectedWallet = wallets.find(
        wallet => wallet.id === selectedWalletId,
      )
      if (selectedWallet) return selectedWallet
    }

    return wallets[0] || null
  }, [hasWallets, selectedWalletId, wallets])

  useEffect(() => {
    if (hasWallets && !selectedWalletId && wallets[0]) {
      setSelectedWalletId(wallets[0].id)
    }
  }, [hasWallets, selectedWalletId, wallets])

  const setCurrentWallet = (id: string) => {
    setSelectedWalletId(id)
  }

  const contextValue: WalletContext = {
    currentWallet,
    wallets,
    isLoading,
    hasWallets,
    setCurrentWallet,
    setMnemonic,
    mnemonic,
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
}
