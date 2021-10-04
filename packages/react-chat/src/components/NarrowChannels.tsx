import React from "react";
import styled from "styled-components";

import { ChannelData, channels } from "../helpers/channelsMock";
import { Theme } from "../styles/themes";

import { Channel, ChannelList } from "./Channels";
import { TagIcon } from "./Icons/TagIcon";
import { NarrowTopbar } from "./NarrowTopbar";

interface NarrowChannelsProps {
  theme: Theme;
  notifications: { [id: string]: number };
  setActiveChannel: (val: ChannelData) => void;
  activeChannelId: number;
  setShowChannels: (val: boolean) => void;
}

export function NarrowChannels({
  theme,
  notifications,
  setActiveChannel,
  activeChannelId,
  setShowChannels,
}: NarrowChannelsProps) {
  return (
    <ListWrapper>
      <NarrowTopbar theme={theme} onClick={() => setShowChannels(false)}>
        <TagIcon theme={theme} />
        <ListName theme={theme}>Chats</ListName>
      </NarrowTopbar>
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

interface ThemeProps {
  theme: Theme;
}

const ListWrapper = styled.div`
  padding: 0 18px;
`;

const ListName = styled.p<ThemeProps>`
  margin-left: 10px;
  color: ${({ theme }) => theme.primary};
`;
