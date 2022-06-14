import { bytesToHex } from 'ethereum-cryptography/utils'

import { ApplicationMetadataMessage } from '../../../protos/application-metadata-message'
import {
  ChatMessage,
  DeleteMessage,
  EditMessage,
} from '../../../protos/chat-message'
import { EmojiReaction } from '../../../protos/emoji-reaction'
import { PinMessage } from '../../../protos/pin-message'
import { ProtocolMessage } from '../../../protos/protocol-message'
import { CommunityDescription } from '../../proto/communities/v1/communities'
import { payloadToId } from '../../utils/payload-to-id'
import { recoverPublicKey } from '../../utils/recover-public-key'
import { getChatUuid } from './get-chat-uuid'
import { mapChatMessage } from './map-chat-message'

import type { Account } from '../../account'
import type { Client } from '../../client'
import type { Community } from './community'
import type { WakuMessage } from 'js-waku'

export function handleWakuMessage(
  wakuMessage: WakuMessage,
  // state
  client: Client,
  community: Community,
  account?: Account
): void {
  // decode (layers)
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

  const decodedMetadata = ApplicationMetadataMessage.decode(messageToDecode)
  if (!decodedMetadata.payload) {
    return
  }
  messageToDecode = decodedMetadata.payload

  const publicKey = recoverPublicKey(
    decodedMetadata.signature,
    decodedMetadata.payload
  )

  const messageId = payloadToId(
    decodedProtocol?.publicMessage ?? wakuMessage.payload,
    publicKey
  )

  // already handled
  if (client.wakuMessages.has(messageId)) {
    return
  }

  let success = false

  // decode, map and handle (events)
  switch (decodedMetadata.type) {
    case ApplicationMetadataMessage.Type.TYPE_COMMUNITY_DESCRIPTION: {
      // decode
      const decodedPayload = CommunityDescription.decode(messageToDecode)

      // handle (state and callback)
      community.handleDescription(decodedPayload)

      success = true

      break
    }

    case ApplicationMetadataMessage.Type.TYPE_CHAT_MESSAGE: {
      // decode
      const decodedPayload = ChatMessage.decode(messageToDecode)

      // TODO?: ignore community.channelMessages which are messageType !== COMMUNITY_CHAT
      const chatUuid = getChatUuid(decodedPayload.chatId)

      // map
      const chatMessage = mapChatMessage(decodedPayload, {
        messageId,
        chatUuid,
      })

      // handle
      community.chats.get(chatUuid)?.handleNewMessage(chatMessage)

      success = true

      break
    }

    case ApplicationMetadataMessage.Type.TYPE_EDIT_MESSAGE: {
      const decodedPayload = EditMessage.decode(messageToDecode)

      const messageId = decodedPayload.messageId
      const chatUuid = getChatUuid(decodedPayload.chatId)

      community.chats
        .get(chatUuid)
        ?.handleEditedMessage(messageId, decodedPayload.text)

      success = true

      break
    }

    case ApplicationMetadataMessage.Type.TYPE_DELETE_MESSAGE: {
      const decodedPayload = DeleteMessage.decode(messageToDecode)

      const messageId = decodedPayload.messageId
      const chatUuid = getChatUuid(decodedPayload.chatId)

      community.chats.get(chatUuid)?.handleDeletedMessage(messageId)

      success = true

      break
    }

    case ApplicationMetadataMessage.Type.TYPE_PIN_MESSAGE: {
      const decodedPayload = PinMessage.decode(messageToDecode)

      const messageId = decodedPayload.messageId
      const chatUuid = getChatUuid(decodedPayload.chatId)

      community.chats
        .get(chatUuid)
        ?.handlePinnedMessage(messageId, decodedPayload.pinned)

      success = true

      break
    }

    case ApplicationMetadataMessage.Type.TYPE_EMOJI_REACTION: {
      const decodedPayload = EmojiReaction.decode(messageToDecode)

      const messageId = decodedPayload.messageId
      const chatUuid = getChatUuid(decodedPayload.chatId)
      const isMe = account?.publicKey === `0x${bytesToHex(publicKey)}`

      community.chats
        .get(chatUuid)
        ?.handleEmojiReaction(messageId, decodedPayload, isMe)

      success = true

      break
    }

    default:
      success = true

      break
  }

  if (success) {
    client.wakuMessages.add(messageId)
  }

  return
}
