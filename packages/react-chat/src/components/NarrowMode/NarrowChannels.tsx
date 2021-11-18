import React from "react";
import styled from "styled-components";

import { Channels } from "../Channels/Channels";

import { NarrowTopbar } from "./NarrowTopbar";

interface NarrowChannelsProps {
  setShowChannels: (val: boolean) => void;
  setCreateChat: (val: boolean) => void;
}

export function NarrowChannels({
  setShowChannels,
  setCreateChat,
}: NarrowChannelsProps) {
  return (
    <ListWrapper>
      <NarrowTopbar list="Channels" />
      <Channels
        onCommunityClick={() => setShowChannels(false)}
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
