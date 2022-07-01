import { useEffect, useState } from 'react'

import { useProtocol } from './provider'

import type { Message, Reactions } from '@status-im/js'

type Reaction = keyof Reactions

interface Result {
  data: Message[]
  loading: boolean
  // error?: Error
  // fetchMore: () => void
}

export const useMessages = (channelId: string): Result => {
  const { client } = useProtocol()

  const chat = client.community.chats.get(channelId)!
  // const [state, dispatch] = useReducer<Result>((state,action) => {}, {})

  const [data, setData] = useState<Message[]>(() => chat.getMessages())
  const [loading, setLoading] = useState(true)
  // const [error, setError] = useState<Error>()

  useEffect(() => {
    setData(chat.getMessages())

    const handleUpdate = (messages: Message[]) => {
      setLoading(false)
      setData(messages)
    }

    return chat.onMessage(handleUpdate)
  }, [chat])

  return {
    data,
    loading,
    // error,
    // hasMore
    // fetchMore,
    // refetch
  }
}

export type { Message, Reaction, Reactions }
