import { keccak256 } from 'ethereum-cryptography/keccak'
import * as secp from 'ethereum-cryptography/secp256k1'
import { utf8ToBytes } from 'ethereum-cryptography/utils'
import { expect, test } from 'vitest'

import { Account } from './account'

test('should verify the signature', async () => {
  const account = new Account({} as any)

  const message = utf8ToBytes('123')
  const messageHash = keccak256(message)

  const signature = await account.sign(message)
  const signatureWithoutRecoveryId = signature.slice(0, -1)

  expect(
    secp.verify(signatureWithoutRecoveryId, messageHash, account.publicKey)
  ).toBeTruthy()
})

test('should not verify signature with different message', async () => {
  const account = new Account({} as any)

  const message = utf8ToBytes('123')
  const messageHash = keccak256(message)

  const signature = await account.sign(utf8ToBytes('abc'))

  expect(secp.verify(signature, messageHash, account.publicKey)).toBeFalsy()
})
