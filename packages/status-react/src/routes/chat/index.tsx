import React, { Fragment, useEffect, useRef } from 'react'

import isSameDay from 'date-fns/isSameDay'
import { useMatch } from 'react-router-dom'

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
      <Avatar size={120} name={identity?.displayName} color={identity?.color} />
      <Heading>{identity?.displayName}</Heading>
      <Text>
        Welcome to the beginning of the #{identity?.displayName} channel!
      </Text>
    </Flex>
  )
}

const DateDivider = (props: { date: Date }) => {
  const { date } = props

  let label = date.toLocaleDateString([], { weekday: 'long' })

  const today = new Date()
  const yesterday = new Date().setDate(today.getDate() - 1)

  if (isSameDay(date, today)) {
    label = 'Today'
  } else if (isSameDay(date, yesterday)) {
    label = 'Yesterday'
  }

  return (
    <Flex justify="center" css={{ padding: '18px 0 8px' }}>
      <Text size="13" color="gray">
        {label}
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

  const contentRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    contentRef.current!.scrollTop = contentRef.current!.scrollHeight ?? 0
  }, [chatId, messages.data.length])

  const handleMessageSubmit = (message: string) => {
    chat.sendTextMessage(message, state.reply?.message.messageId)
  }

  return (
    <>
      <ContentWrapper ref={contentRef}>
        <ChatStart chatId={chatId} />
        {/* temporary */}
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            onClick={messages.fetchMore}
            disabled={messages.loading}
          >
            {messages.loading ? 'Loading...' : 'Load more'}
          </button>
        </div>
      </ContentWrapper>
      {messages.data.map((message, index) => {
        const sentDate = new Date(Number(message.clock))
        const prevMessage = messages.data[index - 1]

        let showDate = index === 0 // always show date for the first message

        if (prevMessage) {
          const prevSentDate = new Date(Number(prevMessage.clock))
          showDate = !isSameDay(prevSentDate, sentDate) // show date if it's not the same day
        }

        return (
          <Fragment key={message.messageId}>
            {showDate && <DateDivider date={sentDate} />}
            <ChatMessage
              message={message}
              prevSigner={showDate ? undefined : prevMessage?.signer}
            />
          </Fragment>
        )
      })}
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
  paddingBottom: 16,
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
