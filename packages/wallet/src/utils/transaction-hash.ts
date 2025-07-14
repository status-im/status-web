export const getTransactionHash = (hash: unknown): string => {
  if (typeof hash === 'string') {
    return hash
  }
  if (typeof hash === 'object' && hash !== null) {
    if ('result' in hash && typeof hash.result === 'string') {
      return hash.result
    }
    if ('txid' in hash && typeof hash.txid === 'string') {
      return hash.txid
    }
  }
  console.warn('[getTransactionHash] Unrecognized hash object format:', hash)
  return String(hash)
}
