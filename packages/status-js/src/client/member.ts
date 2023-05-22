import { createUserURLWithChatKey } from '../utils/create-url'
import { generateUsername } from '../utils/generate-username'
import { publicKeyToColorHash } from '../utils/public-key-to-color-hash'
import { serializePublicKey } from '../utils/serialize-public-key'

import type { ColorHash } from '../utils/public-key-to-color-hash'

export class Member {
  publicKey: string
  chatKey: string
  username: string
  colorHash: ColorHash

  constructor(publicKey: string) {
    this.publicKey = publicKey
    this.chatKey = serializePublicKey(this.publicKey)
    this.username = generateUsername(publicKey)
    this.colorHash = publicKeyToColorHash(publicKey)
  }

  public get link(): URL {
    return createUserURLWithChatKey(this.chatKey)
  }
}
