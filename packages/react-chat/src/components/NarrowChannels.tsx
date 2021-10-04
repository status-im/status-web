import React from "react";
import styled from "styled-components";

import { ChannelData, channels } from "../helpers/channelsMock";
import { Theme } from "../styles/themes";

import { Channel, ChannelList } from "./Channels";
import { NarrowTopbar } from "./NarrowTopbar";

interface NarrowChannelsProps {
  theme: Theme;
  community: string;
  notifications: { [id: string]: number };
  setActiveChannel: (val: ChannelData) => void;
  activeChannelId: number;
  setShowChannels: (val: boolean) => void;
}

export function NarrowChannels({
  theme,
  community,
  notifications,
  setActiveChannel,
  activeChannelId,
  setShowChannels,
}: NarrowChannelsProps) {
  return (
    <ListWrapper>
      <NarrowTopbar
        theme={theme}
        list="Channels"
        community={community}
        onClick={() => setShowChannels(false)}
      />
      <ChannelList>
        {channels.map((channel) => (
          <Channel
            key={channel.id}
            channel={channel}
            theme={theme}
            isActive={channel.id === activeChannelId}
            isMuted={channel.isMuted || false}
            notification={
              notifications[channel.name] > 0 && !channel.isMuted
                ? notifications[channel.name]
                : undefined
            }
            onClick={() => {
              setActiveChannel(channel);
              setShowChannels(false);
            }}
          />
        ))}
      </ChannelList>
    </ListWrapper>
  );
}

const ListWrapper = styled.div`
  padding: 18px;
`;
