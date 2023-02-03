import { bytesToHex, utf8ToBytes } from 'ethereum-cryptography/utils'
import { expect, test } from 'vitest'

import { Account } from '../client/account'
import {
  ApplicationMetadataMessage,
  ApplicationMetadataMessage_Type,
} from '../protos/application-metadata-message_pb'
import { recoverPublicKey } from './recover-public-key'

import type { Client } from '../client/client'

test('should recover public key', async () => {
  const payload = utf8ToBytes('hello')

  // @fixme
  const account = new Account({} as unknown as Client)
  const signature = await account.sign(payload)

  expect(bytesToHex(recoverPublicKey(signature, payload))).toEqual(
    account.publicKey
  )
})

test('should recover public key from fixture', async () => {
  const metadataFixture = new ApplicationMetadataMessage({
    type: ApplicationMetadataMessage_Type.EMOJI_REACTION,
    signature: new Uint8Array([
      250, 132, 234, 119, 159, 124, 98, 93, 197, 108, 99, 52, 186, 234, 142,
      101, 147, 180, 50, 190, 102, 61, 219, 189, 95, 124, 29, 74, 43, 46, 106,
      108, 102, 234, 77, 209, 130, 140, 87, 96, 210, 34, 11, 115, 56, 98, 223,
      154, 30, 239, 23, 197, 243, 196, 248, 63, 162, 20, 108, 84, 250, 150, 230,
      129, 0,
    ]),
    payload: new Uint8Array([
      8, 138, 245, 146, 158, 148, 48, 18, 104, 48, 120, 48, 50, 57, 102, 49, 57,
      54, 98, 98, 102, 101, 102, 52, 102, 97, 54, 97, 53, 101, 98, 56, 49, 100,
      100, 56, 48, 50, 49, 51, 51, 97, 54, 51, 52, 57, 56, 51, 50, 53, 52, 52,
      53, 99, 97, 49, 97, 102, 49, 100, 49, 53, 52, 98, 49, 98, 98, 52, 53, 52,
      50, 57, 53, 53, 49, 51, 51, 51, 48, 56, 48, 52, 101, 97, 55, 45, 98, 100,
      54, 54, 45, 52, 100, 53, 100, 45, 57, 49, 101, 98, 45, 98, 50, 100, 99,
      102, 101, 50, 53, 49, 53, 98, 51, 26, 66, 48, 120, 53, 97, 57, 49, 99, 52,
      54, 48, 97, 97, 100, 101, 99, 51, 99, 55, 54, 100, 48, 56, 48, 98, 54, 99,
      55, 50, 97, 50, 48, 101, 49, 53, 97, 51, 51, 55, 102, 55, 99, 48, 98, 55,
      55, 97, 55, 99, 48, 97, 53, 101, 98, 97, 53, 102, 97, 57, 100, 52, 100,
      57, 49, 98, 97, 56, 32, 5, 40, 2,
    ]),
  })

  const publicKeySnapshot = new Uint8Array([
    4, 172, 65, 157, 172, 154, 139, 187, 88, 130, 90, 60, 222, 96, 238, 240,
    238, 113, 184, 207, 108, 99, 223, 97, 30, 238, 252, 142, 122, 172, 124, 121,
    181, 89, 84, 182, 121, 210, 76, 245, 236, 130, 218, 126, 217, 33, 202, 242,
    64, 98, 138, 155, 251, 52, 80, 197, 17, 26, 156, 255, 229, 78, 99, 24, 17,
  ])

  const result = recoverPublicKey(
    metadataFixture.signature,
    metadataFixture.payload
  )

  expect(result).toEqual(publicKeySnapshot)
})

test('should not recover public key with different payload', async () => {
  const payload = utf8ToBytes('1')

  // @fixme
  const account = new Account({} as unknown as Client)
  const signature = await account.sign(payload)

  const payload2 = utf8ToBytes('2')
  expect(recoverPublicKey(signature, payload2)).not.toEqual(account.publicKey)
})

test('should throw error when signature length is not 65 bytes', async () => {
  const payload = utf8ToBytes('hello')
  const signature = new Uint8Array([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ])

  expect(() =>
    recoverPublicKey(signature, payload)
  ).toThrowErrorMatchingInlineSnapshot(`"Signature must be 65 bytes long"`)
})
