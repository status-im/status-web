export const extractTxHash = (id: unknown): string | undefined => {
  if (typeof id === 'string') {
    return id
  }

  if (id && typeof id === 'object') {
    const obj = id as Record<string, unknown>

    if ('result' in obj && typeof obj.result === 'string') {
      return obj.result
    }

    if ('txid' in obj && typeof obj.txid === 'string') {
      return obj.txid
    }
  }

  return undefined
}
