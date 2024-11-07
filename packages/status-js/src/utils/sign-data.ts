import { keccak256 } from 'ethereum-cryptography/keccak'
import { sign, verify } from 'ethereum-cryptography/secp256k1'
import {
  concatBytes,
  toHex,
  utf8ToBytes as toBytes,
} from 'ethereum-cryptography/utils'

import { recoverPublicKey } from './recover-public-key'

/**
 * @returns 65-byte compact ECDSA signature containing the recovery id as the last element.
 */
export async function signData(
  data: Uint8Array | string,
  privateKey: Uint8Array | string,
): Promise<Uint8Array> {
  const bytes = ensureBytes(data)
  const hash = keccak256(bytes)

  const [signature, recoverId] = await sign(hash, privateKey, {
    recovered: true,
    der: false,
  })

  return concatBytes(signature, new Uint8Array([recoverId]))
}

export function verifySignedData(
  signature: Uint8Array,
  data: Uint8Array | string,
  publicKey?: string,
): boolean {
  const bytes = ensureBytes(data)
  const hash = keccak256(bytes)

  let _publicKey
  if (!publicKey) {
    const recoveredKey = recoverPublicKey(signature, bytes)
    _publicKey = toHex(recoveredKey)
  } else {
    _publicKey = publicKey.replace(/^0[xX]/, '')
  }

  return verify(signature.slice(0, -1), hash, _publicKey)
}

function ensureBytes(data: Uint8Array | string): Uint8Array {
  return data instanceof Uint8Array ? data : toBytes(data)
}
