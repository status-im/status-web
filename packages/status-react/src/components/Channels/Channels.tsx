import React, { useMemo } from 'react'
import styled from 'styled-components'

import { ChatState, useChatState } from '../../contexts/chatStateProvider'
import { useIdentity } from '../../contexts/identityProvider'
import { useMessengerContext } from '../../contexts/messengerProvider'
import { CreateIcon } from '../Icons/CreateIcon'
import { UserCreation } from '../UserCreation/UserCreation'

import { Channel } from './Channel'

interface ChannelsProps {
  onCommunityClick?: () => void
  setEditGroup?: React.Dispatch<React.SetStateAction<boolean>>
}

type GenerateChannelsProps = ChannelsProps & {
  type: string
}

function GenerateChannels({
  type,
  onCommunityClick,
  setEditGroup,
}: GenerateChannelsProps) {
  const { mentions, notifications, activeChannel, channelsDispatch, channels } =
    useMessengerContext()

  const channelList = useMemo(() => Object.values(channels), [channels])

  const setChatState = useChatState()[1]
  return (
    <>
      {channelList
        .filter(channel => channel.type === type)
        .map(channel => (
          <Channel
            key={channel.id}
            channel={channel}
            isActive={channel.id === activeChannel?.id}
            notified={notifications?.[channel.id] > 0}
            mention={mentions?.[channel.id]}
            onClick={() => {
              channelsDispatch({ type: 'ChangeActive', payload: channel.id })
              if (onCommunityClick) {
                onCommunityClick()
              }
              setChatState(ChatState.ChatBody)
            }}
            setEditGroup={setEditGroup}
          />
        ))}
    </>
  )
}

type ChatsListProps = {
  onCommunityClick?: () => void
  setEditGroup?: React.Dispatch<React.SetStateAction<boolean>>
}

function ChatsSideBar({ onCommunityClick, setEditGroup }: ChatsListProps) {
  const setChatState = useChatState()[1]
  return (
    <>
      <ChatsBar>
        <Heading>Messages</Heading>
        <EditBtn onClick={() => setChatState(ChatState.ChatCreation)}>
          <CreateIcon />
        </EditBtn>
      </ChatsBar>
      <ChatsList>
        <GenerateChannels
          type={'group'}
          onCommunityClick={onCommunityClick}
          setEditGroup={setEditGroup}
        />
        <GenerateChannels type={'dm'} onCommunityClick={onCommunityClick} />
      </ChatsList>
    </>
  )
}

export function Channels({ onCommunityClick, setEditGroup }: ChannelsProps) {
  const identity = useIdentity()
  return (
    <ChannelList>
      <GenerateChannels type={'channel'} onCommunityClick={onCommunityClick} />
      <Chats>
        {identity ? (
          <ChatsSideBar
            onCommunityClick={onCommunityClick}
            setEditGroup={setEditGroup}
          />
        ) : (
          <UserCreation permission={true} />
        )}
      </Chats>
    </ChannelList>
  )
}

export const ChannelList = styled.div`
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 0;
  }
`

const Chats = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  margin-top: 16px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 24px);
    height: 1px;
    background-color: ${({ theme }) => theme.primary};
    opacity: 0.1;
  }
`

const ChatsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`

const ChatsList = styled.div`
  display: flex;
  flex-direction: column;
`

const Heading = styled.p`
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
  color: ${({ theme }) => theme.primary};
`

const EditBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  padding: 0;

  &:hover {
    background: ${({ theme }) => theme.inputColor};
  }

  &:active {
    background: ${({ theme }) => theme.sectionBackgroundColor};
  }
`
