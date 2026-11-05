const CHAT_ID_REGEX =
  /^(0x[0-9a-f]{66})([0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12})$/i

const MESSAGE_ID_REGEX = /^0x[0-9a-f]{64}$/i

/**
 * Parses `/m/<chatId>?message-id=<messageId>` links, where `chatId` is the
 * community ID (compressed public key) followed by the channel UUID.
 */
export function parseMessageLink(
  slug: string,
  messageId: string | string[] | undefined
) {
  const chatId = CHAT_ID_REGEX.exec(decodeURIComponent(slug))

  if (!chatId) {
    return null
  }

  return {
    communityPublicKey: chatId[1],
    channelUuid: chatId[2],
    messageId:
      typeof messageId === 'string' && MESSAGE_ID_REGEX.test(messageId)
        ? messageId
        : undefined,
  }
}
