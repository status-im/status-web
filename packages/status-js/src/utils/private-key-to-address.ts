import { keccak256 } from 'ethereum-cryptography/keccak'
import { getPublicKey } from 'ethereum-cryptography/secp256k1'
import { bytesToHex } from 'ethereum-cryptography/utils'

export function privateKeyToAddress(privateKey: string): string {
  const publicKey = getPublicKey(privateKey)
  const publicKeyWithoutPrefix = publicKey.slice(1) // uncompressed public key has 04 prefix
  const hash = keccak256(publicKeyWithoutPrefix)
  const address = bytesToHex(hash.slice(12))

  // TODO: add checksum
  return address
}
