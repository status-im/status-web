import { recoverPublicKeyFromMetadata } from '~/src/utils/recover-public-key-from-metadata'

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

  let messageToDecode = wakuMessage.payload
  let decodedProtocol
  try {
    decodedProtocol = ProtocolMessage.decode(messageToDecode)
    if (decodedProtocol) {
      messageToDecode = decodedProtocol.publicMessage
    }
  } catch {}

  // fixme!: remove after replacing payloadToId
  if (!decodedProtocol) {
    return
  }

  const decodedMetadata = ApplicationMetadataMessage.decode(messageToDecode)
  if (!decodedMetadata.payload) {
    return
  }
  messageToDecode = decodedMetadata.payload

  // todo: merge and process other types of messages
  if (
    decodedMetadata.type !== ApplicationMetadataMessage.Type.TYPE_CHAT_MESSAGE
  ) {
    return
  }

  const publicKey = recoverPublicKeyFromMetadata(decodedMetadata)

  const decodedPayload = ChatMessage.decode(messageToDecode)

  // fixme?: handle decodedProtocol.encryptedMessage
  const messageId = payloadToId(decodedProtocol.publicMessage, publicKey)

  const channelId = getChannelId(decodedPayload.chatId)

  const message = mapChatMessage(decodedPayload, { messageId, channelId })

  return message
}
