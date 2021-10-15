import React from "react";
import styled from "styled-components";

import { ChannelData } from "../../helpers/channelsMock";
import { Channels } from "../Channels";

import { NarrowTopbar } from "./NarrowTopbar";

interface NarrowChannelsProps {
  community: string;
  notifications: { [id: string]: number };
  setActiveChannel: (val: ChannelData) => void;
  activeChannelId: number;
  setShowChannels: (val: boolean) => void;
  clearNotifications: (id: string) => void;
}

export function NarrowChannels({
  community,
  notifications,
  setActiveChannel,
  activeChannelId,
  setShowChannels,
  clearNotifications,
}: NarrowChannelsProps) {
  return (
    <ListWrapper>
      <NarrowTopbar list="Channels" community={community} />
      <Channels
        notifications={notifications}
        clearNotifications={clearNotifications}
        onCommunityClick={(e) => {
          setActiveChannel(e);
          setShowChannels(false);
        }}
        activeChannelId={activeChannelId}
      />
    </ListWrapper>
  );
}

const ListWrapper = styled.div`
  padding: 0px 18px 18px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  overflow: auto;
`;
