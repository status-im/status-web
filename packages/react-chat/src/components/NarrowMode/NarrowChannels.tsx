import React from "react";
import styled from "styled-components";

import { ChannelData } from "../../models/ChannelData";
import { Channels } from "../Channels/Channels";

import { NarrowTopbar } from "./NarrowTopbar";

interface NarrowChannelsProps {
  community: string;
  setActiveChannel: (val: ChannelData) => void;
  activeChannelId: string;
  setShowChannels: (val: boolean) => void;
  channels: ChannelData[];
  membersList: string[];
  setCreateChat: (val: boolean) => void;
}

export function NarrowChannels({
  community,
  setActiveChannel,
  activeChannelId,
  setShowChannels,
  channels,
  membersList,
  setCreateChat,
}: NarrowChannelsProps) {
  return (
    <ListWrapper>
      <NarrowTopbar list="Channels" community={community} />
      <Channels
        onCommunityClick={(e) => {
          setActiveChannel(e);
          setShowChannels(false);
        }}
        activeChannelId={activeChannelId}
        channels={channels}
        membersList={membersList}
        setCreateChat={setCreateChat}
      />
    </ListWrapper>
  );
}

const ListWrapper = styled.div`
  padding: 0px 18px 18px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  overflow: auto;
`;
