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
