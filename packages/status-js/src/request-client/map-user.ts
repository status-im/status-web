import { publicKeyToColorHash } from '../utils/public-key-to-color-hash'
import { publicKeyToEmojiHash } from '../utils/public-key-to-emoji-hash'

import type { ContactCodeAdvertisement } from '../protos/push-notifications_pb'

export type UserInfo = {
  photo?: Uint8Array
  displayName: string
  description?: string
  colorHash: number[][]
  emojiHash: string
  // todo: currently not in protobuf nor in product
  // color: string
}

export function mapUser(
  contactCodeAdvertisement: ContactCodeAdvertisement,
  userPublicKey: string,
): UserInfo | undefined {
  const { chatIdentity: identity } = contactCodeAdvertisement

  if (!identity) {
    return
  }

  const userInfo: UserInfo = {
    photo: identity.images.thumbnail?.payload,
    displayName: identity.displayName,
    description: identity.description,
    colorHash: publicKeyToColorHash(userPublicKey),
    emojiHash: publicKeyToEmojiHash(userPublicKey),
  }

  return userInfo
}
