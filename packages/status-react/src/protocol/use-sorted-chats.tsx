import { useMemo } from 'react'

import { useProtocol } from './use-protocol'

import type { Community } from '@status-im/js'

export type Chat = Community['description']['chats'][0] & {
  id: string
}

export type Category = {
  id: string
  name: string
  position: number
  chats: Chat[]
}

type Result = {
  categories: Category[]
  chats: Chat[]
}

function sortByPosition<T extends { position: number }>(items: T[]): T[] {
  items.sort((a, b) => {
    if (a.position < b.position) {
      return -1
    }
    if (a.position > b.position) {
      return 1
    }
    return 0
  })

  return items
}

export const useSortedChats = (): Result => {
  const { community } = useProtocol()

  return useMemo<Result>(() => {
    const categoryChats: Record<string, Chat[]> = {}

    const chats = Object.entries(community.chats).reduce<Chat[]>(
      (acc, [chatId, chat]) => {
        const parsedChat: Chat = {
          id: chatId,
          ...chat,
        }

        if (chat.categoryId && community.categories[chat.categoryId]) {
          categoryChats[chat.categoryId] ??= []
          categoryChats[chat.categoryId].push(parsedChat)
        } else {
          acc.push(parsedChat)
        }

        return acc
      },
      []
    )

    const categories = Object.entries(categoryChats).map(([id, chats]) => {
      const { name, position } = community.categories[id]
      return {
        id,
        name,
        position,
        chats: sortByPosition(chats),
      }
    })

    return {
      categories: sortByPosition(categories),
      chats: sortByPosition(chats),
    }
  }, [community])
}
