'use client'

import { useCallback, useEffect, useState } from 'react'

import { parseUnits } from 'viem'
import { linea } from 'viem/chains'
import { useSignMessage } from 'wagmi'

import type { Vault } from '~constants/index'

/**
 * DEMO_MODE — temporary switch that mocks all on-chain reads/writes for the
 * pre-deposit withdraw flow so the team can walk through Unlock → Bridging →
 * Claim in a browser without contracts being deployed.
 *
 * To revert: change to `false` (or delete this constant and the `if (DEMO_MODE)`
 * branches that reference it across the _hooks/ directory).
 */
export const DEMO_MODE = true

// ============================================================================
// Mock balances (one bigint per in-scope vault id)
// ============================================================================

export const MOCK_L1_BALANCES: Record<string, bigint> = {
  SNT: parseUnits('1000', 18),
  WETH: parseUnits('1.5', 18),
  LINEA: parseUnits('250', 18),
  GUSD: parseUnits('500', 18),
}

/** How long the fake bridge wait lasts before transitioning to 'claimable'. */
export const BRIDGE_DEMO_DURATION_MS = 10_000

// ============================================================================
// Per-vault demo state machine (localStorage-backed, cross-instance synced)
// ============================================================================

export type DemoPhase = 'idle' | 'bridging' | 'claimable' | 'claimed'

type StoredState = {
  phase: DemoPhase
  unlockedAt: number | null
  /** Wei amount the user "unlocked" — surfaced as L2 pending in demo mode. */
  unlockedAmount: string | null
}

const STORAGE_KEY_PREFIX = 'vault-demo-state'
const SYNC_EVENT = 'vault-demo-state-sync'
const DEFAULT_STATE: StoredState = {
  phase: 'idle',
  unlockedAt: null,
  unlockedAmount: null,
}

function getStorageKey(vaultId: string): string {
  return `${STORAGE_KEY_PREFIX}:${vaultId}`
}

function readState(vaultId: string): StoredState {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = localStorage.getItem(getStorageKey(vaultId))
    if (!raw) return DEFAULT_STATE
    const parsed = JSON.parse(raw) as Partial<StoredState>
    return {
      phase: parsed.phase ?? 'idle',
      unlockedAt: parsed.unlockedAt ?? null,
      unlockedAmount: parsed.unlockedAmount ?? null,
    }
  } catch {
    return DEFAULT_STATE
  }
}

function writeState(vaultId: string, next: StoredState): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(getStorageKey(vaultId), JSON.stringify(next))
  } catch {
    // ignore
  }
  window.dispatchEvent(
    new CustomEvent(SYNC_EVENT, {
      detail: { vaultId, value: next },
    })
  )
}

/**
 * Plain (non-hook) mutators — usable inside react-query mutationFn closures
 * where we can't call `useDemoVaultState`.
 */
export function markVaultUnlocked(vault: Vault, amountWei: bigint): void {
  const isSameChain = vault.chainId === linea.id
  const amount = amountWei.toString()
  const next: StoredState = isSameChain
    ? { phase: 'claimable', unlockedAt: null, unlockedAmount: amount }
    : { phase: 'bridging', unlockedAt: Date.now(), unlockedAmount: amount }
  writeState(vault.id, next)
}

export function markVaultClaimed(vault: Vault): void {
  writeState(vault.id, {
    phase: 'claimed',
    unlockedAt: null,
    unlockedAmount: null,
  })
}

/**
 * Wipes every demo-state localStorage entry. Used by the page-level Reset Demo
 * button to start the walkthrough over from scratch.
 */
export function resetAllDemoState(): void {
  if (typeof window === 'undefined') return
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(`${STORAGE_KEY_PREFIX}:`)) keys.push(key)
  }
  for (const key of keys) localStorage.removeItem(key)
  // Also clear unlock-tx hashes so the bridging UI doesn't get confused.
  const unlockKeys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('vault-unlock-tx:')) unlockKeys.push(key)
  }
  for (const key of unlockKeys) localStorage.removeItem(key)
}

/**
 * Hook returning the demo phase for a single vault, plus mutators.
 *
 * Mirrors the localStorage + custom-event pattern used by `useUnlockTxHash`
 * so multiple component instances stay in sync within the same tab.
 */
export function useDemoVaultState(vault: Vault): {
  phase: DemoPhase
  unlockedAt: number | null
  unlockedAmount: bigint | null
  reset: () => void
} {
  const [state, setState] = useState<StoredState>(() => readState(vault.id))

  // Re-read when vault id changes
  useEffect(() => {
    setState(readState(vault.id))
  }, [vault.id])

  // Listen for cross-instance updates
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        vaultId: string
        value: StoredState
      }
      if (detail.vaultId === vault.id) {
        setState(detail.value)
      }
    }
    window.addEventListener(SYNC_EVENT, handler)
    return () => window.removeEventListener(SYNC_EVENT, handler)
  }, [vault.id])

  // Auto-promote 'bridging' → 'claimable' once enough time has passed.
  useEffect(() => {
    if (state.phase !== 'bridging' || !state.unlockedAt) return
    const elapsed = Date.now() - state.unlockedAt
    const remaining = BRIDGE_DEMO_DURATION_MS - elapsed
    const promote = () => {
      const next: StoredState = {
        phase: 'claimable',
        unlockedAt: null,
        unlockedAmount: state.unlockedAmount,
      }
      writeState(vault.id, next)
      setState(next)
    }
    if (remaining <= 0) {
      promote()
      return
    }
    const timer = setTimeout(promote, remaining)
    return () => clearTimeout(timer)
  }, [state.phase, state.unlockedAt, state.unlockedAmount, vault.id])

  const reset = useCallback(() => {
    writeState(vault.id, DEFAULT_STATE)
    setState(DEFAULT_STATE)
  }, [vault.id])

  return {
    phase: state.phase,
    unlockedAt: state.unlockedAt,
    unlockedAmount: state.unlockedAmount ? BigInt(state.unlockedAmount) : null,
    reset,
  }
}

// ============================================================================
// Demo signature helper
// ============================================================================

/**
 * Returns a `signDemoMessage` callback bound to the connected wallet.
 *
 * Used by `usePreDepositUnlock` and `useFulfillClaim` to keep the wallet
 * popup intact (so the demo feels real) while never broadcasting a tx.
 */
export function useDemoSign(): (
  vaultName: string,
  action: 'unlock' | 'claim'
) => Promise<`0x${string}`> {
  const { signMessageAsync } = useSignMessage()

  return useCallback(
    async (vaultName: string, action: 'unlock' | 'claim') => {
      const message = `Demo ${action} for ${vaultName} — no funds will move.`
      return signMessageAsync({ message })
    },
    [signMessageAsync]
  )
}

/** Synthetic tx hash for demo flows that need to satisfy `(hash: string)` callbacks. */
export function fakeTxHash(): `0x${string}` {
  const bytes = new Uint8Array(32)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes)
  } else {
    for (let i = 0; i < bytes.length; i++)
      bytes[i] = Math.floor(Math.random() * 256)
  }
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  return `0x${hex}`
}
