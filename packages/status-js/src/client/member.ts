import { generateUsername } from '../utils/generate-username'
import { publicKeyToColorHash } from '../utils/public-key-to-color-hash'

import type { ColorHash } from '../utils/public-key-to-color-hash'

export class Member {
  publicKey: string
  username: string
  colorHash: ColorHash

  constructor(publicKey: string) {
    this.publicKey = publicKey
    this.username = generateUsername(publicKey)
    // TODO: can it fail?
    this.colorHash = publicKeyToColorHash(publicKey)!
  }
}
