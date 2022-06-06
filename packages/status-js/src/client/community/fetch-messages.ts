import { PageDirection } from 'js-waku'

import { handleMessage } from './handle-message'

import type { MessageType } from '../../client'
import type { Waku } from 'js-waku'

const CHUNK_SIZE = 2
const PAGE_SIZE = 100

export async function fetchMessages(
  queryHistory: Waku['store']['queryHistory'],
  options: {
    symKey: Uint8Array
    channelContentTopic: string
    startTime: Date
    endTime: Date
  },
  storedMessages: MessageType[],
  callback: (messages: MessageType[]) => void
) {
  const remainingFetchedMessages: MessageType[] = []
  let fetchedMessages: MessageType[] = []

  await queryHistory([options.channelContentTopic], {
    timeFilter: {
      startTime: options.startTime,
      endTime: options.endTime,
    },
    pageSize: PAGE_SIZE,
    // most recent page first
    pageDirection: PageDirection.BACKWARD,
    decryptionKeys: [options.symKey],
    callback: wakuMessages => {
      // most recent message first
      for (const wakuMessage of wakuMessages.reverse()) {
        const message = handleMessage(wakuMessage)

        if (message) {
          remainingFetchedMessages.push(message)
        }
      }

      while (remainingFetchedMessages.length > CHUNK_SIZE) {
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
