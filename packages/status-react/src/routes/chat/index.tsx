import React, { useEffect, useRef } from 'react'

import { useMatch } from 'react-router-dom'

import { MemberSidebar } from '~/src/components/member-sidebar'
import { useAppState } from '~/src/contexts/app-context'
import { ChatProvider } from '~/src/contexts/chat-context'
import { useChat } from '~/src/protocol/use-chat'
import { useMessages } from '~/src/protocol/use-messages'
import { styled } from '~/src/styles/config'
import { Avatar, Flex, Heading, Text } from '~/src/system'

import { ChatInput } from './components/chat-input'
import { ChatMessage } from './components/chat-message'
import { Navbar } from './components/navbar'

const ChatStart = () => {
  // TODO: unify this with the useChat hook
  const { params } = useMatch(':id')! // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const chat = useChat(params.id!)

  return (
    <Flex direction="column" gap="3" align="center" css={{ marginBottom: 50 }}>
      <Avatar size={120} src={chat.imageUrl} />
      <Heading>general</Heading>
      <Text>Welcome to the beginning of the #general channel!</Text>
    </Flex>
  )
}

const Content = () => {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    contentRef.current!.scrollTop = contentRef.current!.scrollHeight ?? 0
  }, [])

  const messages = useMessages()

  return (
    <ContentWrapper ref={contentRef}>
      <ChatStart />
      {messages.map(message => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </ContentWrapper>
  )
}

export const Chat = () => {
  const { state, options } = useAppState()

  // TODO: Update condition based on a chat type
  const enableMembers = options.enableMembers // && (chat.type === 'group' || chat.type === 'channel')
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

const ContentWrapper = styled('div', {
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
  overscrollBehavior: 'contain',
  // scrollSnapType: 'y proximity',

  // '& > div:last-child': {
  // scrollSnapAlign: 'end',
  // scrollMarginBlockEnd: '1px',
  // },
})

const Main = styled('div', {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
})
