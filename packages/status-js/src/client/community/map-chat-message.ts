import type { ChatMessage } from '../chat'
import type { ChatMessage as ChatMessageProto } from '~/protos/chat-message'

export function mapChatMessage(
  decodedMessage: ChatMessageProto,
  props: {
    messageId: string
    chatUuid: string
    publicKey: string
  }
): ChatMessage {
  const { messageId, chatUuid, publicKey } = props

  const message = {
    ...decodedMessage,
    messageId,
    chatUuid,
    pinned: false,
    signer: publicKey,
    reactions: {
      THUMBS_UP: new Set<string>(),
      THUMBS_DOWN: new Set<string>(),
      LOVE: new Set<string>(),
      LAUGH: new Set<string>(),
      SAD: new Set<string>(),
      ANGRY: new Set<string>(),
    },
  }

  return message
}
