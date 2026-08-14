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

import { useSelectAccount } from '../hooks/use-select-account'
import { useSynchronizedRefetch } from '../hooks/use-synchronized-refetch'
import { syncAccountToDapps } from '../lib/dapp-events'
import { SELECTED_WALLET_ID_KEY } from '../lib/storage-keys'
import { apiClient } from './api-client'

import type { WalletAccount, WalletMeta } from '../data/wallet-metadata'

const WALLET_LIST_STALE_TIME_MS = 5 * 60 * 1000 // 5 minutes
const WALLET_LIST_GC_TIME_MS = 60 * 60 * 1000 // 1 hour

type Wallet = WalletMeta

type WalletContext = {
  currentWallet: Wallet | null
  currentAccount: WalletAccount | null
  wallets: Wallet[]
  isLoading: boolean
  hasWallets: boolean
  setCurrentWallet: (id: Wallet['id']) => void
  setCurrentAccount: (address: WalletAccount['address']) => void
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
    const selectedAccount = currentWallet.accounts.find(
      account => account.address === currentWallet.selectedAccountAddress,
    )
    return selectedAccount ?? currentWallet.accounts[0] ?? null
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

  /**
   * Both setters are the only deliberate account switches in the app, which is
   * why the dApp sync hangs off them rather than off `currentAccount`. That
   * value also changes while the persisted wallet selection hydrates -- during
   * which it briefly reports `wallets[0]` -- and reacting to it would re-point
   * connected dApps at the wrong account on every page load.
   */
  const setCurrentWallet = useCallback(
    (id: string) => {
      setSelectedWalletId(id)

      const wallet = wallets.find(w => w.id === id)
      const account =
        wallet?.accounts.find(
          a => a.address === wallet.selectedAccountAddress,
        ) ?? wallet?.accounts[0]
      if (account) {
        void syncAccountToDapps(account.address)
      }
    },
    [wallets],
  )

  const { selectAccount } = useSelectAccount()

  const setCurrentAccount = useCallback(
    (address: string) => {
      if (!currentWallet) return
      if (currentWallet.selectedAccountAddress === address) return
      selectAccount({ walletId: currentWallet.id, address })
      void syncAccountToDapps(address)
    },
    [currentWallet, selectAccount],
  )

  // Auto-refresh
  useSynchronizedRefetch(currentAccount?.address ?? '')

  const contextValue: WalletContext = {
    currentWallet,
    currentAccount,
    wallets,
    isLoading,
    hasWallets,
    setCurrentWallet,
    setCurrentAccount,
  }

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
}
