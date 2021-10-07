import React from "react";
import styled from "styled-components";

import { ChannelData, channels } from "../../helpers/channelsMock";
import { Channel, ChannelList } from "../Channels";

import { NarrowTopbar } from "./NarrowTopbar";

interface NarrowChannelsProps {
  community: string;
  notifications: { [id: string]: number };
  setActiveChannel: (val: ChannelData) => void;
  activeChannelId: number;
  setShowChannels: (val: boolean) => void;
}

export function NarrowChannels({
  community,
  notifications,
  setActiveChannel,
  activeChannelId,
  setShowChannels,
}: NarrowChannelsProps) {
  return (
    <ListWrapper>
      <NarrowTopbar list="Channels" community={community} />
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
  padding: 82px 18px 18px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
`;
