import { keccak256 } from 'ethereum-cryptography/keccak'
import { getPublicKey, sign, utils } from 'ethereum-cryptography/secp256k1'
import { bytesToHex, utf8ToBytes } from 'ethereum-cryptography/utils'

import { privateKeyToAddress } from './utils/private-key-to-address'

export class Account {
  public privateKey: string
  public publicKey: string
  public address: string

  constructor() {
    const privateKey = utils.randomPrivateKey()
    const publicKey = getPublicKey(privateKey)

    this.privateKey = bytesToHex(privateKey)
    this.publicKey = bytesToHex(publicKey)
    this.address = privateKeyToAddress(this.privateKey)
  }

  sign = (payload: string) => {
    const hash = keccak256(utf8ToBytes(payload))
    return sign(hash, this.privateKey)
  }
}
