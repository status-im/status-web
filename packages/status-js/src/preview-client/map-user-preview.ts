import type { ContactCodeAdvertisement } from '../proto/communities/v1/push_notifications'

export type UserPreview = {
  photo?: Uint8Array
  displayName: string
  description?: string
  // todo!:
  // emojiHash: string
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
    socialUrls: identity.socialLinks,
    appUrl: `status-im://u/${userPublicKey}`,
  }

  return userPreview
}
