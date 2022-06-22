import type { ChatMessage } from '../chat'
import type { ChatMessage as ChatMessageProto } from '~/protos/chat-message'

export function mapChatMessage(
  decodedMessage: ChatMessageProto,
  props: {
    messageId: string
    chatUuid: string
    signerPublicKey: string
  }
): ChatMessage {
  const { messageId, chatUuid, signerPublicKey } = props

  const message: ChatMessage = {
    ...decodedMessage,
    messageId,
    chatUuid,
    pinned: false,
    signer: signerPublicKey,
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
