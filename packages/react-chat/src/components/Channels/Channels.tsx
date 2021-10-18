import React, { useEffect } from "react";
import styled from "styled-components";

import { ChannelData, channels } from "../../helpers/channelsMock";

import { Channel } from "./Channel";

interface ChannelsProps {
  notifications: { [id: string]: number };
  clearNotifications: (id: string) => void;
  onCommunityClick: (val: ChannelData) => void;
  activeChannelId: number;
}

export function Channels({
  notifications,
  onCommunityClick,
  clearNotifications,
  activeChannelId,
}: ChannelsProps) {
  useEffect(() => {
    const channel = channels.find((channel) => channel.id === activeChannelId);
    if (channel) {
      if (notifications[channel.name] > 0) {
        clearNotifications(channel.name);
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
            notifications[channel.name] > 0 && !channel.isMuted
              ? notifications[channel.name]
              : undefined
          }
          onClick={() => {
            onCommunityClick(channel);
          }}
        />
      ))}
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
