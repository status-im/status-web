import { tags as tagsMap } from './tags'

import type { CommunityDescription } from '../protos/communities_pb'

export type CommunityInfo = {
  banner?: Uint8Array
  photo?: Uint8Array
  displayName: string
  description: string
  membersCount: number
  tags: Tag[]
  color: string
}

export type Tag = {
  emoji: string
  text: string
}

export function mapCommunity(
  communityDescription: CommunityDescription
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
    tags: tags.reduce<Tag[]>((tags, nextTag) => {
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
