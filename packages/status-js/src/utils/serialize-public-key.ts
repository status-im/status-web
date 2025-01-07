import { hexToBytes } from 'ethereum-cryptography/utils'
import { base58btc } from 'multiformats/bases/base58'

import { deserializePublicKey } from './deserialize-public-key'

/**
 * @see https://specs.status.im/spec/2#public-key-serialization for specification
 */
export function serializePublicKey(
  publicKey: string, // uncompressed, compressed, or compressed & encoded
): string {
  const hexadecimalPublicKey = hexToBytes(
    deserializePublicKey(publicKey).replace(/^0[xX]/, ''),
  ) // validated and compressed

  return base58btc.encode(new Uint8Array([231, 1, ...hexadecimalPublicKey]))
}
