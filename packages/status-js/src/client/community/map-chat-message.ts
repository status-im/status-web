import type { ChatMessage } from '../chat'
import type { ChatMessage as ChatMessageProto } from '~/protos/chat-message'

export function mapChatMessage(
  decodedMessage: ChatMessageProto,
  props: {
    messageId: string
    chatUuid: string
  }
): ChatMessage {
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
