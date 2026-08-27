import {
  getTransactionHash,
  isEthereumTransactionHash,
} from '@status-im/wallet/utils'
import { storage } from '@wxt-dev/storage'

import {
  notifyTransactionConfirmed,
  notifyTransactionDropped,
  notifyTransactionFailed,
} from './notifications'
import { getRpcProxyUrl } from './rpc-proxy'
import { PENDING_TXS_KEY, TX_MISSES_KEY, TX_NOTIFIED_KEY } from './storage-keys'

type PendingTx = {
  hash: unknown
  value: number
  asset: string
  displayAmount?: string
}

type Receipt = { status: string }

/** `ok: false` is a transport or RPC failure, which says nothing about the tx. */
type RpcOutcome<T> = { ok: true; value: T } | { ok: false }

/**
 * Consecutive polls denying the hash before it counts as dropped. Three is
 * ~90s of the node having no record of something it accepted.
 */
export const DROPPED_AFTER_MISSES = 3

export type PollOutcome =
  | { state: 'confirmed' }
  | { state: 'failed' }
  | { state: 'dropped' }
  | { state: 'pending'; misses: number }
  /** Nothing conclusive; leave the record as it was. */
  | { state: 'unresolved' }

/**
 * What one poll proves. A null receipt is the normal answer for a transaction
 * still in the pool, so counting it as a miss would mark every slow one
 * dropped; `eth_getTransactionByHash` returning null is the real evidence.
 */
export function classifyPoll(
  receipt: RpcOutcome<Receipt | null>,
  known: RpcOutcome<boolean> | undefined,
  misses: number,
): PollOutcome {
  if (!receipt.ok) return { state: 'unresolved' }

  if (receipt.value) {
    if (receipt.value.status === '0x1') return { state: 'confirmed' }
    if (receipt.value.status === '0x0') return { state: 'failed' }
    return { state: 'unresolved' }
  }

  if (!known?.ok) return { state: 'unresolved' }
  if (known.value) return { state: 'pending', misses: 0 }

  const next = misses + 1
  return next >= DROPPED_AFTER_MISSES
    ? { state: 'dropped' }
    : { state: 'pending', misses: next }
}

async function rpcCall<T>(
  method: string,
  params: unknown[],
): Promise<RpcOutcome<T | null>> {
  try {
    // note: rpc.proxy expects a plain JSON-RPC body with chainId as a query
    // param; tRPC-formatted POST bodies are rejected by the API route handler
    const res = await fetch(getRpcProxyUrl(1), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
    })
    if (!res.ok) return { ok: false }

    const body = (await res.json()) as { result?: T | null; error?: unknown }
    if (body.error) return { ok: false }
    return { ok: true, value: body.result ?? null }
  } catch {
    return { ok: false }
  }
}

async function pollTransaction(
  txHash: string,
  misses: number,
): Promise<PollOutcome> {
  const receipt = await rpcCall<Receipt>('eth_getTransactionReceipt', [txHash])
  // Only asked without a receipt, the only case it decides.
  const known =
    receipt.ok && receipt.value === null
      ? await rpcCall<unknown>('eth_getTransactionByHash', [txHash]).then(
          (result): RpcOutcome<boolean> =>
            result.ok
              ? { ok: true, value: result.value !== null }
              : { ok: false },
        )
      : undefined

  return classifyPoll(receipt, known, misses)
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
    const misses = await storage.getItem<Record<string, number>>(TX_MISSES_KEY)
    if (misses && Object.keys(misses).length > 0) {
      await storage.setItem(TX_MISSES_KEY, {})
    }
    return
  }

  const notified = (await storage.getItem<string[]>(TX_NOTIFIED_KEY)) ?? []
  const misses =
    (await storage.getItem<Record<string, number>>(TX_MISSES_KEY)) ?? {}
  const notifiedSet = new Set(notified)
  const newlyNotified: string[] = []
  const settledHashes = new Set<string>()
  const nextMisses: Record<string, number> = {}

  const outcomes = await Promise.all(
    pendingTxs.map(tx => {
      const txHash = getTransactionHash(tx.hash)
      if (!isEthereumTransactionHash(txHash)) return null

      return pollTransaction(txHash, misses[txHash] ?? 0).then(outcome => ({
        tx,
        txHash,
        outcome,
      }))
    }),
  )

  for (const entry of outcomes) {
    if (!entry) continue

    const { tx, txHash, outcome } = entry

    if (outcome.state === 'pending') {
      if (outcome.misses > 0) nextMisses[txHash] = outcome.misses
      continue
    }
    if (outcome.state === 'unresolved') {
      // A failed poll must not age the transaction towards dropped.
      const carried = misses[txHash]
      if (carried) nextMisses[txHash] = carried
      continue
    }

    const amount = tx.displayAmount ?? String(tx.value)
    const asset = tx.asset ?? 'ETH'

    if (!notifiedSet.has(txHash)) {
      const notify =
        outcome.state === 'confirmed'
          ? notifyTransactionConfirmed
          : outcome.state === 'failed'
            ? notifyTransactionFailed
            : notifyTransactionDropped
      const fired = await notify(amount, asset)
      if (fired) {
        newlyNotified.push(txHash)
        notifiedSet.add(txHash)
      }
    }
    settledHashes.add(txHash)
  }

  if (settledHashes.size > 0) {
    const remaining = pendingTxs.filter(tx => {
      const txHash = getTransactionHash(tx.hash)
      if (!isEthereumTransactionHash(txHash)) return true
      return !settledHashes.has(txHash)
    })
    await storage.setItem(PENDING_TXS_KEY, remaining)

    if (remaining.length === 0) {
      await chrome.alarms.clear(TX_MONITOR_ALARM)
    }
  }

  await storage.setItem(TX_MISSES_KEY, nextMisses)

  if (newlyNotified.length > 0) {
    await storage.setItem(TX_NOTIFIED_KEY, [...notified, ...newlyNotified])
  }
}
