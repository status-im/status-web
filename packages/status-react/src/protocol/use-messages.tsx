import { useEffect, useState } from 'react'

import { useProtocol } from './use-protocol'

import type { Message, Reactions } from '@status-im/js'

type Reaction = keyof Reactions

interface Result {
  data: Message[]
  loading: boolean
  // error?: Error
  fetchMore: () => void
}

// type State = {}

// type Action = {}

// const reducer = (state: State, _action: Action): State => {
//   return state
// }

export const useMessages = (chatId: string): Result => {
  const { client } = useProtocol()

  const chat = client.community.chats.get(chatId)!
  // const [state, dispatch] = useReducer<Result>((state,action) => {}, {})

  const [data, setData] = useState<Message[]>(() => chat.getMessages())
  const [date, setDate] = useState<Date>(() => {
    const date = new Date()
    date.setDate(date.getDate() - 1)
    return date
  })

  const [loading, setLoading] = useState(true)
  // const [error, setError] = useState<Error>()

  const fetchMore = async () => {
    const newDate = new Date()
    newDate.setDate(date.getDate() - 1)
    setLoading(true)
    await chat.fetchMessages({ start: newDate })
    setLoading(false)
    setDate(newDate)
  }

  useEffect(() => {
    const messages = chat.getMessages()

    const handleUpdate = (messages: Message[]) => {
      setLoading(false)
      setData(messages)
    }

    handleUpdate(messages)

    chat.fetchMessages({ start: date })

    return chat.onMessage(handleUpdate)
  }, [chat])

  return {
    data,
    loading,
    // error,
    // hasMore
    fetchMore,
    // refetch
  }
}

export type { Message, Reaction, Reactions }
