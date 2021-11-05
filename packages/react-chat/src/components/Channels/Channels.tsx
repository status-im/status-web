import React, { useEffect, useMemo } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { EditIcon } from "../Icons/EditIcon";

import { Channel } from "./Channel";

interface ChannelsProps {
  membersList: string[];
  groupList: string[][];
  setCreateChat: (val: boolean) => void;
  onCommunityClick?: () => void;
}

export function Channels({
  membersList,
  groupList,
  setCreateChat,
  onCommunityClick,
}: ChannelsProps) {
  const {
    clearNotifications,
    notifications,
    activeChannel,
    setActiveChannel,
    channels,
  } = useMessengerContext();
  const activeChannelId = useMemo(() => activeChannel.id, [activeChannel]);
  useEffect(() => {
    const channel = channels.find((channel) => channel.id === activeChannelId);
    if (channel) {
      if (notifications[channel.id] > 0) {
        clearNotifications(channel.id);
      }
    }
  }, [notifications, activeChannelId]);

  return (
    <ChannelList>
      {channels.map((channel) => (
        <Channel
          key={channel.id}
          channel={channel}
          isActive={channel.id === activeChannelId}
          isMuted={channel.isMuted || false}
          notification={
            notifications[channel.id] > 0 && !channel.isMuted
              ? notifications[channel.id]
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

      <Chats>
        <ChatsBar>
          <Heading>Chat</Heading>
          <EditBtn onClick={() => setCreateChat(true)}>
            <EditIcon />
          </EditBtn>
        </ChatsBar>
        <ChatsList>
          {groupList.length > 0 &&
            groupList.map((group) => (
              <Channel
                key={group.join("")}
                channel={{
                  id: group.join(""),
                  name: group.join(", "),
                  type: "group",
                }}
                isActive={group.join("") === activeChannelId}
                isMuted={false}
                onClick={() => {
                  setActiveChannel({
                    id: group.join(""),
                    name: group.join(", ").slice(0, 10),
                  });
                  setCreateChat(false);
                  if (onCommunityClick) {
                    onCommunityClick();
                  }
                }}
              />
            ))}
          {membersList.length > 0 &&
            membersList.map((member) => (
              <Channel
                key={member}
                channel={{
                  id: member,
                  name: member,
                  type: "dm",
                  description: "Contact",
                }}
                isActive={member === activeChannelId}
                isMuted={false}
                onClick={() => {
                  setActiveChannel({
                    id: member,
                    name: member.slice(0, 10),
                    description: "Contact",
                  });
                  if (onCommunityClick) {
                    onCommunityClick();
                  }
                  setCreateChat(false);
                }}
              />
            ))}
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
