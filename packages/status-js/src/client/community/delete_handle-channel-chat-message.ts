import { ApplicationMetadataMessage } from '../../../protos/application-metadata-message'
import { ChatMessage } from '../../../protos/chat-message'
import { ProtocolMessage } from '../../../protos/protocol-message'
import { payloadToId } from '../../utils/payload-to-id'
import { getChannelId } from './get-channel-id'
import { mapChatMessage } from './map-chat-message'

import type { MessageType } from './community'
import type { WakuMessage } from 'js-waku'

export function handleChannelChatMessage(
  wakuMessage: WakuMessage
): MessageType | undefined {
  if (!wakuMessage.payload) {
    return
  }

  if (!wakuMessage.signaturePublicKey) {
    return
  }

  const decodedProtocol = ProtocolMessage.decode(wakuMessage.payload)
  if (!decodedProtocol) {
    return
  }

  const decodedMetadata = ApplicationMetadataMessage.decode(
    decodedProtocol.publicMessage
  )
  if (!decodedMetadata.payload) {
    return
  }

  // todo?: process other types of messages
  if (
    decodedMetadata.type !== ApplicationMetadataMessage.Type.TYPE_CHAT_MESSAGE
  ) {
    return
  }

  const decodedPayload = ChatMessage.decode(decodedMetadata.payload)

  const messageId = payloadToId(
    decodedProtocol.publicMessage,
    wakuMessage.signaturePublicKey
  )
  const channelId = getChannelId(decodedPayload.chatId)

  const message = mapChatMessage(decodedPayload, { messageId, channelId })

  return message
}
