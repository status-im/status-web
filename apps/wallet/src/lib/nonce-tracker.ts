import { padHex } from '@status-im/wallet/utils'

import {
  readNonceMarkStore,
  readNonceStore,
  writeNonceMarkStore,
  writeNonceStore,
} from '../data/nonce-tracker'
import { getRpcProxyUrl } from './rpc-proxy'

import type { NonceMark } from '../data/nonce-tracker'

const NONCE_URL_BASE = `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/nodes.getNonce`

/**
 * Blocks the counter must stay ahead of an empty pool before it is lowered.
 * ~1 minute: past any delay in the node counting a transaction it accepted.
 */
export const RECONCILE_AFTER_BLOCKS = 5

export type ChainNonceState = {
  /** `eth_getTransactionCount(address, 'pending')`. */
  pendingNonce: number
  /** `eth_getTransactionCount(address, 'latest')`. */
  latestNonce: number
  blockNumber: number
}

export type NonceDecision =
  | { action: 'clear' }
  | { action: 'mark'; mark: NonceMark }
  | { action: 'wait' }
  | { action: 'reconcile'; nonce: number }

/**
 * Whether the local counter is tracking a transaction that no longer exists.
 * Nothing lowered it before, so one dropped transaction left every later one
 * signed at a gapped nonce: queued, never mined, never advancing the count.
 *
 * `pendingNonce === latestNonce` means the node holds nothing for the account.
 * The mark makes that hold for `RECONCILE_AFTER_BLOCKS` so a transaction taken
 * but not yet counted is not mistaken for a stranded one.
 */
export function decideNonce(
  localNonce: number,
  chain: ChainNonceState,
  mark: NonceMark | undefined,
): NonceDecision {
  const poolIsEmpty = chain.pendingNonce === chain.latestNonce
  if (localNonce <= chain.pendingNonce || !poolIsEmpty) {
    return { action: 'clear' }
  }

  // A moved count or a lower block is a different situation -- restart.
  if (
    !mark ||
    mark.pendingNonce !== chain.pendingNonce ||
    chain.blockNumber < mark.block
  ) {
    return {
      action: 'mark',
      mark: { block: chain.blockNumber, pendingNonce: chain.pendingNonce },
    }
  }

  if (chain.blockNumber - mark.block < RECONCILE_AFTER_BLOCKS) {
    return { action: 'wait' }
  }

  return { action: 'reconcile', nonce: chain.pendingNonce }
}

async function fetchPendingNonce(
  fromAddress: string,
  network: string,
): Promise<number> {
  const url = new URL(NONCE_URL_BASE)
  url.searchParams.set(
    'input',
    JSON.stringify({ json: { address: fromAddress, network } }),
  )

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch nonce')
  }

  const body = await response.json()
  const hex: string = body.result.data.json
  return Number(hex)
}

/**
 * Batched as the array `rpc.proxy` accepts. Chain 1 resolves to the upstream
 * `nodes.getNonce` uses, so the counts compared below agree on a node.
 */
async function fetchMinedNonceAndBlock(
  fromAddress: string,
): Promise<{ latestNonce: number; blockNumber: number }> {
  const calls = [
    {
      method: 'eth_getTransactionCount',
      params: [fromAddress, 'latest'],
    },
    { method: 'eth_blockNumber', params: [] },
  ]

  const response = await fetch(getRpcProxyUrl(1), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      calls.map((call, index) => ({ jsonrpc: '2.0', id: index, ...call })),
    ),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch chain state')
  }

  const body = (await response.json()) as {
    id: number
    result?: unknown
    error?: unknown
  }[]

  const [latestNonce, blockNumber] = calls.map((_, index) => {
    const entry = Array.isArray(body)
      ? body.find(item => item.id === index)
      : null
    if (!entry || entry.error || typeof entry.result !== 'string') {
      throw new Error('Failed to fetch chain state')
    }
    const value = Number(entry.result)
    if (!Number.isFinite(value)) {
      throw new Error('Failed to fetch chain state')
    }
    return value
  })

  return { latestNonce, blockNumber }
}

