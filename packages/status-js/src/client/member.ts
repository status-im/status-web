import { compressPublicKey } from '../utils/compress-public-key'
import { generateUsername } from '../utils/generate-username'
import { publicKeyToColorHash } from '../utils/public-key-to-color-hash'

import type { ColorHash } from '../utils/public-key-to-color-hash'

export class Member {
  publicKey: string
  chatKey: string
  username: string
  colorHash: ColorHash

  constructor(publicKey: string) {
    this.publicKey = publicKey
    this.chatKey = '0x' + compressPublicKey(publicKey)
    this.username = generateUsername(publicKey)
    this.colorHash = publicKeyToColorHash(publicKey)
  }
}
