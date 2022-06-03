import { keccak256 } from 'ethereum-cryptography/keccak'
import { getPublicKey, sign, utils } from 'ethereum-cryptography/secp256k1'
import { bytesToHex } from 'ethereum-cryptography/utils'

export class Account {
  public privateKey: string
  public publicKey: string
  public chatKey: string

  constructor() {
    const privateKey = utils.randomPrivateKey()
    const publicKey = getPublicKey(privateKey)
    const chatKey = getPublicKey(privateKey, true)

    this.privateKey = bytesToHex(privateKey)
    this.publicKey = bytesToHex(publicKey)
    this.chatKey = bytesToHex(chatKey)
  }

  signMessage = (payload: Uint8Array) => {
    const hash = keccak256(payload)
    return sign(hash, this.privateKey)
  }
}
