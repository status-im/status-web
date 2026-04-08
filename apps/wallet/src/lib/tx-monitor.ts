import { storage } from '@wxt-dev/storage'

import {
  notifyTransactionConfirmed,
  notifyTransactionFailed,
} from './notifications'
import { PENDING_TXS_KEY, TX_NOTIFIED_KEY } from './storage-keys'
import { extractTxHash } from './tx-helpers'

type PendingTx = {
  hash: unknown
  value: number
  asset: string
  displayAmount?: string
}

async function fetchReceipt(
  txHash: string,
): Promise<{ status: string } | null> {
  try {
    const res = await fetch('http://127.0.0.1:8545', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionReceipt',
        params: [txHash],
        id: 1,
      }),
    })
    const json = (await res.json()) as { result: { status: string } | null }
    return json.result
  } catch {
    return null
  }
}

export const TX_MONITOR_ALARM = 'tx-monitor'
// 0.5 minutes = 30 seconds, minimum allowed by Chrome MV3
const TX_MONITOR_INTERVAL_MINUTES = 0.5

export async function startTxMonitor(): Promise<void> {
  const existing = await chrome.alarms.get(TX_MONITOR_ALARM)
  if (!existing) {
    chrome.alarms.create(TX_MONITOR_ALARM, {
      periodInMinutes: TX_MONITOR_INTERVAL_MINUTES,
    })
  }
}

export async function checkPendingTransactions(): Promise<void> {
  const pendingTxs = (await storage.getItem<PendingTx[]>(PENDING_TXS_KEY)) ?? []

  if (pendingTxs.length === 0) {
    await chrome.alarms.clear(TX_MONITOR_ALARM)
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
    const remaining = pendingTxs.filter(tx => {
      const txHash = extractTxHash(tx.hash)
      return !txHash || !settledHashes.has(txHash)
    })
    await storage.setItem(PENDING_TXS_KEY, remaining)

    if (remaining.length === 0) {
      await chrome.alarms.clear(TX_MONITOR_ALARM)
    }
  }

  if (newlyNotified.length > 0) {
    await storage.setItem(TX_NOTIFIED_KEY, [...notified, ...newlyNotified])
  }
}
