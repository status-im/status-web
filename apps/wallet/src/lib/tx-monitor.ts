import { storage } from '@wxt-dev/storage'

import {
  notifyTransactionConfirmed,
  notifyTransactionFailed,
} from './notifications'

const PENDING_KEY = 'local:pending-transactions:transactions' as const
const NOTIFIED_KEY = 'local:tx-monitor:notified' as const
const ETH_RPC_URL = 'https://eth.merkle.io/'

type PendingTx = {
  hash: unknown
  value: number
  asset: string
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
    const res = await fetch(ETH_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionReceipt',
        params: [txHash],
        id: 1,
      }),
    })
    const json = (await res.json()) as {
      result: { status: string } | null
    }
    return json.result
  } catch {
    return null
  }
}

export async function checkPendingTransactions(): Promise<void> {
  const pendingTxs = (await storage.getItem<PendingTx[]>(PENDING_KEY)) ?? []

  if (pendingTxs.length === 0) {
    await storage.setItem(NOTIFIED_KEY, [])
    return
  }

  const notified = (await storage.getItem<string[]>(NOTIFIED_KEY)) ?? []
  const notifiedSet = new Set(notified)
  const newlyNotified: string[] = []

  for (const tx of pendingTxs) {
    const txHash = extractTxHash(tx.hash)
    if (!txHash || notifiedSet.has(txHash)) continue

    const receipt = await fetchReceipt(txHash)
    if (!receipt) continue

    const amount = String(tx.value)
    const asset = tx.asset ?? 'ETH'

    if (receipt.status === '0x1') {
      await notifyTransactionConfirmed(amount, asset)
      newlyNotified.push(txHash)
    } else if (receipt.status === '0x0') {
      await notifyTransactionFailed(amount, asset)
      newlyNotified.push(txHash)
    }
  }

  if (newlyNotified.length > 0) {
    await storage.setItem(NOTIFIED_KEY, [...notified, ...newlyNotified])
  }
}
