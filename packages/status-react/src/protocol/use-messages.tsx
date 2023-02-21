import { useEffect, useState } from 'react'

import { MessageContentType } from '@status-im/js'
import sub from 'date-fns/sub'

import { useProtocol } from './use-protocol'

import type { Message, Reaction, Reactions } from '@status-im/js'

interface Result {
  data: Message[]
  loading: boolean
}

export const useMessages = (chatId: string): Result => {
  const { client } = useProtocol()

  const chat = client.community.chats.get(chatId)!

  const [data, setData] = useState<Message[]>(() => chat.getMessages())
  const [loading, setLoading] = useState(true)
  // const [error, setError] = useState<Error>()

  useEffect(() => {
    const messages = chat.getMessages()

    setData(chat.getMessages())

    const handleUpdate = (messages: Message[]) => {
      setLoading(false)
      setData(messages)
    }

    if (messages.length === 0) {
      setLoading(true)
      chat.fetchMessages({ start: sub(new Date(), { days: 30 }) })
    }

    return chat.onMessage(handleUpdate)
  }, [chat])

  return {
    data,
    loading,
    // fetchMore,
    // fetching,
    // error,
    // hasMore
    // refetch
  }
}

export type { Message, Reaction, Reactions }
export { MessageContentType }
