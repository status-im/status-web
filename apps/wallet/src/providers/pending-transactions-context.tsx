import { createContext, useContext, useEffect, useState } from 'react'

import { getTransactionHash } from '@status-im/wallet/utils'

import { Storage } from '../data/storage'

import type { ApiOutput } from '@status-im/wallet/data'

type Activity = ApiOutput['activities']['activities']['activities'][0]

type PendingTransaction = Activity & {
  status: 'pending'
  uniqueId: string
}

type PendingTransactionsContext = {
  pendingTransactions: PendingTransaction[]
  addPendingTransaction: (
    transaction: Omit<PendingTransaction, 'uniqueId'>,
  ) => void
  removePendingTransaction: (hash: string) => void
  clearPendingTransactions: () => void
  isLoading: boolean
}

const PendingTransactionsContext = createContext<
  PendingTransactionsContext | undefined
>(undefined)

export function usePendingTransactions() {
  const context = useContext(PendingTransactionsContext)
  if (!context) {
    throw new Error(
      'usePendingTransactions must be used within PendingTransactionsProvider',
    )
  }
  return context
}

export function PendingTransactionsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [pendingTransactions, setPendingTransactions] = useState<
    PendingTransaction[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [storage] = useState(() => new Storage('pending-transactions'))

  useEffect(() => {
    const loadPendingTransactions = async () => {
      try {
        const result = await storage.get(['transactions'])
        const stored = result.transactions as PendingTransaction[] | undefined

        if (stored && Array.isArray(stored)) {
          setPendingTransactions(stored)
        }
      } catch (error) {
        console.error('Failed to load pending transactions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPendingTransactions()
  }, [storage])

  useEffect(() => {
    if (!isLoading) {
      storage.set({ transactions: pendingTransactions }).catch(error => {
        console.error('Failed to save pending transactions:', error)
      })
    }
  }, [pendingTransactions, storage, isLoading])

  const addPendingTransaction = (
    transaction: Omit<PendingTransaction, 'uniqueId'>,
  ) => {
    const newTransaction: PendingTransaction = {
      ...transaction,
      uniqueId: `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }

    setPendingTransactions(prev => [...prev, newTransaction])
  }

  const removePendingTransaction = (hash: string) => {
    setPendingTransactions(prev =>
      prev.filter(tx => getTransactionHash(tx.hash) !== hash),
    )
  }

  const clearPendingTransactions = () => {
    setPendingTransactions([])
  }

  const contextValue: PendingTransactionsContext = {
    pendingTransactions,
    addPendingTransaction,
    removePendingTransaction,
    clearPendingTransactions,
    isLoading,
  }

  return (
    <PendingTransactionsContext.Provider value={contextValue}>
      {children}
    </PendingTransactionsContext.Provider>
  )
}
