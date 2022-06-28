import * as secp from 'ethereum-cryptography/secp256k1'
import { bytesToHex } from 'ethereum-cryptography/utils'
import { expect, test } from 'vitest'

import { compressPublicKey } from './compress-public-key'

test('should return compressed public key', () => {
  const privateKey = secp.utils.randomPrivateKey()

  const publicKey = bytesToHex(secp.getPublicKey(privateKey))
  const compressedPublicKey = bytesToHex(secp.getPublicKey(privateKey, true))

  expect(compressPublicKey(publicKey)).toEqual(compressedPublicKey)
})

test('should accept public key with a base prefix', () => {
  const privateKey = secp.utils.randomPrivateKey()

  const publicKey = '0x' + bytesToHex(secp.getPublicKey(privateKey))
  const compressedPublicKey = bytesToHex(secp.getPublicKey(privateKey, true))

  expect(compressPublicKey(publicKey)).toEqual(compressedPublicKey)
})

test('should throw error if public key is not a valid hex', () => {
  expect(() => {
    compressPublicKey('not a valid public key')
  }).toThrowErrorMatchingInlineSnapshot(`"Invalid public key"`)
})
