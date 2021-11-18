import React, { useEffect } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { CreateIcon } from "../Icons/CreateIcon";

import { Channel } from "./Channel";

interface ChannelsProps {
  setCreateChat: (val: boolean) => void;
  onCommunityClick?: () => void;
}

type GenerateChannelsProps = ChannelsProps & {
  type: string;
};

function GenerateChannels({
  type,
  onCommunityClick,
  setCreateChat,
}: GenerateChannelsProps) {
  const { mentions, notifications, activeChannel, setActiveChannel, channels } =
    useMessengerContext();
  return (
    <>
      {Object.values(channels)
        .filter((channel) => channel.type === type)
        .map((channel) => (
          <Channel
            key={channel.id}
            channel={channel}
            isActive={channel.id === activeChannel.id}
            isMuted={channel.isMuted || false}
            notification={
              notifications[channel.id] > 0 && !channel.isMuted
                ? notifications[channel.id]
                : undefined
            }
            mention={
              mentions[channel.id] > 0 && !channel.isMuted
                ? mentions[channel.id]
                : undefined
            }
            onClick={() => {
              setActiveChannel(channel);
              if (onCommunityClick) {
                onCommunityClick();
              }
              setCreateChat(false);
            }}
          />
        ))}
    </>
  );
}

export function Channels({ setCreateChat, onCommunityClick }: ChannelsProps) {
  const { clearNotifications, clearMentions, notifications, activeChannel } =
    useMessengerContext();
  useEffect(() => {
    if (activeChannel) {
      if (notifications[activeChannel.id] > 0) {
        clearNotifications(activeChannel.id);
        clearMentions(activeChannel.id);
      }
    }
  }, [notifications, activeChannel]);

  return (
    <ChannelList>
      <GenerateChannels
        type={"channel"}
        onCommunityClick={onCommunityClick}
        setCreateChat={setCreateChat}
      />

      <Chats>
        <ChatsBar>
          <Heading>Chat</Heading>
          <EditBtn onClick={() => setCreateChat(true)}>
            <CreateIcon />
          </EditBtn>
        </ChatsBar>
        <ChatsList>
          <GenerateChannels
            type={"group"}
            onCommunityClick={onCommunityClick}
            setCreateChat={setCreateChat}
          />
          <GenerateChannels
            type={"dm"}
            onCommunityClick={onCommunityClick}
            setCreateChat={setCreateChat}
          />
        </ChatsList>
      </Chats>
    </ChannelList>
  );
}

export const ChannelList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const Chats = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 16px;
  margin-top: 16px;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: calc(100% - 24px);
    height: 1px;
    background-color: ${({ theme }) => theme.primary};
    opacity: 0.1;
  }
`;

const ChatsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const ChatsList = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
`;

const Heading = styled.p`
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
  color: ${({ theme }) => theme.primary};
`;

const EditBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  padding: 0;

  &:hover {
    background: ${({ theme }) => theme.border};
  }

  &:active,
  &.active {
    background: ${({ theme }) => theme.inputColor};
  }
`;
