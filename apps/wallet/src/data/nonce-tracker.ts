import { storage } from '@wxt-dev/storage'

const NONCE_SESSION_KEY = 'session:nonce:tracker' as const

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
