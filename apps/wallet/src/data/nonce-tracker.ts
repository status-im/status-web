import { storage } from '@wxt-dev/storage'

const NONCE_SESSION_KEY = 'session:nonce:tracker' as const
const NONCE_MARK_SESSION_KEY = 'session:nonce:ahead' as const

/** When the local counter was last seen ahead of an empty transaction pool. */
export type NonceMark = {
  block: number
  /** Pending count then; a different one describes a new situation. */
  pendingNonce: number
}

export async function readNonceStore(): Promise<Record<string, number>> {
  return (
    (await storage.getItem<Record<string, number>>(NONCE_SESSION_KEY)) ?? {}
  )
}

export async function writeNonceStore(
  store: Record<string, number>,
): Promise<void> {
  await storage.setItem(NONCE_SESSION_KEY, store)
}

export async function readNonceMarkStore(): Promise<Record<string, NonceMark>> {
  return (
    (await storage.getItem<Record<string, NonceMark>>(
      NONCE_MARK_SESSION_KEY,
    )) ?? {}
  )
}

export async function writeNonceMarkStore(
  store: Record<string, NonceMark>,
): Promise<void> {
  await storage.setItem(NONCE_MARK_SESSION_KEY, store)
}
