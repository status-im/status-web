import { useCallback, useEffect, useState } from 'react'

import { useAccount } from 'wagmi'

const STORAGE_KEY_PREFIX = 'vault-unlock-tx'
const SYNC_EVENT = 'vault-unlock-tx-sync'

function getStorageKey(vaultId: string, address: string) {
  return `${STORAGE_KEY_PREFIX}:${vaultId}:${address.toLowerCase()}`
}

/**
 * Persists and retrieves the unlock transaction hash for a vault.
 *
 * Used to track bridge message status after the user unlocks funds on L1.
 * Stored in localStorage so it survives page refreshes.
 * Uses a custom event to sync across component instances within the same tab.
 */
export function useUnlockTxHash(vaultId: string) {
  const { address } = useAccount()

  const [txHash, setTxHashState] = useState<string | null>(() => {
    if (!address) return null
    try {
      return localStorage.getItem(getStorageKey(vaultId, address))
    } catch {
      return null
    }
  })

  // Re-read from localStorage when address changes
  useEffect(() => {
    if (!address) {
      setTxHashState(null)
      return
    }
    try {
      setTxHashState(localStorage.getItem(getStorageKey(vaultId, address)))
    } catch {
      setTxHashState(null)
    }
  }, [vaultId, address])

  // Listen for sync events from other instances of this hook
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        key: string
        value: string | null
      }
      if (!address) return
      if (detail.key === getStorageKey(vaultId, address)) {
        setTxHashState(detail.value)
      }
    }
    window.addEventListener(SYNC_EVENT, handler)
    return () => window.removeEventListener(SYNC_EVENT, handler)
  }, [vaultId, address])

  const setTxHash = useCallback(
    (hash: string) => {
      if (!address) return
      const key = getStorageKey(vaultId, address)
      try {
        localStorage.setItem(key, hash)
      } catch {
        // localStorage might be unavailable
      }
      setTxHashState(hash)
      window.dispatchEvent(
        new CustomEvent(SYNC_EVENT, { detail: { key, value: hash } })
      )
    },
    [vaultId, address]
  )

  const clearTxHash = useCallback(() => {
    if (!address) return
    const key = getStorageKey(vaultId, address)
    try {
      localStorage.removeItem(key)
    } catch {
      // localStorage might be unavailable
    }
    setTxHashState(null)
    window.dispatchEvent(
      new CustomEvent(SYNC_EVENT, { detail: { key, value: null } })
    )
  }, [vaultId, address])

  return { txHash, setTxHash, clearTxHash }
}
