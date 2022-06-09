import { keccak256 } from 'ethereum-cryptography/keccak'
import { recoverPublicKey as secpRecoverPublicKey } from 'ethereum-cryptography/secp256k1'

/**
 * returns the public key of the signer
 * msg must be the  32-byte keccak hash of the message to be signed.
 * sig must be a 65-byte compact ECDSA signature containing the recovery id as the last element.
 */
export function recoverPublicKey(
  sig: Uint8Array,
  payload: Uint8Array
): Uint8Array {
  if (sig.length !== 65) {
    throw new Error('Signature must be 65 bytes long')
  }

  if (sig[64] >= 4) {
    throw new Error('Recovery id must be less than 4')
  }

  const signature = sig.slice(0, 64)
  const recoveryId = sig.slice(-1)

  return secpRecoverPublicKey(keccak256(payload), signature, Number(recoveryId))
}
