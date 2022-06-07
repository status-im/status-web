import { keccak256 } from 'ethereum-cryptography/keccak'
import { recoverPublicKey } from 'ethereum-cryptography/secp256k1'
import { bytesToHex } from 'ethereum-cryptography/utils'

import type { ApplicationMetadataMessage } from '../../protos/application-metadata-message'

/**
 * returns the public key of the signer
 * msg must be the  32-byte keccak hash of the message to be signed.
 * sig must be a 65-byte compact ECDSA signature containing the recovery id as the last element.
 */
export function recoverPublicKeyFromMetadata(
  metadata: ApplicationMetadataMessage
): string {
  const signature = metadata.signature.slice(0, 64)
  const recoveryId = metadata.signature.slice(-1)

  const pk = recoverPublicKey(
    keccak256(metadata.payload),
    signature,
    Number(recoveryId)
  )

  return bytesToHex(pk)
}
