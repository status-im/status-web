// TODO: handle non-existing chat ID

import React, { useEffect, useRef } from 'react'

import { useMatch } from 'react-router-dom'

import { MemberSidebar } from '~/src/components/member-sidebar'
import { useAppState } from '~/src/contexts/app-context'
import { ChatProvider } from '~/src/contexts/chat-context'
import { useChat } from '~/src/protocol'
import { useProtocol } from '~/src/protocol/provider'
import { useMessages } from '~/src/protocol/use-messages'
import { styled } from '~/src/styles/config'
import { Avatar, Flex, Heading, Text } from '~/src/system'

import { ChatInput } from './components/chat-input'
import { ChatMessage } from './components/chat-message'
import { Navbar } from './components/navbar'

interface ChatStartProps {
  chatId: string
}

const ChatStart = (props: ChatStartProps) => {
  const { chatId } = props

  const { identity } = useChat(chatId)

  return (
    <Flex direction="column" gap="3" align="center" css={{ marginBottom: 50 }}>
      <Avatar size={120} name={identity?.displayName} color={identity?.color} />
      <Heading>{identity?.displayName}</Heading>
      <Text>
        Welcome to the beginning of the #{identity?.displayName} channel!
      </Text>
    </Flex>
  )
}

interface ContentProps {
  chatId: string
}

const Content = (props: ContentProps) => {
  const { chatId } = props

  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    contentRef.current!.scrollTop = contentRef.current!.scrollHeight ?? 0
  }, [chatId])

  const messages = useMessages(chatId)

  return (
    <ContentWrapper ref={contentRef}>
      {/* <Button onClick={messages.fetchMore}>Fetch more</Button> */}
      <ChatStart chatId={chatId} />
      {messages.data.map((message, index) => (
        <ChatMessage
          key={message.messageId}
          message={message}
          previousMessage={messages.data[index - 1]}
        />
      ))}
    </ContentWrapper>
  )
}

export const Chat = () => {
  const { client } = useProtocol()
  const { state, options } = useAppState()

  const { params } = useMatch(':id')! // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const chatId = params.id!

  const chat = useChat(chatId)

  // TODO: Update condition based on a chat type
  const enableMembers = options.enableMembers ?? false // && (chat.type === 'group' || chat.type === 'channel')
  const showMembers = enableMembers && state.showMembers

  const handleMessageSubmit = (message: string) => {
    client.community.chats.get(chatId).sendTextMessage(
      message
      // '0x0fa999097568d1fdcc39108a08d75340bd2cee5ec59c36799007150d0a9fc896'
    )
  }

  return (
    <ChatProvider>
      <Wrapper>
        <Main>
          <Navbar enableMembers={enableMembers} />
          <Content chatId={chatId} />
          <ChatInput onSubmit={handleMessageSubmit} />
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
  background: '$background',
  maxWidth: '100%',
  minWidth: 1,
})

const ContentWrapper = styled('div', {
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
  overscrollBehavior: 'contain',
  minWidth: 1,

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
  minWidth: 1,
})
