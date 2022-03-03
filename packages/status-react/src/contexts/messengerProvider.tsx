import React, { createContext, useContext } from 'react'

import { useMessenger } from '../hooks/messenger/useMessenger'
import { useIdentity, useNickname } from './identityProvider'

import type { MessengerType } from '../hooks/messenger/useMessenger'
import type { Environment } from '~/src/types/config'

const MessengerContext = createContext<MessengerType>({
  messenger: undefined,
  messages: [],
  sendMessage: async () => undefined,
  notifications: {},
  clearNotifications: () => undefined,
  mentions: {},
  clearMentions: () => undefined,
  loadPrevDay: async () => undefined,
  loadingMessages: false,
  loadingMessenger: true,
  communityData: undefined,
  contacts: {},
  contactsDispatch: () => undefined,
  addContact: () => undefined,
  activeChannel: undefined,
  channels: {},
  channelsDispatch: () => undefined,
  removeChannel: () => undefined,
  createGroupChat: () => undefined,
  changeGroupChatName: () => undefined,
  addMembers: () => undefined,
  nickname: undefined,
  subscriptionsDispatch: () => undefined,
})

export function useMessengerContext() {
  return useContext(MessengerContext)
}

interface Props {
  publicKey: string
  environment?: Environment
  children: React.ReactNode
}

export function MessengerProvider(props: Props) {
  const { publicKey, environment, children } = props

  const identity = useIdentity()
  const nickname = useNickname()
  const messenger = useMessenger(publicKey, environment, identity, nickname)

  return (
    <MessengerContext.Provider value={messenger}>
      {children}
    </MessengerContext.Provider>
  )
}
