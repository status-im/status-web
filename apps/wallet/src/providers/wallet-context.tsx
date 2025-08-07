import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useQuery } from '@tanstack/react-query'

import { useSynchronizedRefetch } from '../hooks/use-synchronized-refetch'
import { apiClient } from './api-client'

import type { KeyStore } from '@trustwallet/wallet-core'

type Wallet = KeyStore.Wallet

type WalletContext = {
  currentWallet: Wallet | null
  wallets: Wallet[]
  isLoading: boolean
  hasWallets: boolean
  setCurrentWallet: (id: Wallet['id']) => void
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

  const { data: wallets = [], isLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => apiClient.wallet.all.query(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
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

  const setCurrentWallet = useCallback(
    (id: string) => {
      const walletExists = wallets.some(w => w.id === id)
      if (walletExists) {
        setSelectedWalletId(id)
      } else {
        console.error(`Wallet with id ${id} not found`)
      }
    },
    [wallets],
  )

  // Auto-refresh
  useSynchronizedRefetch(currentWallet?.activeAccounts[0]?.address ?? '')

  const contextValue: WalletContext = {
    currentWallet,
    wallets,
    isLoading,
    hasWallets,
    setCurrentWallet,
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
}
