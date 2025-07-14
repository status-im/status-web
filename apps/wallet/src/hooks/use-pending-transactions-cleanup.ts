import { useEffect } from 'react'

import { getTransactionHash } from '@status-im/wallet/utils'

import { usePendingTransactions } from '../providers/pending-transactions-context'

import type { ApiOutput } from '@status-im/wallet/data'

type Activity = ApiOutput['activities']['activities']['activities'][0]

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

    pendingTransactions.forEach(pendingTx => {
      const pendingHash = getTransactionHash(pendingTx.hash)

      if (confirmedHashes.has(pendingHash)) {
        removePendingTransaction(pendingHash)
      }
    })
  }, [activities, pendingTransactions, removePendingTransaction])
}
