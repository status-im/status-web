import { useCallback, useMemo } from 'react'

import { GroupChats } from '@status-im/core'

import { ChatMessage } from '../../models/ChatMessage'
import { uintToImgUrl } from '../../utils'

import type { ChannelData } from '../../models/ChannelData'
import type { Contact } from '../../models/Contact'
import type { ChannelAction } from './useChannelsReducer'
import type {
  ChatMessage as StatusChatMessage,
  Contacts as ContactsClass,
  GroupChat,
  Identity,
  Messenger,
} from '@status-im/core'

const contactFromId = (member: string): Contact => {
  return {
    blocked: false,
    id: member,
    isUntrustworthy: false,
    online: false,
    trueName: member,
  }
}

export function useGroupChats(
  messenger: Messenger | undefined,
  identity: Identity | undefined,
  dispatch: (action: ChannelAction) => void,
  addChatMessage: (newMessage: ChatMessage | undefined, id: string) => void,
  contactsClass: ContactsClass | undefined
) {
  const groupChat = useMemo(() => {
    if (messenger && identity && contactsClass) {
      const addChat = (chat: GroupChat) => {
        const members = chat.members.map(member => member.id).map(contactFromId)
        const channel: ChannelData =
          chat.members.length > 2
            ? {
                id: chat.chatId,
                name: chat.name ?? chat.chatId.slice(0, 10),
                type: 'group',
                description: `${chat.members.length} members`,
                members,
              }
            : {
                id: chat.chatId,
                name: chat.members[0].id,
                type: 'dm',
                description: `Chatkey: ${chat.members[0].id}`,
                members,
              }
        chat.members.forEach(member => contactsClass.addContact(member.id))
        dispatch({ type: 'AddChannel', payload: channel })
      }
      const removeChat = (chat: GroupChat) => {
        dispatch({ type: 'RemoveChannel', payload: chat.chatId })
      }
      const handleMessage = (msg: StatusChatMessage, sender: string) => {
        let image: string | undefined = undefined
        if (msg.image) {
          image = uintToImgUrl(msg.image.payload)
        }
        addChatMessage(
          new ChatMessage(
            msg.text ?? '',
            new Date(msg.clock ?? 0),
            sender,
            image,
            msg.responseTo
          ),
          msg.chatId
        )
      }
      return new GroupChats(
        identity,
        messenger.waku,
        addChat,
        removeChat,
        handleMessage
      )
    }
  }, [messenger, identity, contactsClass, addChatMessage, dispatch])

  const createGroupChat = useCallback(
    (members: string[]) => {
      if (groupChat) {
        groupChat.createGroupChat(members)
      }
    },
    [groupChat]
  )

  const changeGroupChatName = useCallback(
    (name: string, chatId: string) => {
      if (groupChat) {
        groupChat.changeChatName(chatId, name)
      }
    },
    [groupChat]
  )

  const removeChannel = useCallback(
    (channelId: string) => {
      if (groupChat) {
        groupChat.quitChat(channelId)
      }
    },
    [groupChat]
  )

  const addMembers = useCallback(
    (members: string[], chatId: string) => {
      if (groupChat) {
        groupChat.addMembers(chatId, members)
      }
    },
    [groupChat]
  )

  return {
    createGroupChat,
    removeChannel,
    groupChat,
    changeGroupChatName,
    addMembers,
  }
}
