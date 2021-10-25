import React, { useEffect } from "react";
import styled from "styled-components";

import { ChannelData } from "../../models/ChannelData";

import { Channel } from "./Channel";

interface ChannelsProps {
  notifications: { [id: string]: number };
  clearNotifications: (id: string) => void;
  onCommunityClick: (val: ChannelData) => void;
  activeChannelId: string;
  channels: ChannelData[];
  membersList: string[];
}

export function Channels({
  notifications,
  onCommunityClick,
  clearNotifications,
  activeChannelId,
  channels,
  membersList,
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
          }}
        />
      ))}

      {membersList.length > 0 && (
        <Dialogues>
          {membersList.map((member) => (
            <Channel
              key={member}
              channel={{
                id: member,
                name: member.slice(0, 10),
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
              }}
            />
          ))}
        </Dialogues>
      )}
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

const Dialogues = styled.div`
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
