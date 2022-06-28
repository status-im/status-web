import { useEffect, useState } from 'react'

import { useProtocol } from './provider'

import type { Message } from '@status-im/js'

export type Reaction =
  | 'LOVE'
  | 'THUMBS_UP'
  | 'THUMBS_DOWN'
  | 'LAUGH'
  | 'SAD'
  | 'ANGRY'

export type Reactions = {
  [key in Reaction]: {
    count: number
    me: boolean
  }
}

export type { Message }

interface Result {
  data: Message[]
  loading: boolean
  error?: Error
  // fetchMore: () => void
}

export const useMessages = (channelId: string): Result => {
  const { client } = useProtocol()

  // const [state, dispatch] = useReducer<Result>((state,action) => {}, {})

  const [data, setData] = useState<any[]>(() =>
    client.community.chats.get(channelId).getMessages()
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    setData(client.community.chats.get(channelId).getMessages())

    const handleUpdate = (messages: Message[]) => {
      setLoading(false)
      setData(messages)
    }

    return client.community.chats.get(channelId).onMessage(handleUpdate)
  }, [channelId])

  return {
    data,
    loading,
    error,
    // hasMore
    // fetchMore,
    // refetch
  }
}
