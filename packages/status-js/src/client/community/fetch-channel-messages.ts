import { idToContentTopic } from '../../contentTopic'
import { createSymKeyFromPassword } from '../../encryption'
import { fetchMessages } from './fetch-messages'

import type { Community, MessageType } from '../../client'
import type { Waku } from 'js-waku'

export const fetchChannelMessages =
  (community: Community, queryHistory: Waku['store']['queryHistory']) =>
  async (
    channelId: string,
    callback: (messages: MessageType[]) => void,
    // { start, end = new Date() }: { start: Date; end?: Date }
    options: { start: Date; end?: Date }
  ) => {
    const id = `${community.communityPublicKey}${channelId}`

    const channelContentTopic = idToContentTopic(id)
    const symKey = await createSymKeyFromPassword(id)

    const startTime = options.start
    let endTime = options.end || new Date()

    const storedMessages = community.channelMessages[channelId] ?? []
    if (storedMessages.length) {
      const oldestMessageTime = new Date(Number(storedMessages[0].timestamp))

      if (oldestMessageTime <= options.start) {
        callback(storedMessages)

        return
      }

      if (endTime >= oldestMessageTime) {
        endTime = oldestMessageTime
      }
    }

    const messages = await fetchMessages(
      queryHistory,
      { startTime, endTime, symKey, channelContentTopic },
      storedMessages,
      callback
    )

    if (messages.length) {
      community.channelMessages[channelId] = [...messages, ...storedMessages]
    }

    return
  }
