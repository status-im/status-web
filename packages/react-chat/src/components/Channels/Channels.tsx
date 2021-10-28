import React, { useEffect } from "react";
import styled from "styled-components";

import { ChannelData } from "../../models/ChannelData";
import { EditIcon } from "../Icons/EditIcon";

import { Channel } from "./Channel";

interface ChannelsProps {
  notifications: { [id: string]: number };
  clearNotifications: (id: string) => void;
  onCommunityClick: (val: ChannelData) => void;
  activeChannelId: string;
  channels: ChannelData[];
  membersList: string[];
  setCreateChat: (val: boolean) => void;
}

export function Channels({
  notifications,
  onCommunityClick,
  clearNotifications,
  activeChannelId,
  channels,
  membersList,
  setCreateChat,
}: ChannelsProps) {
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
            onCommunityClick(channel);
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
          {membersList.length > 0 &&
            membersList.map((member) => (
              <Channel
                key={member}
                channel={{
                  id: member,
                  name: member,
                  type: "group",
                  description: "Contact",
                }}
                isActive={member === activeChannelId}
                isMuted={false}
                onClick={() => {
                  onCommunityClick({
                    id: member,
                    name: member.slice(0, 10),
                    description: "Contact",
                  });
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
