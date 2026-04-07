import { useEffect } from 'react'

import { getTransactionHash } from '@status-im/wallet/utils'
import { storage } from '@wxt-dev/storage'

import { notifyTransactionConfirmed } from '../lib/notifications'
import { usePendingTransactions } from '../providers/pending-transactions-context'

import type { ApiOutput } from '@status-im/wallet/data'

type Activity = ApiOutput['activities']['activities']['activities'][0]

const NOTIFIED_KEY = 'local:tx-monitor:notified' as const

async function markConfirmed(
  hash: string,
  amount: number,
  asset: string,
): Promise<void> {
  const notified = (await storage.getItem<string[]>(NOTIFIED_KEY)) ?? []
  if (notified.includes(hash)) return
  await storage.setItem(NOTIFIED_KEY, [...notified, hash])
  await notifyTransactionConfirmed(String(amount), asset)
}

export const usePendingTransactionsCleanup = (activities: Activity[]) => {
  const { pendingTransactions, removePendingTransaction } =
    usePendingTransactions()

  useEffect(() => {
    if (pendingTransactions.length === 0 || activities.length === 0) {
      return
    }

    const confirmedHashes = new Set(
      activities.map(activity => getTransactionHash(activity.hash)),
    )

    const TEN_MINUTES_MS = 10 * 60 * 1000
    const now = Date.now()

    pendingTransactions.forEach(pendingTx => {
      const pendingHash = getTransactionHash(pendingTx.hash)

      if (confirmedHashes.has(pendingHash)) {
        void markConfirmed(pendingHash, pendingTx.value, pendingTx.asset)
        removePendingTransaction(pendingHash)
        return
      }

      const timestamp = pendingTx.metadata?.blockTimestamp
      if (timestamp) {
        const txTime = new Date(timestamp).getTime()
        if (!isNaN(txTime) && now - txTime > TEN_MINUTES_MS) {
          removePendingTransaction(pendingHash)
        }
      }
    })
  }, [activities, pendingTransactions, removePendingTransaction])
}
