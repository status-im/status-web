import { useMemo } from 'react'

import { useProtocol } from './provider'

import type { Community } from '@status-im/js'

export type Chat = Community['description']['chats'][0] & {
  id: string
}

export const useChats = (): Chat[] => {
  const { community } = useProtocol()

  return useMemo(() => {
    return Object.entries(community.chats)
      .map(([chatId, chat]) => ({ id: chatId, ...chat }))
      .sort((a, b) => {
        if (a.position < b.position) {
          return -1
        }
        if (a.position > b.position) {
          return 1
        }
        return 0
      })
  }, [community])
}
