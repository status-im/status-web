import { keccak256 } from 'ethereum-cryptography/keccak'
import * as secp from 'ethereum-cryptography/secp256k1'
import { utf8ToBytes } from 'ethereum-cryptography/utils'

import { Account } from './account'

describe('Account', () => {
  it('should verify the signature', async () => {
    const account = new Account()

    const message = '123'
    const messageHash = keccak256(utf8ToBytes(message))

    const signature = await account.sign(message)

    expect(secp.verify(signature, messageHash, account.publicKey)).toBeTruthy()
  })

  it('should not verify signature with different message', async () => {
    const account = new Account()

    const message = '123'
    const messageHash = keccak256(utf8ToBytes(message))

    const signature = await account.sign('abc')

    expect(secp.verify(signature, messageHash, account.publicKey)).toBeFalsy()
  })
})
