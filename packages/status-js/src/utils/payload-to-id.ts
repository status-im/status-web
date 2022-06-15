import { keccak256 } from 'ethereum-cryptography/keccak'
import { bytesToHex, concatBytes } from 'ethereum-cryptography/utils'

export function payloadToId(
  payload: Uint8Array,
  publicKey: Uint8Array
): string {
  const hash = keccak256(concatBytes(publicKey, payload)) // order matters
  const hex = bytesToHex(hash)

  return `0x${hex}`
}
