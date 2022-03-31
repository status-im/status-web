import React, { useMemo, useRef, useState } from 'react'

import styled from 'styled-components'

import { useIdentity } from '../../contexts/identityProvider'
import { useMessengerContext } from '../../contexts/messengerProvider'
import { useClickOutside } from '../../hooks/useClickOutside'
import { equalDate } from '../../utils'
import { ChatMessageContent } from '../Chat-legacy/ChatMessageContent'
import { ContactMenu } from '../Form/ContactMenu'
import { MessageMenu } from '../Form/MessageMenu'
import { UntrustworthIcon } from '../Icons/UntrustworthIcon'
import { UserLogo } from '../Members/UserLogo'
import { Reactions } from '../Reactions/Reactions'
import { MessageQuote } from './MessageQuote'
import { MessageReactions } from './MessageReactions'
import {
  ContentWrapper,
  DateSeparator,
  IconBtn,
  MessageHeaderWrapper,
  MessageOuterWrapper,
  MessageText,
  MessageWrapper,
  TimeWrapper,
  UserAddress,
  UserName,
  UserNameBtn,
  UserNameWrapper,
} from './Styles'

import type { Reply } from '../../hooks/useReply'
import type { ChatMessage } from '../../models/ChatMessage'
import type { BaseEmoji } from 'emoji-mart'

type UiMessageProps = {
  idx: number
  message: ChatMessage
  prevMessage: ChatMessage
  setImage: (img: string) => void
  setLink: (link: string) => void
  setReply: (val: Reply | undefined) => void
}

export function UiMessage({
  message,
  idx,
  prevMessage,
  setImage,
  setLink,
  setReply,
}: UiMessageProps) {
  const today = new Date()
  const { contacts } = useMessengerContext()
  const identity = useIdentity()

  const contact = useMemo(
    () => contacts[message.sender],
    [message.sender, contacts]
  )
  const [showMenu, setShowMenu] = useState(false)

  const [mentioned, setMentioned] = useState(false)
  const [messageReactions, setMessageReactions] = useState<BaseEmoji[]>([])

  const ref = useRef(null)
  useClickOutside(ref, () => setShowMenu(false))

  const messageRef = useRef(null)

  return (
    <MessageOuterWrapper>
      {(idx === 0 || !equalDate(prevMessage.date, message.date)) && (
        <DateSeparator>
          {equalDate(message.date, today)
            ? 'Today'
            : message.date.toLocaleDateString()}
        </DateSeparator>
      )}
      <MessageWrapper className={`${mentioned && 'mention'}`} id={message.id}>
        <MessageQuote quote={message.quote} />
        <UserMessageWrapper ref={messageRef}>
          <IconBtn
            onClick={() => {
              if (identity) setShowMenu(e => !e)
            }}
            disabled={!identity}
            ref={ref}
          >
            {showMenu && (
              <ContactMenu id={message.sender} setShowMenu={setShowMenu} />
            )}
            <UserLogo
              contact={contact}
              radius={40}
              colorWheel={[
                ['red', 150],
                ['blue', 250],
                ['green', 360],
              ]}
            />
          </IconBtn>
          <ContentWrapper>
            <MessageHeaderWrapper>
              <UserNameWrapper>
                <UserNameBtn
                  onClick={() => {
                    if (identity) setShowMenu(e => !e)
                  }}
                  disabled={!identity}
                >
                  <UserName>
                    {' '}
                    {contact?.customName ?? contact.trueName}
                  </UserName>
                </UserNameBtn>
                <UserAddress className="chat">
                  {message.sender.slice(0, 5)}...{message.sender.slice(-3)}
                </UserAddress>
                {contact.isUntrustworthy && <UntrustworthIcon />}
              </UserNameWrapper>
              <TimeWrapper>{message.date.toLocaleString()}</TimeWrapper>
            </MessageHeaderWrapper>
            <MessageText>
              <ChatMessageContent
                message={message}
                setImage={setImage}
                setLinkOpen={setLink}
                setMentioned={setMentioned}
              />
            </MessageText>
            {messageReactions.length > 0 && (
              <MessageReactions
                messageReactions={messageReactions}
                setMessageReactions={setMessageReactions}
              />
            )}
          </ContentWrapper>
          <MessageMenu
            message={message}
            setReply={setReply}
            messageReactions={messageReactions}
            setMessageReactions={setMessageReactions}
            messageRef={messageRef}
          />
        </UserMessageWrapper>
        {identity && (
          <Reactions
            message={message}
            setReply={setReply}
            messageReactions={messageReactions}
            setMessageReactions={setMessageReactions}
          />
        )}
      </MessageWrapper>
    </MessageOuterWrapper>
  )
}

const UserMessageWrapper = styled.div`
  width: 100%;
  display: flex;
  position: relative;
`
