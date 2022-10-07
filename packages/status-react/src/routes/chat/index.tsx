import React, { useEffect, useRef } from 'react'

import { useLocation, useMatch } from 'react-router-dom'

import { MemberSidebar } from '../../components/member-sidebar'
import { useAppState } from '../../contexts/app-context'
import { ChatProvider, useChatContext } from '../../contexts/chat-context'
import { useAccount, useChat, useMessages, useProtocol } from '../../protocol'
import { styled } from '../../styles/config'
import { Avatar, Flex, Heading, Text } from '../../system'
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
      <Avatar
        size={120}
        name={identity?.displayName}
        color={identity?.color}
        initialsLength={1}
      />
      <Heading>{identity?.displayName}</Heading>
      <Text>
        Welcome to the beginning of the #{identity?.displayName} channel!
      </Text>
    </Flex>
  )
}

const Body = () => {
  const { client } = useProtocol()
  const { state } = useChatContext()
  const { account } = useAccount()

  const { params } = useMatch(':id')! // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const chatId = params.id!

  const chat = client.community.getChat(chatId)!
  const messages = useMessages(chatId)

  const location = useLocation()
  const selectedMessageId = (
    location.state as { selectedMessageId: string } | undefined
  )?.selectedMessageId

  const contentRef = useRef<HTMLDivElement | null>(null)
  // todo: more scrolling conditions
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (selectedMessageId) {
      document.getElementById(selectedMessageId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      })
      // todo?: history.state clean-up

      return
    }

    contentRef.current!.scrollTop = contentRef.current!.scrollHeight ?? 0
  }, [chatId, messages.data.length, selectedMessageId])

  const handleMessageSubmit = (message: string) => {
    chat.sendTextMessage(message, state.reply?.message.messageId)
  }

  return (
    <>
      <ContentWrapper ref={contentRef}>
        <ChatStart chatId={chatId} />
        {messages.data.map(message => {
          return (
            <ChatMessage
              key={message.messageId}
              message={message}
              highlight={message.messageId === selectedMessageId}
            />
          )
        })}
      </ContentWrapper>
      {account && <ChatInput onSubmit={handleMessageSubmit} />}
    </>
  )
}

export const Chat = () => {
  const { state, options } = useAppState()

  const enableMembers = options.enableMembers ?? false // && (chat.type === 'group' || chat.type === 'channel')
  const showMembers = enableMembers && state.showMembers

  return (
    <ChatProvider>
      <Wrapper>
        <Main>
          <Navbar enableMembers={enableMembers} />
          <Body />
        </Main>
        {showMembers && <MemberSidebar />}
      </Wrapper>
    </ChatProvider>
  )
}

const Wrapper = styled('div', {
  // https://medium.com/the-crazy-coder/the-mystery-of-css-flex-layout-items-shrinking-8748145e96d9
  overflow: 'hidden',
  flex: 1,
  display: 'flex',
  alignItems: 'stretch',
  background: '$background',
})

const ContentWrapper = styled('div', {
  overflow: 'hidden',
  flex: 1,
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  overscrollBehavior: 'contain',

  // scrollSnapType: 'y proximity',

  // '& > div:last-child': {
  // scrollSnapAlign: 'end',
  // scrollMarginBlockEnd: '1px',
  // },
})

const Main = styled('div', {
  overflow: 'hidden',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
})
