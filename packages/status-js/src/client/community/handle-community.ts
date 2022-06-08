import { ApplicationMetadataMessage } from '../../../protos/application-metadata-message'
import { ProtocolMessage } from '../../../protos/protocol-message'
import { CommunityDescription } from '../../wire/community_description'

import type { CommunityMetadataType } from './community'
import type { WakuMessage } from 'js-waku'

export function handleCommunity(
  wakuMessage: WakuMessage
): CommunityMetadataType | undefined {
  if (!wakuMessage.payload) {
    return
  }

  if (!wakuMessage.signaturePublicKey) {
    return
  }

  let messageToDecode = wakuMessage.payload

  try {
    const decodedProtocol = ProtocolMessage.decode(messageToDecode)
    if (decodedProtocol) {
      messageToDecode = decodedProtocol.publicMessage
    }
  } catch {}

  const decodedMetadata = ApplicationMetadataMessage.decode(messageToDecode)
  if (!decodedMetadata.payload) {
    return
  }
  messageToDecode = decodedMetadata.payload

  // todo: merge and process other types of messages
  if (
    decodedMetadata.type !==
    ApplicationMetadataMessage.Type.TYPE_COMMUNITY_DESCRIPTION
  ) {
    return
  }

  const decodedPayload = CommunityDescription.decode(messageToDecode)
  // todo!: explain
  if (!decodedPayload.identity) {
    return
  }

  return decodedPayload.proto
}
