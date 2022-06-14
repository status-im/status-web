import { keccak256 } from 'ethereum-cryptography/keccak'
import { getPublicKey, sign, utils } from 'ethereum-cryptography/secp256k1'
import { bytesToHex, concatBytes } from 'ethereum-cryptography/utils'

import { compressPublicKey } from './utils/compress-public-key'
import { generateUsername } from './utils/generate-username'

export class Account {
  public privateKey: string
  public publicKey: string
  public chatKey: string
  public username: string

  constructor() {
    const privateKey = utils.randomPrivateKey()
    const publicKey = getPublicKey(privateKey)

    this.privateKey = bytesToHex(privateKey)
    this.publicKey = bytesToHex(publicKey)
    this.chatKey = '0x' + compressPublicKey(this.publicKey)
    this.username = generateUsername('0x' + this.publicKey)
  }

  // sig must be a 65-byte compact ECDSA signature containing the recovery id as the last element.
  sign = async (payload: Uint8Array) => {
    const hash = keccak256(payload)
    const [signature, recoverId] = await sign(hash, this.privateKey, {
      recovered: true,
      der: false,
    })

    return concatBytes(signature, new Uint8Array([recoverId]))
  }
}
