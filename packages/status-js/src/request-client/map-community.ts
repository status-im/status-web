import { tags as tagsMap } from './tags'

import type { CommunityDescription } from '../protos/communities_pb'

export type CommunityInfo = {
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

export function mapCommunity(
  communityDescription: CommunityDescription,
  communityPublicKey: string
): CommunityInfo | undefined {
  const { identity, tags, members } = communityDescription

  if (!identity) {
    return
  }

  const communityInfo: CommunityInfo = {
    banner: identity.images.banner?.payload,
    photo: identity.images.thumbnail?.payload,
    displayName: identity.displayName,
    description: identity.description,
    membersCount: Object.keys(members).length,
    appUrl: `status-im://c/${communityPublicKey}`,
    tags: tags.reduce<CommunityInfo['tags']>((tags, nextTag) => {
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

  return communityInfo
}
