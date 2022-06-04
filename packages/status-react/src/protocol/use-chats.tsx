import { useMemo } from 'react'
import { useClient } from './provider'
import { useCommunity } from '~/src/protocol/use-community'
import { Community } from '@status-im/js'

export type Channel = Community['communityMetadata']['chats'][0]

export const useChats = (): Channel => {
  const community = useCommunity()

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
