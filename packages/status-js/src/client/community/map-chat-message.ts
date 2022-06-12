import type { ChatMessage } from '../../../protos/chat-message'
import type { Message } from '../chat'

export function mapChatMessage(
  decodedMessage: ChatMessage,
  props: {
    messageId: string
    chatUuid: string
  }
): Message {
  const { messageId, chatUuid } = props

  const message = {
    ...decodedMessage,
    messageId,
    chatUuid,
    pinned: false,
    reactions: {
      THUMBS_UP: {
        count: 0,
        me: false,
      },
      THUMBS_DOWN: {
        count: 0,
        me: false,
      },
      LOVE: {
        count: 0,
        me: false,
      },
      LAUGH: {
        count: 0,
        me: false,
      },
      SAD: {
        count: 0,
        me: false,
      },
      ANGRY: {
        count: 0,
        me: false,
      },
    },
  }

  return message
}
