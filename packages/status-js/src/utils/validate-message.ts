import {
  AudioMessage_AudioType,
  ChatMessage_ContentType,
} from '../protos/chat-message_pb'
import { ImageType, MessageType } from '../protos/enums_pb'

import type {
  AudioMessage,
  ChatMessage,
  ImageMessage,
} from '../protos/chat-message_pb'

// TODO?: maybe this should normalize the message?
export function validateMessage(message: ChatMessage): boolean {
  if (message.messageType !== MessageType.COMMUNITY_CHAT) {
    return false
  }

  switch (message.contentType) {
    case ChatMessage_ContentType.TEXT_PLAIN: {
      return message.text !== ''
    }
    case ChatMessage_ContentType.IMAGE: {
      // fixme?
      const payload = message.payload.value as ImageMessage

      if (payload.type === ImageType.UNKNOWN_IMAGE_TYPE) {
        return false
      }

      return payload.payload.length !== 0
    }
    case ChatMessage_ContentType.AUDIO: {
      const payload = message.payload.value as AudioMessage

      if (payload.type === AudioMessage_AudioType.UNKNOWN_AUDIO_TYPE) {
        return false
      }
      return payload.payload.length !== 0
    }
  }

  return false
}
