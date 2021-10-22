import React from "react";
import styled from "styled-components";

import { ChannelData } from "../../models/ChannelData";
import { Channels } from "../Channels/Channels";

import { NarrowTopbar } from "./NarrowTopbar";

interface NarrowChannelsProps {
  community: string;
  notifications: { [id: string]: number };
  setActiveChannel: (val: ChannelData) => void;
  activeChannelId: string;
  setShowChannels: (val: boolean) => void;
  clearNotifications: (id: string) => void;
  channels: ChannelData[];
  showDialogues: boolean;
}

export function NarrowChannels({
  community,
  notifications,
  setActiveChannel,
  activeChannelId,
  setShowChannels,
  clearNotifications,
  channels,
  showDialogues,
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
        channels={channels}
        showDialogues={showDialogues}
      />
    </ListWrapper>
  );
}

const ListWrapper = styled.div`
  padding: 0px 18px 18px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  overflow: auto;
`;