export type NonceTracker = ReturnType<typeof createNonceTracker>
export function createNonceTracker() {
  const nonceCache = new Map<string, number>()
  const nonceCacheLoaded = new Set<string>()
  // Serializes all session-storage writes so concurrent commits for different
  // keys don't race on the shared nonce-tracker object.
  let storageWriteChain: Promise<void> = Promise.resolve()
  // Per-key mutex: serializes concurrent nonce reservations for the same address.
  const nonceLocks = new Map<string, Promise<unknown>>()

  async function loadNonce(key: string): Promise<void> {
    if (nonceCacheLoaded.has(key)) return
    nonceCacheLoaded.add(key)
    const store = await readNonceStore()
    if (store[key] !== undefined) {
      const current = nonceCache.get(key) ?? 0
      nonceCache.set(key, Math.max(current, store[key]))
    }
  }

  async function commitNonce(key: string, value: number): Promise<void> {
    nonceCache.set(key, value)
    storageWriteChain = storageWriteChain.then(async () => {
      const store = await readNonceStore()
      store[key] = value
      await writeNonceStore(store)
    })
    await storageWriteChain
  }

  async function writeMark(key: string, mark: NonceMark | null): Promise<void> {
    storageWriteChain = storageWriteChain.then(async () => {
      const store = await readNonceMarkStore()
      if (mark) {
        store[key] = mark
      } else {
        delete store[key]
      }
      await writeNonceMarkStore(store)
    })
    await storageWriteChain
  }

  /**
   * The nonce to sign at, lowering a counter that tracks a dropped transaction.
   * Best-effort: if the extra reads fail, the pending count alone still sends.
   *
   * `marked` reports that a mark for this pool count is already held, so the
   * caller leaves it alone instead of restarting its window.
   */
  async function resolveNonce(
    key: string,
    fromAddress: string,
    network: string,
  ): Promise<{
    nonce: number
    chain: ChainNonceState | null
    marked: boolean
  }> {
    const localNonce = nonceCache.get(key) ?? 0

    const [pending, mined] = await Promise.allSettled([
      fetchPendingNonce(fromAddress, network),
      fetchMinedNonceAndBlock(fromAddress),
    ])
    if (pending.status === 'rejected') {
      throw pending.reason
    }

    const pendingNonce = pending.value
    if (mined.status === 'rejected') {
      return {
        nonce: Math.max(pendingNonce, localNonce),
        chain: null,
        marked: false,
      }
    }

    const chain: ChainNonceState = { pendingNonce, ...mined.value }
    const marks = await readNonceMarkStore()
    const decision = decideNonce(localNonce, chain, marks[key])

    switch (decision.action) {
      case 'reconcile':
        await commitNonce(key, decision.nonce)
        await writeMark(key, null)
        return { nonce: decision.nonce, chain, marked: false }
      case 'mark':
        await writeMark(key, decision.mark)
        break
      case 'clear':
        if (marks[key]) await writeMark(key, null)
        break
      case 'wait':
        break
    }

    const marked = decision.action === 'mark' || decision.action === 'wait'
    return { nonce: Math.max(pendingNonce, localNonce), chain, marked }
  }

  /**
   * Executes `callback` with a reserved nonce for `fromAddress` on `network`.
   * The nonce is committed to persistent session storage only when the callback
   * resolves; a thrown error leaves the tracker unchanged so the next attempt
   * reuses the same nonce.
   *
   * Concurrent calls for the same address/network are serialized automatically.
   */
  async function withNonce<T>(
    fromAddress: string,
    network: string,
    callback: (nonceHex: string) => Promise<T>,
  ): Promise<T> {
    const key = `${fromAddress}:${network}`

    const run = async (): Promise<T> => {
      await loadNonce(key)
      const { nonce, chain, marked } = await resolveNonce(
        key,
        fromAddress,
        network,
      )

      const result = await callback(padHex(nonce.toString(16)))
      await commitNonce(key, nonce + 1)
      // Marking where the counter went ahead lets the next reservation tell
      // "still propagating" from "stranded" on its first try. Only the earliest
      // mark for a pool count holds, or any send restarts the waiting window.
      if (chain && !marked) {
        await writeMark(key, {
          block: chain.blockNumber,
          pendingNonce: chain.pendingNonce,
        })
      }
      return result
    }

    const prev = nonceLocks.get(key) ?? Promise.resolve()
    const next = prev.then(run)
    // The silenced promise keeps the chain alive even when `next` rejects.
    const silenced = next.catch(() => {})
    nonceLocks.set(key, silenced)
    // Release the lock slot once this link settles.
    silenced.then(() => {
      if (nonceLocks.get(key) === silenced) {
        nonceLocks.delete(key)
      }
    })

    return next
  }

  return { withNonce }
}

export const nonceTracker = createNonceTracker()
