import { storage } from '@wxt-dev/storage'

import {
  notifyTransactionConfirmed,
  notifyTransactionFailed,
} from './notifications'
import { PENDING_TXS_KEY, TX_NOTIFIED_KEY } from './storage-keys'

const ETH_RPC_URL = 'https://eth.merkle.io/'

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
  const pendingTxs = (await storage.getItem<PendingTx[]>(PENDING_TXS_KEY)) ?? []

  if (pendingTxs.length === 0) {
    await storage.setItem(TX_NOTIFIED_KEY, [])
    return
  }

  const notified = (await storage.getItem<string[]>(TX_NOTIFIED_KEY)) ?? []
  const notifiedSet = new Set(notified)
  const newlyNotified: string[] = []
  const settledHashes = new Set<string>()

  for (const tx of pendingTxs) {
    const txHash = extractTxHash(tx.hash)
    if (!txHash) continue

    const alreadyNotified = notifiedSet.has(txHash)

    const receipt = await fetchReceipt(txHash)
    if (!receipt) continue

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
