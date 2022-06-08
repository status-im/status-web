import { PageDirection } from 'js-waku'

import { handleChannelChatMessage } from './delete_handle-channel-chat-message'

import type { MessageType } from './community'
import type { Waku } from 'js-waku'

const CHUNK_SIZE = 50
const PAGE_SIZE = CHUNK_SIZE

export const fetchChannelChatMessages = async (
  waku: Waku,
  symKey: Uint8Array,
  contentTopic: string,
  storedMessages: MessageType[],
  options: { start: Date; end?: Date },
  callback: (messages: MessageType[]) => void
): Promise<MessageType[]> => {
  let result: MessageType[] = []

  const startTime = options.start
  let endTime = options.end || new Date()

  if (storedMessages.length) {
    const oldestMessageTime = new Date(Number(storedMessages[0].timestamp))

    if (oldestMessageTime <= options.start) {
      callback(storedMessages)

      return result
    }

    if (endTime >= oldestMessageTime) {
      endTime = oldestMessageTime
    }
  }

  const fetchedMessages = await fetchMessages(
    waku,
    symKey,
    contentTopic,
    storedMessages,
    { startTime, endTime },
    callback
  )

  if (!fetchedMessages.length) {
    return result
  }

  result = [...fetchedMessages, ...storedMessages]

  return result
}

export async function fetchMessages(
  waku: Waku,
  symKey: Uint8Array,
  contentTopic: string,
  storedMessages: MessageType[],
  options: {
    startTime: Date
    endTime: Date
  },
  callback: (messages: MessageType[]) => void
) {
  const remainingFetchedMessages: MessageType[] = []
  let fetchedMessages: MessageType[] = []

  await waku.store.queryHistory([contentTopic], {
    timeFilter: {
      startTime: options.startTime,
      endTime: options.endTime,
    },
    pageSize: PAGE_SIZE,
    // most recent page first
    pageDirection: PageDirection.BACKWARD,
    decryptionKeys: [symKey],
    callback: wakuMessages => {
      // most recent message first
      for (const wakuMessage of wakuMessages.reverse()) {
        const message = handleChannelChatMessage(wakuMessage)

        if (message) {
          remainingFetchedMessages.push(message)
        }
      }

      // todo?: remove chunking until PAGE_SIZE !== CHUNK_SIZE
      while (remainingFetchedMessages.length >= CHUNK_SIZE) {
        // reverse
        const _chunk = remainingFetchedMessages.splice(0, CHUNK_SIZE).reverse()
        const _messages = [..._chunk, ...fetchedMessages, ...storedMessages]

        callback(_messages)

        fetchedMessages = [..._chunk, ...fetchedMessages]
      }
    },
  })

  if (remainingFetchedMessages.length) {
    const _chunk = remainingFetchedMessages.splice(0)
    const _messages = [..._chunk, ...fetchedMessages, ...storedMessages]

    callback(_messages)

    fetchedMessages = [..._chunk, ...fetchedMessages]
  }

  return fetchedMessages
}
