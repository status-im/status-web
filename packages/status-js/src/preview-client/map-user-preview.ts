import { publicKeyToEmojiHash } from '../utils/public-key-to-emoji-hash'

import type { ContactCodeAdvertisement } from '../protos/push-notifications_pb'

export type UserPreview = {
  photo?: Uint8Array
  displayName: string
  description?: string
  emojiHash: string
  socialUrls: Array<{
    url: string
    // todo?: map fixed (e.g. telegram) and custom
    text: string
  }>
  appUrl: string
  // todo: currently not in protobuf nor in product
  // color: string
}

export function mapUserPreview(
  contactCodeAdvertisement: ContactCodeAdvertisement,
  userPublicKey: string
): UserPreview | undefined {
  const { chatIdentity: identity } = contactCodeAdvertisement

  if (!identity) {
    return
  }

  const userPreview: UserPreview = {
    photo: identity.images.thumbnail?.payload,
    displayName: identity.displayName,
    description: identity.description,
    emojiHash: publicKeyToEmojiHash(userPublicKey),
    socialUrls: identity.socialLinks,
    appUrl: `status-im://u/${userPublicKey}`,
  }

  return userPreview
}
