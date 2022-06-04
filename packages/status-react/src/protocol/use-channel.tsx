import { useMemo } from 'react'
import { useClient } from './provider'
import { useCommunity } from '~/src/protocol/use-community'
import { Community } from '@status-im/js'

export type Channel = Community['communityMetadata']['chats'][0]

export const useChannel = (id: string): Channel => {
  const client = useClient()

  const community = useCommunity()




  const chat = useMemo(() => {
    return Object.entries(community.chats).find(
      ([chatId]) => chatId === id
    )?.[1]
  }, [community, id])

  return chat!
}
