import { ApplicationMetadataMessage } from '../../../protos/application-metadata-message'
import { ChatMessage } from '../../../protos/chat-message'
import { ProtocolMessage } from '../../../protos/protocol-message'
import { payloadToId } from '../../utils/payload-to-id'

import type { MessageType } from '../../client'
import type { WakuMessage } from 'js-waku'

export function handleMessage(
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

  const decodedPayload = ChatMessage.decode(decodedMetadata.payload)

  const messageId = payloadToId(
    decodedProtocol.publicMessage,
    wakuMessage.signaturePublicKey
  )

  const message = {
    ...decodedPayload,
    messageId: messageId,
    pinned: false,
    reactions: {
      'thumbs-up': {
        count: 0,
        me: false,
      },
      'thumbs-down': {
        count: 0,
        me: false,
      },
      heart: {
        count: 0,
        me: false,
      },
      smile: {
        count: 0,
        me: false,
      },
      sad: {
        count: 0,
        me: false,
      },
      angry: {
        count: 0,
        me: false,
      },
    },
  }

  return message
}
