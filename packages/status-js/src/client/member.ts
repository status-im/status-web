import { compressPublicKey } from '../utils/compress-public-key'
import { createUserURL } from '../utils/create-url'
import { generateUsername } from '../utils/generate-username'
import { publicKeyToColorHash } from '../utils/public-key-to-color-hash'

import type { ColorHash } from '../utils/public-key-to-color-hash'

export class Member {
  publicKey: string
  chatKey: string
  username: string
  colorHash: ColorHash
  link: URL

  constructor(publicKey: string) {
    this.publicKey = publicKey
    this.chatKey = '0x' + compressPublicKey(publicKey)
    this.username = generateUsername(publicKey)
    this.colorHash = publicKeyToColorHash(publicKey)
    // todo?: use getter
    this.link = createUserURL(this.chatKey)
  }
}
