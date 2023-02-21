import type { ChatMessage as ChatMessageProto } from '../../protos/chat-message_pb'
import type { Chat, ChatMessage } from '../chat'
import type { Community } from './community'

export function mapChatMessage(
  decodedMessage: ChatMessageProto,
  props: {
    messageId: string
    chatUuid: string
    signerPublicKey: string
    community: Community
    chat: Chat
  }
): ChatMessage {
  const { messageId, chatUuid, signerPublicKey, community, chat } = props

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
    member: community.getMember(signerPublicKey)!,
    // todo?: asign as .community, .community.description, .communityDescription, or .community.displayName
    communityDisplayName: community.description.identity!.displayName,
    chatDisplayName: chat.description.identity!.displayName,
  }

  return message
}
