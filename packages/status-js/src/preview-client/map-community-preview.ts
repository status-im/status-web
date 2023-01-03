// todo?: rename to map-commuinty-details and use in client.ts too
import { tags as tagsMap } from './tags'

import type { CommunityDescription } from '../proto/communities/v1/communities'

export type CommunityPreview = {
  banner?: Uint8Array
  photo?: Uint8Array
  displayName: string
  description: string
  membersCount: number
  appUrl: string
  tags: Array<{
    emoji: string
    text: string
  }>
  color: string
}

export function mapCommunityPreview(
  communityDescription: CommunityDescription,
  communityPublicKey: string
): CommunityPreview | undefined {
  const { identity, tags, members } = communityDescription

  if (!identity) {
    return
  }

  const communityPreview: CommunityPreview = {
    banner: identity.images.banner?.payload,
    photo: identity.images.thumbnail?.payload,
    displayName: identity.displayName,
    description: identity.description,
    membersCount: Object.keys(members).length,
    appUrl: `status-im://c/${communityPublicKey}`,
    tags: tags.reduce<CommunityPreview['tags']>((tags, nextTag) => {
      const emoji = tagsMap[nextTag as keyof typeof tagsMap]

      if (!emoji) {
        return tags
      }

      tags.push({
        text: nextTag,
        emoji,
      })

      return tags
    }, []),
    color: identity.color,
  }

  return communityPreview
}
