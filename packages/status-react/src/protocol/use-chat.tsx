import { useMemo } from 'react'

import { useProtocol } from './use-protocol'

import type { Community } from '@status-im/js'

export type Chat = Community['description']['chats'][0]

export const useChat = (id: string): Chat => {
  const { community } = useProtocol()

  const chat = useMemo(() => {
    return Object.entries(community.chats).find(
      ([chatId]) => chatId === id
    )?.[1]
  }, [community, id])

  return chat!
}
