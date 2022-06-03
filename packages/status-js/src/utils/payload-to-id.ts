import { keccak256 } from 'ethereum-cryptography/keccak'
import { bytesToHex } from 'ethereum-cryptography/utils'

export function payloadToId(
  publicKey: Uint8Array,
  payload: Uint8Array
): string {
  const hash = keccak256(new Uint8Array([...publicKey, ...payload]))
  const hex = bytesToHex(hash)

  return `0x${hex}`
}
