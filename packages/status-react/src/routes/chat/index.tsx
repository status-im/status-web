import React from 'react'

import { MemberSidebar } from '~/src/components/member-sidebar'
import { useAppState } from '~/src/contexts/app-context'
import { ChatProvider } from '~/src/contexts/chat-context'
import { styled } from '~/src/styles/config'
import { Avatar } from '~/src/system/avatar'
import { Flex } from '~/src/system/flex'
import { Heading } from '~/src/system/heading'
import { Text } from '~/src/system/text'

import { ChatInput } from './chat-input'
import { ChatMessage } from './chat-message'
import { Navbar } from './navbar'

const EmptyChat = () => {
  return (
    <Flex direction="column" gap="3" align="center" css={{ marginBottom: 50 }}>
      <Avatar size={120} />
      <Heading>general</Heading>
      <Text>Welcome to the beginning of the #general channel!</Text>
    </Flex>
  )
}

const Content = () => {
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <EmptyChat />
      <ChatMessage reply="text" />
      <ChatMessage />
      <ChatMessage reply="image" />
      <ChatMessage image />
      <ChatMessage reply="image-text" />
      <ChatMessage />
      <ChatMessage />
      <ChatMessage mention />
      <ChatMessage />
      <ChatMessage />
      <ChatMessage />
      <ChatMessage />
    </div>
  )
}

export const Chat = () => {
  const { state } = useAppState()

  // TODO: Update condition based on a chat type
  const enableMembers = true
  const showMembers = enableMembers && state.showMembers

  return (
    <ChatProvider>
      <Wrapper>
        <Main>
          <Navbar enableMembers={enableMembers} />
          <Content />
          <ChatInput />
        </Main>
        {showMembers && <MemberSidebar />}
      </Wrapper>
    </ChatProvider>
  )
}

const Wrapper = styled('div', {
  flex: 1,
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'stretch',
  background: '#fff',
})

const Main = styled('div', {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
})
