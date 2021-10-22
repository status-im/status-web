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
  showDialogues: boolean;
}

export function Channels({
  notifications,
  onCommunityClick,
  clearNotifications,
  activeChannelId,
  channels,
  showDialogues,
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
      {showDialogues && (
        <Dialogues>
          <Channel
            key={channels[0].id}
            channel={channels[0]}
            isActive={channels[0].id === activeChannelId}
            isMuted={channels[0].isMuted || false}
            notification={
              notifications[channels[0].name] > 0 && !channels[0].isMuted
                ? notifications[channels[0].name]
                : undefined
            }
            onClick={() => {
              onCommunityClick(channels[0]);
            }}
          />
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
