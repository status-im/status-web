import { padHex } from '@status-im/wallet/utils'

import { readNonceStore, writeNonceStore } from '../data/nonce-tracker'

const NONCE_URL_BASE = `${import.meta.env.WXT_STATUS_API_URL}/api/trpc/nodes.getNonce`

async function fetchNetworkNonce(
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

  /**
   * Executes `callback` with a reserved nonce hex string for `fromAddress` on
   * `network`. The nonce is committed to persistent session storage only when
   * the callback resolves; a thrown error leaves the tracker unchanged so the
   * next attempt reuses the same nonce.
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
      const networkNonce = await fetchNetworkNonce(fromAddress, network)
      const localNonce = nonceCache.get(key) ?? 0
      const nonce = Math.max(networkNonce, localNonce)
      const nonceHex = padHex(nonce.toString(16))

      const result = await callback(nonceHex)
      await commitNonce(key, nonce + 1)
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
