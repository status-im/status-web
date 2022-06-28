import type { ChatMessage } from '../protos/chat-message'

// TODO?: maybe this should normalize the message?
export function validateMessage(message: ChatMessage): boolean {
  if (message.messageType !== 'COMMUNITY_CHAT') {
    return false
  }

  switch (message.contentType) {
    case 'TEXT_PLAIN': {
      return message.text !== ''
    }
    case 'IMAGE': {
      if (message.image.type === 'UNKNOWN_IMAGE_TYPE') {
        return false
      }

      return message.image.payload.length !== 0
    }
    case 'AUDIO': {
      if (message.audio.type === 'UNKNOWN_AUDIO_TYPE') {
        return false
      }
      return message.audio.payload.length !== 0
    }
  }

  return false
}
