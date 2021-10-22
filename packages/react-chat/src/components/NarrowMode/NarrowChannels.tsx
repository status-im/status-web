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

  membersList: string[];
}

export function NarrowChannels({
  community,
  notifications,
  setActiveChannel,
  activeChannelId,
  setShowChannels,
  clearNotifications,
  channels,

  membersList,
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
        membersList={membersList}
      />
    </ListWrapper>
  );
}

const ListWrapper = styled.div`
  padding: 0px 18px 18px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  overflow: auto;
`;
