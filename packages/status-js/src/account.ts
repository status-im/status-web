import { keccak256 } from 'ethereum-cryptography/keccak'
import { getPublicKey, sign } from 'ethereum-cryptography/secp256k1'
import {
  bytesToHex,
  concatBytes,
  hexToBytes,
} from 'ethereum-cryptography/utils'

export class Account {
  public privateKey: string
  public publicKey: string
  public chatKey: string

  constructor() {
    const privateKey = utils.randomPrivateKey()
    const publicKey = getPublicKey(privateKey)
    const chatKey = getPublicKey(privateKey, true)

    this.privateKey = bytesToHex(privateKey)
    // this.publicKey = bytesToHex(publicKey)
    this.publicKey =
      '0x04ac419dac9a8bbb58825a3cde60eef0ee71b8cf6c63df611eeefc8e7aac7c79b55954b679d24cf5ec82da7ed921caf240628a9bfb3450c5111a9cffe54e631811'

    // TODO?: add 0x prefix to public key
    this.chatKey = bytesToHex(chatKey)
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
}
