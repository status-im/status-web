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
import { getChannelId } from './get-channel-id'
import { getReactions } from './get-reactions'
import { mapChatMessage } from './map-chat-message'

import type { Account } from '../../account'
import type { Client } from '../../client'
import type { Community /*, MessageType*/ } from './community'
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

  const wakuMessageId = payloadToId(
    decodedProtocol?.publicMessage || decodedMetadata.payload,
    publicKey
  )

  // already handled
  if (client.wakuMessages.has(wakuMessageId)) {
    return
  }

  let success = false

  // decode, map and handle (events)
  switch (decodedMetadata.type) {
    case ApplicationMetadataMessage.Type.TYPE_COMMUNITY_DESCRIPTION: {
      // decode
      const decodedPayload = CommunityDescription.decode(messageToDecode)

      // handle (state and callback)
      community.handleCommunityMetadataEvent(decodedPayload)

      success = true

      break
    }

    case ApplicationMetadataMessage.Type.TYPE_CHAT_MESSAGE: {
      // decode
      const decodedPayload = ChatMessage.decode(messageToDecode)

      // TODO?: ignore community.channelMessages which are messageType !== COMMUNITY_CHAT

      // map
      const channelId = getChannelId(decodedPayload.chatId)

      const chatMessage = mapChatMessage(decodedPayload, {
        messageId: wakuMessageId,
        channelId,
      })

      // handle
      community.handleChannelChatMessageNewEvent(chatMessage)

      success = true

      break
    }

    case ApplicationMetadataMessage.Type.TYPE_EDIT_MESSAGE: {
      const decodedPayload = EditMessage.decode(messageToDecode)

      const messageId = decodedPayload.messageId
      const channelId = getChannelId(decodedPayload.chatId)

      const _messages = community.channelMessages[channelId] || []

      let index = _messages.length
      while (--index >= 0) {
        const _message = _messages[index]

        if (_message.messageId === messageId) {
          break
        }
      }

      // original not found
      if (index < 0) {
        break
      }

      const _message = _messages[index]

      const message = {
        ..._message,
        text: decodedPayload.text,
      }

      _messages[index] = message

      // state
      community.channelMessages[channelId] = _messages

      // callback
      community.channelMessagesCallbacks[channelId]?.(
        community.channelMessages[channelId]!
      )

      success = true

      break
    }

    case ApplicationMetadataMessage.Type.TYPE_DELETE_MESSAGE: {
      const decodedPayload = DeleteMessage.decode(messageToDecode)

      const messageId = decodedPayload.messageId
      const channelId = getChannelId(decodedPayload.chatId)

      const _messages = community.channelMessages[channelId] || []

      let index = _messages.length
      while (--index >= 0) {
        const _message = _messages[index]

        if (_message.messageId === messageId) {
          break
        }
      }

      // original not found
      if (index < 0) {
        break
      }

      _messages.splice(index, 1)

      // state
      community.channelMessages[channelId] = _messages

      // callback
      community.channelMessagesCallbacks[channelId]?.(
        community.channelMessages[channelId]!
      )

      success = true

      break
    }

    case ApplicationMetadataMessage.Type.TYPE_PIN_MESSAGE: {
      const decodedPayload = PinMessage.decode(messageToDecode)

      const messageId = decodedPayload.messageId
      const channelId = getChannelId(decodedPayload.chatId)

      const _messages = community.channelMessages[channelId] || []

      let index = _messages.length
      while (--index >= 0) {
        const _message = _messages[index]

        if (_message.messageId === messageId) {
          break
        }
      }

      // original not found
      if (index < 0) {
        break
      }

      _messages[index].pinned = Boolean(decodedPayload.pinned)

      // state
      community.channelMessages[channelId] = _messages

      // callback
      community.channelMessagesCallbacks[channelId]?.(
        community.channelMessages[channelId]!
      )

      success = true

      break
    }

    case ApplicationMetadataMessage.Type.TYPE_EMOJI_REACTION: {
      const decodedPayload = EmojiReaction.decode(messageToDecode)

      const messageId = decodedPayload.messageId
      const channelId = getChannelId(decodedPayload.chatId)

      const _messages = community.channelMessages[channelId] || []

      let index = _messages.length
      while (--index >= 0) {
        const _message = _messages[index]

        if (_message.messageId === messageId) {
          break
        }
      }

      // original not found
      if (index < 0) {
        break
      }

      const _message = _messages[index]
      const isMe =
        account?.publicKey === `0x${bytesToHex(wakuMessage.signaturePublicKey)}`

      _messages[index].reactions = getReactions(
        decodedPayload,
        _message.reactions,
        isMe
      )

      // state
      community.channelMessages[channelId] = _messages

      // callback
      community.channelMessagesCallbacks[channelId]?.(
        community.channelMessages[channelId]!
      )

      success = true

      break
    }

    default:
      break
  }

  if (success) {
    client.wakuMessages.add(wakuMessageId)
  }

  return
}
