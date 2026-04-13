import { storage } from '@wxt-dev/storage'

import {
  notifyTransactionConfirmed,
  notifyTransactionFailed,
} from './notifications'
import { PENDING_TXS_KEY, TX_NOTIFIED_KEY } from './storage-keys'

type PendingTx = {
  hash: unknown
  value: number
  asset: string
  displayAmount?: string
}

function extractTxHash(hash: unknown): string | null {
  if (typeof hash === 'string') return hash
  if (hash && typeof hash === 'object' && 'txid' in hash) {
    const { txid } = hash as { txid: unknown }
    return typeof txid === 'string' ? txid : null
  }
  return null
}

async function fetchReceipt(
  txHash: string,
): Promise<{ status: string } | null> {
  try {
    const url = `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/rpc.proxy`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        json: {
          method: 'eth_getTransactionReceipt',
          params: [txHash],
          id: 1,
          chainId: 1,
        },
      }),
    })
    const body = (await res.json()) as {
      result: { data: { json: { result: { status: string } | null } } }
    }
    return body.result.data.json.result
  } catch {
    return null
  }
}

export async function hasPendingTransactions(): Promise<boolean> {
  const pendingTxs = (await storage.getItem<PendingTx[]>(PENDING_TXS_KEY)) ?? []
  return pendingTxs.length > 0
}

export async function checkPendingTransactions(): Promise<void> {
  const pendingTxs = (await storage.getItem<PendingTx[]>(PENDING_TXS_KEY)) ?? []

  if (pendingTxs.length === 0) {
    const notified = await storage.getItem<string[]>(TX_NOTIFIED_KEY)
    if (Array.isArray(notified) && notified.length > 0) {
      await storage.setItem(TX_NOTIFIED_KEY, [])
    }
    return
  }

  const notified = (await storage.getItem<string[]>(TX_NOTIFIED_KEY)) ?? []
  const notifiedSet = new Set(notified)
  const newlyNotified: string[] = []
  const settledHashes = new Set<string>()

  const receipts = await Promise.all(
    pendingTxs.map(tx => {
      const txHash = extractTxHash(tx.hash)
      return txHash
        ? fetchReceipt(txHash).then(r => ({ tx, txHash, receipt: r }))
        : null
    }),
  )

  for (const entry of receipts) {
    if (!entry || !entry.receipt) continue

    const { tx, txHash, receipt } = entry
    const alreadyNotified = notifiedSet.has(txHash)
    const amount = tx.displayAmount ?? String(tx.value)
    const asset = tx.asset ?? 'ETH'

    if (receipt.status === '0x1') {
      if (!alreadyNotified) {
        const fired = await notifyTransactionConfirmed(amount, asset)
        if (fired) {
          newlyNotified.push(txHash)
          notifiedSet.add(txHash)
        }
      }
      settledHashes.add(txHash)
    } else if (receipt.status === '0x0') {
      if (!alreadyNotified) {
        const fired = await notifyTransactionFailed(amount, asset)
        if (fired) {
          newlyNotified.push(txHash)
          notifiedSet.add(txHash)
        }
      }
      settledHashes.add(txHash)
    }
  }

  if (settledHashes.size > 0) {
    await storage.setItem(
      PENDING_TXS_KEY,
      pendingTxs.filter(tx => {
        const txHash = extractTxHash(tx.hash)
        return !txHash || !settledHashes.has(txHash)
      }),
    )
  }

  if (newlyNotified.length > 0) {
    await storage.setItem(TX_NOTIFIED_KEY, [...notified, ...newlyNotified])
  }
}
