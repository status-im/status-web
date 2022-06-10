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

interface BaseMessage {
  id: string
  type: 'text' | 'image' | 'image-text'
  contact: {
    name: string
    imageUrl?: string
  }
  owner: boolean
  pinned: boolean
  mention: boolean
  reply?: TextReply | ImageReply | ImageTextReply
  reactions: Reactions
}

interface TextMessage extends BaseMessage {
  type: 'text'
  text: string
}

interface ImageMessage extends BaseMessage {
  type: 'image'
  imageUrl: string
}
interface ImageTextMessage extends BaseMessage {
  type: 'image-text'
  text: string
  imageUrl: string
}

// export type Message = TextMessage | ImageMessage | ImageTextMessage

interface BaseReply {
  type: Message['type']
  contact: {
    name: string
    imageUrl?: string
  }
}

interface TextReply extends BaseReply {
  type: 'text'
  text: string
}

interface ImageReply extends BaseReply {
  type: 'image'
  imageUrl: string
}

interface ImageTextReply extends BaseReply {
  type: 'image-text'
  text: string
  imageUrl: string
}

export type Reply = TextReply | ImageReply | ImageTextReply

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
    client.community.getMessages(channelId)
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()

  useEffect(() => {
    setData(client.community.getMessages(channelId))

    const handleUpdate = (messages: Message[]) => {
      setLoading(false)
      setData(messages)
    }

    return client.community.onChannelMessageUpdate(channelId, handleUpdate)
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
