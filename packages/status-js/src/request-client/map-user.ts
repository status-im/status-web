import { publicKeyToEmojiHash } from '../utils/public-key-to-emoji-hash'

import type { ContactCodeAdvertisement } from '../protos/push-notifications_pb'

export type UserInfo = {
  photo?: Uint8Array
  displayName: string
  description?: string
  emojiHash: string
  socialUrls: Array<{
    url: string
    // todo?: map fixed (e.g. telegram) and custom
    text: string
  }>
  // todo: currently not in protobuf nor in product
  // color: string
}

export function mapUser(
  contactCodeAdvertisement: ContactCodeAdvertisement,
  userPublicKey: string
): UserInfo | undefined {
  const { chatIdentity: identity } = contactCodeAdvertisement

  if (!identity) {
    return
  }

  const userInfo: UserInfo = {
    photo: identity.images.thumbnail?.payload,
    displayName: identity.displayName,
    description: identity.description,
    emojiHash: publicKeyToEmojiHash(userPublicKey),
    socialUrls: identity.socialLinks,
  }

  return userInfo
}
