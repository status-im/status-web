import React, { useEffect } from "react";
import styled from "styled-components";

import { ChatState, useChatState } from "../../contexts/chatStateProvider";
import { useIdentity } from "../../contexts/identityProvider";
import { useMessengerContext } from "../../contexts/messengerProvider";
import { CreateIcon } from "../Icons/CreateIcon";
import { UserCreation } from "../UserCreation/UserCreation";

import { Channel } from "./Channel";

interface ChannelsProps {
  onCommunityClick?: () => void;
}

type GenerateChannelsProps = ChannelsProps & {
  type: string;
};

function GenerateChannels({ type, onCommunityClick }: GenerateChannelsProps) {
  const { mentions, notifications, activeChannel, setActiveChannel, channels } =
    useMessengerContext();
  const setChatState = useChatState()[1];
  return (
    <>
      {Object.values(channels)
        .filter((channel) => channel.type === type)
        .map((channel) => (
          <Channel
            key={channel.id}
            channel={channel}
            isActive={channel.id === activeChannel.id}
            notified={notifications?.[channel.id] > 0}
            mention={mentions?.[channel.id]}
            onClick={() => {
              setActiveChannel(channel);
              if (onCommunityClick) {
                onCommunityClick();
              }
              setChatState(ChatState.ChatBody);
            }}
          />
        ))}
    </>
  );
}

export function Channels({ onCommunityClick }: ChannelsProps) {
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
  const setChatState = useChatState()[1];
  const identity = useIdentity();

  return (
    <ChannelList>
      <GenerateChannels type={"channel"} onCommunityClick={onCommunityClick} />
      <Chats>
        {identity ? (
          <>
            <ChatsBar>
              <Heading>Chat</Heading>
              <EditBtn onClick={() => setChatState(ChatState.ChatCreation)}>
                <CreateIcon />
              </EditBtn>
            </ChatsBar>
            <ChatsList>
              <GenerateChannels
                type={"group"}
                onCommunityClick={onCommunityClick}
              />
              <GenerateChannels
                type={"dm"}
                onCommunityClick={onCommunityClick}
              />
            </ChatsList>
          </>
        ) : (
          <UserCreation permission={true} />
        )}
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
    background: ${({ theme }) => theme.inputColor};
  }

  &:active {
    background: ${({ theme }) => theme.sectionBackgroundColor};
  }
`;
