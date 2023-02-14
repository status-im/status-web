import { Point } from 'ethereum-cryptography/secp256k1'
import {
  toHex,
  // utf8ToBytes as toBytes, // see https://github.com/paulmillr/noble-hashes/blob/d76eb7c818931d290c4c27abb778e8e269895154/src/utils.ts#L91-L96
} from 'ethereum-cryptography/utils'
import { varint } from 'multiformats'
import { base58btc } from 'multiformats/bases/base58'

/**
 * @see https://github.com/multiformats/multibase/blob/af2d36bdfaeaca453d20b18542ca57bd56b51f6c/README.md#multibase-table
 */
const VALID_MULTIBASE_CODES = [
  'f', // hexadecimal
  'z', // base58btc
] as const

type MultibaseCode = typeof VALID_MULTIBASE_CODES[number]

/**
 * @see https://pkg.go.dev/github.com/multiformats/go-multicodec#pkg-types
 */
const VALID_MULTICODEC_CODES = [
  231, // secp256k1-pub (compressed) (0xe7)
] as const

type MulticodecCode = typeof VALID_MULTICODEC_CODES[number]

/**
 * @see https://specs.status.im/spec/2#public-key-serialization for specification
 */
export function deserializePublicKey(
  publicKey: string, // uncompressed, compressed, or compressed & encoded
  options = { compress: true }
): string {
  const multibasePublicKey = publicKey.replace(/^0[xX]/, 'f') // ensure multibase code for hexadecimal encoding
  const multibaseCode = multibasePublicKey[0] as MultibaseCode

  if (!VALID_MULTIBASE_CODES.includes(multibaseCode)) {
    throw new Error('Invalid public key multibase code')
  }

  let hexadecimalPublicKey: string
  switch (multibaseCode) {
    case 'z': {
      const base58btcPublicKey = base58btc.decode(multibasePublicKey)
      const multicodec = varint.decode(base58btcPublicKey)
      const multicodecCode = multicodec[0] as MulticodecCode
      const multicodecCodeByteLength = multicodec[1]

      if (!VALID_MULTICODEC_CODES.includes(multicodecCode)) {
        throw new Error('Invalid public key multicodec code')
      }

      hexadecimalPublicKey = toHex(
        base58btcPublicKey.slice(multicodecCodeByteLength)
      )

      break
    }

    case 'f': {
      hexadecimalPublicKey = multibasePublicKey.slice(1)

      break
    }

    default: {
      throw new Error('Unsupported public key multicodec code')
    }
  }

  return `0x${Point.fromHex(hexadecimalPublicKey).toHex(options.compress)}` // validates and sets compression
}
