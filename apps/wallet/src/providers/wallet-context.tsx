import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useQuery } from '@tanstack/react-query'
import { storage } from '@wxt-dev/storage'

import { useSynchronizedRefetch } from '../hooks/use-synchronized-refetch'
import { apiClient } from './api-client'

import type { WalletAccount, WalletMeta } from '../data/wallet-metadata'

const WALLET_LIST_STALE_TIME_MS = 5 * 60 * 1000 // 5 minutes
const WALLET_LIST_GC_TIME_MS = 60 * 60 * 1000 // 1 hour
const SELECTED_WALLET_ID_KEY = 'local:wallet:selected-id'

type Wallet = WalletMeta

type WalletContext = {
  currentWallet: Wallet | null
  currentAccount: WalletAccount | null
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
  const [hasHydratedSelectedWallet, setHasHydratedSelectedWallet] =
    useState(false)

  const { data: wallets = [], isLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: () => apiClient.wallet.all.query(),
    staleTime: WALLET_LIST_STALE_TIME_MS,
    gcTime: WALLET_LIST_GC_TIME_MS,
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

  const currentAccount = useMemo(() => {
    if (!currentWallet) return null
    return currentWallet.accounts[0] ?? null
  }, [currentWallet])

  useEffect(() => {
    if (
      hasWallets &&
      !selectedWalletId &&
      wallets[0] &&
      hasHydratedSelectedWallet
    ) {
      setSelectedWalletId(wallets[0].id)
    }
  }, [hasHydratedSelectedWallet, hasWallets, selectedWalletId, wallets])

  useEffect(() => {
    let isCancelled = false

    async function hydrateSelectedWallet() {
      const persistedSelectedWalletId = await storage.getItem<string>(
        SELECTED_WALLET_ID_KEY,
      )
      if (isCancelled) return
      if (persistedSelectedWalletId) {
        setSelectedWalletId(persistedSelectedWalletId)
      }
      setHasHydratedSelectedWallet(true)
    }

    hydrateSelectedWallet().catch(error => {
      console.error('Failed to hydrate selected wallet id:', error)
      setHasHydratedSelectedWallet(true)
    })

    return () => {
      isCancelled = true
    }
  }, [])

  useEffect(() => {
    if (!hasHydratedSelectedWallet) return

    const persistSelectedWallet = async () => {
      if (selectedWalletId) {
        await storage.setItem(SELECTED_WALLET_ID_KEY, selectedWalletId)
        return
      }
      await storage.removeItem(SELECTED_WALLET_ID_KEY)
    }

    persistSelectedWallet().catch(error =>
      console.error('Failed to persist selected wallet id:', error),
    )
  }, [hasHydratedSelectedWallet, selectedWalletId])

  const setCurrentWallet = useCallback((id: string) => {
    setSelectedWalletId(id)
  }, [])

  // Auto-refresh
  useSynchronizedRefetch(currentAccount?.address ?? '')

  const contextValue: WalletContext = {
    currentWallet,
    currentAccount,
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
