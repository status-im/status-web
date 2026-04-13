export function extractTxHash(hash: unknown): string | null {
  if (typeof hash === 'string') return hash
  if (hash && typeof hash === 'object') {
    const obj = hash as Record<string, unknown>
    if ('result' in obj && typeof obj.result === 'string') return obj.result
    if ('txid' in obj && typeof obj.txid === 'string') return obj.txid
  }
  return null
}
