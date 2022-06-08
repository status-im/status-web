import type { ChatMessage } from '../../../protos/chat-message'
import type { MessageType } from './community'
// import type { Reactions } from './set-reactions'

export function mapChatMessage(
  decodedMessage: ChatMessage,
  props: {
    messageId: string
    channelId: string
    // pinned: boolean
    // reactions: Reactions
  }
): MessageType {
  const { messageId, channelId } = props

  const message = {
    ...decodedMessage,
    messageId,
    channelId,
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
