import { mapCommunityPreview } from './map-community-preview'

import type {
  CommunityChat,
  CommunityDescription,
} from '../protos/communities_pb'
import type { CommunityPreview } from './map-community-preview'

export type CommunityChatPreview = {
  emoji?: string
  displayName: string
  description: string
  appUrl: string
  color: string
  community: CommunityPreview
}

export function mapCommunityChatPreview(
  communityChat: CommunityChat,
  communityDescription: CommunityDescription,
  communityPublicKey: string,
  communityChatUuid: string
): CommunityChatPreview | undefined {
  const community = mapCommunityPreview(
    communityDescription,
    communityPublicKey
  )

  if (!community) {
    return
  }

  const { identity } = communityChat

  if (!identity) {
    return
  }

  const communityChatPreview: CommunityChatPreview = {
    emoji: identity.emoji,
    displayName: identity.displayName,
    description: identity.description,
    color: identity.color,
    appUrl: `status-im://cc/${communityPublicKey}/${communityChatUuid}`,
    community,
  }

  return communityChatPreview
}
