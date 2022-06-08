// todo: merge with handle-channel-chat-message.ts
// todo?: rename to handle-message
import { bytesToHex } from 'ethereum-cryptography/utils'

import { recoverPublicKeyFromMetadata } from '~/src/utils/recover-public-key-from-metadata'

import { ApplicationMetadataMessage } from '../../../protos/application-metadata-message'
import {
  ChatMessage,
  DeleteMessage,
  EditMessage,
} from '../../../protos/chat-message'
import { EmojiReaction } from '../../../protos/emoji-reaction'
import { PinMessage } from '../../../protos/pin-message'
import { ProtocolMessage } from '../../../protos/protocol-message'
import { payloadToId } from '../../utils/payload-to-id'
import { getChannelId } from './get-channel-id'
import { getReactions } from './get-reactions'
import { mapChatMessage } from './map-chat-message'

import type { MessageType } from './community'
import type { WakuMessage } from 'js-waku'

export function handleChannelChatMessage(
  wakuMessage: WakuMessage,
  messages: Partial<{ [key: string]: MessageType[] }>,
  accountPublicKey?: string
): MessageType[] {
  let result: MessageType[] = []

  if (!wakuMessage.payload) {
    return result
  }

  // todo: explain
  if (!wakuMessage.signaturePublicKey) {
    return result
  }

  let messageToDecode = wakuMessage.payload
  let decodedProtocol

  try {
    decodedProtocol = ProtocolMessage.decode(wakuMessage.payload)
    if (decodedProtocol) {
      messageToDecode = decodedProtocol.publicMessage
    }
  } catch {}

  // fixme!: remove after replacing payloadToId
  if (!decodedProtocol) {
    return result
  }

  const decodedMetadata = ApplicationMetadataMessage.decode(messageToDecode)
  if (!decodedMetadata.payload) {
    return result
  }
  messageToDecode = decodedMetadata.payload

  // todo?:
  // if (!decodedMetadata.identity) {
  //   break
  // }

  const publicKey = recoverPublicKeyFromMetadata(decodedMetadata)

  // todo: merge and process other types of messages
  // TODO?: ignore messages which are messageType !== COMMUNITY_CHAT
  switch (decodedMetadata.type) {
    case ApplicationMetadataMessage.Type.TYPE_CHAT_MESSAGE: {
      const decodedPayload = ChatMessage.decode(messageToDecode)

      // fixme?: handle decodedProtocol.encryptedMessage
      const messageId = payloadToId(decodedProtocol.publicMessage, publicKey)
      const channelId = getChannelId(decodedPayload.chatId)

      const _messages = messages[channelId] || []

      const message = mapChatMessage(decodedPayload, { messageId, channelId })

      // findIndexLeft
      // const index = _messages.findIndex(({ timestamp }) => {
      //   new Date(Number(timestamp)) > new Date(Number(message.timestamp))
      // })
      // findIndexRight
      let messageIndex = _messages.length
      while (messageIndex > 0) {
        const _message = _messages[messageIndex - 1]

        // // already received
        // if (_message.messageId === messageId) {
        //   messageIndex = -1

        //   break
        // }

        if (
          new Date(Number(_message.timestamp)) <=
          new Date(Number(message.timestamp))
        ) {
          break
        }

        messageIndex--
      }

      // // already received
      // if (messageIndex < 0) {
      //   break
      // }

      // replied
      let responsedToMessageIndex = _messages.length
      while (--responsedToMessageIndex >= 0) {
        const _message = _messages[responsedToMessageIndex]

        if (_message.messageId === message.responseTo) {
          break
        }
      }

      if (responsedToMessageIndex >= 0) {
        message.responseToMessage = _messages[responsedToMessageIndex]
      }

      _messages.splice(messageIndex, 0, message)

      result = _messages

      break
    }
    case ApplicationMetadataMessage.Type.TYPE_EDIT_MESSAGE: {
      const decodedPayload = EditMessage.decode(messageToDecode)

      const messageId = decodedPayload.messageId
      const channelId = getChannelId(decodedPayload.chatId)

      const _messages = messages[channelId] || []

      // findIndexLeft
      // const index = _messages.findIndex(message => message.messageId === messageId)
      // findIndexRight
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

      result = _messages

      break
    }
    case ApplicationMetadataMessage.Type.TYPE_DELETE_MESSAGE: {
      const decodedPayload = DeleteMessage.decode(messageToDecode)

      const messageId = decodedPayload.messageId
      const channelId = getChannelId(decodedPayload.chatId)

      const _messages = messages[channelId] || []

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

      result = _messages

      break
    }
    case ApplicationMetadataMessage.Type.TYPE_PIN_MESSAGE: {
      const decodedPayload = PinMessage.decode(messageToDecode)

      const messageId = decodedPayload.messageId
      const channelId = getChannelId(decodedPayload.chatId)

      const _messages = messages[channelId] || []

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

      result = _messages

      break
    }
    case ApplicationMetadataMessage.Type.TYPE_EMOJI_REACTION: {
      const decodedPayload = EmojiReaction.decode(messageToDecode)

      const messageId = decodedPayload.messageId
      const channelId = getChannelId(decodedPayload.chatId)

      const _messages = messages[channelId] || []

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
        accountPublicKey === `0x${bytesToHex(wakuMessage.signaturePublicKey)}`

      // fixme!
      _messages[index].reactions = getReactions(
        decodedPayload,
        _message.reactions,
        isMe
      )

      result = _messages

      break
    }

    default:
      break
  }

  return result
}
