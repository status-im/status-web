/**
 * Unwraps API / activity shapes that may carry a tx hash as a string, in
 * `result`, or nested under `txid` (string or another object with `result`).
 */
function unwrapTransactionHash(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value
  }
  if (typeof value !== 'object' || value === null) {
    return undefined
  }

  const obj = value as Record<string, unknown>
  if (typeof obj['result'] === 'string') {
    return obj['result']
  }
  if ('txid' in obj) {
    const txid = obj['txid']
    if (typeof txid === 'string') {
      return txid
    }
    if (typeof txid === 'object' && txid !== null) {
      return unwrapTransactionHash(txid)
    }
  }

  return undefined
}

/** 32-byte Ethereum transaction hash as lowercase/uppercase hex with `0x` prefix. */
const ETHEREUM_TRANSACTION_HASH_REGEX = /^0x[0-9a-fA-F]{64}$/

export const isEthereumTransactionHash = (value: string): boolean =>
  ETHEREUM_TRANSACTION_HASH_REGEX.test(value)

/**
 * Normalizes a tx hash from tRPC / wallet responses or activity rows.
 * Falls back to `String(hash)` for unknown shapes.
 */
export const getTransactionHash = (hash: unknown): string => {
  const resolved = unwrapTransactionHash(hash)
  if (resolved !== undefined) {
    return resolved
  }

  console.warn('[getTransactionHash] Unrecognized hash object format:', hash)
  return String(hash)
}
