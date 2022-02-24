import { Community } from '@status-im/core'

import type { ApplicationMetadataMessage, Messenger } from '@status-im/core'

export async function createCommunity(
  communityKey: string,
  addMessage: (msg: ApplicationMetadataMessage, id: string, date: Date) => void,
  messenger: Messenger
) {
  const community = await Community.instantiateCommunity(
    communityKey,
    messenger.waku
  )
  await Promise.all(
    Array.from(community.chats.values()).map(async chat => {
      await messenger.joinChat(chat)
      messenger.addObserver(
        (msg, date) => addMessage(msg, chat.id, date),
        chat.id
      )
    })
  )
  return community
}
