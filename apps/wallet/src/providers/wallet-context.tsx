import { createContext, useContext, useEffect, useState } from 'react'

import { apiClient } from './api-client'

import type { KeyStore } from '@trustwallet/wallet-core'

type Wallet = KeyStore.Wallet

type WalletContext = {
  currentWallet: Wallet | null
  wallets: Wallet[]
  isLoading: boolean
  hasWallets: boolean
  setCurrentWallet: (id: Wallet['id']) => void
  loadWallets: () => Promise<void>
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
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [currentWallet, setCurrentWalletState] = useState<Wallet | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const hasWallets = wallets.length > 0

  const loadWallets = async () => {
    try {
      setIsLoading(true)
      const loadedWallets = await apiClient.wallet.all.query()
      setWallets(loadedWallets)

      if (loadedWallets && loadedWallets.length > 0 && !currentWallet) {
        setCurrentWalletState(loadedWallets[0])
      }
    } catch (error) {
      console.error('Failed to load wallets:', error)
      setWallets([])
    } finally {
      setIsLoading(false)
    }
  }

  const setCurrentWallet = (id: string) => {
    const wallet = wallets.find(wallet => wallet.id === id)
    if (wallet) {
      setCurrentWalletState(wallet)
    }
  }

  useEffect(() => {
    loadWallets()
  }, [])

  const contextValue: WalletContext = {
    currentWallet,
    wallets,
    isLoading,
    hasWallets,
    setCurrentWallet,
    loadWallets,
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
}
