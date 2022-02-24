import React, { useEffect, useMemo, useRef, useState } from 'react'

import styled from 'styled-components'

import { useMessengerContext } from '../../contexts/messengerProvider'
import { useModal } from '../../contexts/modalProvider'
import { useNarrow } from '../../contexts/narrowProvider'
import { useChatScrollHandle } from '../../hooks/useChatScrollHandle'
import { EmptyChannel } from '../Channels/EmptyChannel'
import { LoadingIcon } from '../Icons/LoadingIcon'
import { LinkModal, LinkModalName } from '../Modals/LinkModal'
import { PictureModal, PictureModalName } from '../Modals/PictureModal'
import { UiMessage } from './UiMessage'

import type { Reply } from '../../hooks/useReply'
import type { ChannelData } from '../../models/ChannelData'

interface MessagesListProps {
  setReply: (val: Reply | undefined) => void
  channel: ChannelData
}

export function MessagesList({ setReply, channel }: MessagesListProps) {
  const narrow = useNarrow()
  const { messages, contacts } = useMessengerContext()
  const ref = useRef<HTMLHeadingElement>(null)
  const loadingMessages = useChatScrollHandle(messages, ref)

  const shownMessages = useMemo(
    () =>
      messages.filter(message => !contacts?.[message.sender]?.blocked ?? true),
    [contacts, messages]
  )

  const [image, setImage] = useState('')
  const [link, setLink] = useState('')

  const { setModal: setPictureModal, isVisible: showPictureModal } =
    useModal(PictureModalName)
  const { setModal: setLinkModal, isVisible: showLinkModal } =
    useModal(LinkModalName)

  useEffect(
    () => (!image ? undefined : setPictureModal(true)),
    [image, setPictureModal]
  )
  useEffect(
    () => (!link ? undefined : setLinkModal(true)),
    [link, setLinkModal]
  )

  useEffect(
    () => (!showPictureModal ? setImage('') : undefined),
    [showPictureModal]
  )
  useEffect(() => (!showLinkModal ? setLink('') : undefined), [showLinkModal])

  return (
    <MessagesWrapper ref={ref} className={`${!narrow && 'wide'}`}>
      <PictureModal image={image} />
      <LinkModal link={link} />
      <EmptyChannel channel={channel} />
      {loadingMessages && (
        <LoadingWrapper>
          <LoadingIcon className="message" />
        </LoadingWrapper>
      )}
      {shownMessages.map((message, idx) => (
        <UiMessage
          key={message.id}
          message={message}
          idx={idx}
          prevMessage={shownMessages[idx - 1]}
          setLink={setLink}
          setImage={setImage}
          setReply={setReply}
        />
      ))}
    </MessagesWrapper>
  )
}

const LoadingWrapper = styled.div`
  display: flex;
  align-self: center;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  position: relative;
`

const MessagesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 44px);
  overflow: auto;
  padding: 8px 0;

  &.wide {
    margin-top: -24px;
  }

  &::-webkit-scrollbar {
    width: 0;
  }
`
