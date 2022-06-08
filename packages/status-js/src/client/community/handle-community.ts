import { ApplicationMetadataMessage } from '../../../protos/application-metadata-message'
import { CommunityDescription } from '../../wire/community_description'

import type { CommunityMetadataType } from './community'
import type { WakuMessage } from 'js-waku'

export function handleCommunity(
  wakuMessage: WakuMessage
): CommunityMetadataType | undefined {
  if (!wakuMessage.payload) {
    return
  }

  const decodedMetadata = ApplicationMetadataMessage.decode(wakuMessage.payload)
  if (!decodedMetadata.payload) {
    return
  }

  const decodedPayload = CommunityDescription.decode(decodedMetadata.payload)
  // todo!: explain
  if (!decodedPayload.identity) {
    return
  }

  return decodedPayload.proto
}
