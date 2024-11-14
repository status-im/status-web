import { mapCommunity } from './map-community'

import type {
  CommunityChat,
  CommunityDescription,
} from '../protos/communities_pb'
import type { CommunityInfo } from './map-community'

export type ChannelInfo = {
  emoji?: string
  displayName: string
  description: string
  color: string
  community: CommunityInfo
}

export function mapChannel(
  communityChat: CommunityChat,
  communityDescription: CommunityDescription,
): ChannelInfo | undefined {
  const community = mapCommunity(communityDescription)

  if (!community) {
    return
  }

  const { identity } = communityChat

  if (!identity) {
    return
  }

  const channelInfo: ChannelInfo = {
    emoji: identity.emoji,
    displayName: identity.displayName,
    description: identity.description,
    color: identity.color,
    community,
  }

  return channelInfo
}
