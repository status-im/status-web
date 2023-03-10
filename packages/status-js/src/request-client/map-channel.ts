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
  appUrl: string
  color: string
  community: CommunityInfo
}

export function mapChannel(
  communityChat: CommunityChat,
  communityDescription: CommunityDescription,
  communityPublicKey: string,
  communityChatUuid: string
): ChannelInfo | undefined {
  const community = mapCommunity(communityDescription, communityPublicKey)

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
    appUrl: `status-im://cc/${communityPublicKey}/${communityChatUuid}`,
    community,
  }

  return channelInfo
}
