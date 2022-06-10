// todo: move file
// fixme: relative paths

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

// todo?: return decoded, possibly mapped, event but do not update state and call callback
// todo?: return void
// todo?: return success (e.g. if this handler should be used in Community's init)
// fixme:
/**
 * Argument of type '(wakuMessage: WakuMessage, community: Community) => boolean'
 * is not assignable to parameter of type '(message: WakuMessage) => void'.ts(2345)
 */
// type HandlerResult = boolean
// type HandlerResult = CommunityDescription | MessageType | undefined

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

  // todo: explain
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

  // fixme?: handle decodedProtocol.encryptedMessage
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

      // todo?: don't use class method
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
      // todo?: use full chatId (incl. pub key) instead
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

      // todo?: move to class method (e.g. handleChannelChatMessageEditEvent)
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

      // todo?: use mapChatMessage
      const message = {
        ..._message,
        // fixme?: other fields that user can edit
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

      // todo?: use delete; set to null
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
      // todo!: review use of !
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

      // fixme!
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
