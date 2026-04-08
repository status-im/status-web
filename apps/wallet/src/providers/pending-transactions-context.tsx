import { createContext, useContext, useEffect, useState } from 'react'

import { getTransactionHash } from '@status-im/wallet/utils'

import { Storage } from '../data/storage'
import { checkPendingTransactions } from '../lib/tx-monitor'

import type { ApiOutput } from '@status-im/wallet/data'

type Activity = ApiOutput['activities']['activities']['activities'][0]

type PendingTransaction = Activity & {
  status: 'pending'
  uniqueId: string
  displayAmount?: string
}

type PendingTransactionsContext = {
  pendingTransactions: PendingTransaction[]
  addPendingTransaction: (
    transaction: Omit<PendingTransaction, 'uniqueId'>,
  ) => Promise<void>
  removePendingTransaction: (hash: string) => Promise<void>
  clearPendingTransactions: () => Promise<void>
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
    if (isLoading || pendingTransactions.length === 0) {
      return
    }

    void checkPendingTransactions()

    const intervalId = window.setInterval(() => {
      void checkPendingTransactions()
    }, 3_000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isLoading, pendingTransactions.length])

  const addPendingTransaction = async (
    transaction: Omit<PendingTransaction, 'uniqueId'>,
  ) => {
    const newTransaction: PendingTransaction = {
      ...transaction,
      uniqueId: `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }

    let nextTransactions: PendingTransaction[] = []
    setPendingTransactions(prev => {
      nextTransactions = [...prev, newTransaction]
      return nextTransactions
    })

    try {
      await storage.set({ transactions: nextTransactions })
    } catch (error) {
      console.error('Failed to save pending transactions:', error)
    }
  }

  const removePendingTransaction = async (hash: string) => {
    let nextTransactions: PendingTransaction[] = []
    setPendingTransactions(prev => {
      nextTransactions = prev.filter(tx => getTransactionHash(tx.hash) !== hash)
      return nextTransactions
    })

    try {
      await storage.set({ transactions: nextTransactions })
    } catch (error) {
      console.error('Failed to save pending transactions:', error)
    }
  }

  const clearPendingTransactions = async () => {
    setPendingTransactions([])

    try {
      await storage.set({ transactions: [] })
    } catch (error) {
      console.error('Failed to save pending transactions:', error)
    }
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
