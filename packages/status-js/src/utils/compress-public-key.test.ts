import { getPublicKey, utils } from 'ethereum-cryptography/secp256k1'
import { bytesToHex } from 'ethereum-cryptography/utils'

import { compressPublicKey } from './compress-public-key'

describe('compressPublicKey', () => {
  it('should return compressed public key', () => {
    const privateKey = utils.randomPrivateKey()

    const publicKey = bytesToHex(getPublicKey(privateKey))
    const compressedPublicKey = bytesToHex(getPublicKey(privateKey, true))

    expect(compressPublicKey(publicKey)).toEqual(compressedPublicKey)
  })

  it('should accept public key with a base prefix', () => {
    const privateKey = utils.randomPrivateKey()

    const publicKey = '0x' + bytesToHex(getPublicKey(privateKey))
    const compressedPublicKey = bytesToHex(getPublicKey(privateKey, true))

    expect(compressPublicKey(publicKey)).toEqual(compressedPublicKey)
  })

  it('should throw error if public key is not a valid hex', () => {
    expect(() => {
      compressPublicKey('not a valid public key')
    }).toThrowErrorMatchingInlineSnapshot(`"Invalid public key"`)
  })
})
