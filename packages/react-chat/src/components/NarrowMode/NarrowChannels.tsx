import React from "react";
import styled from "styled-components";

import { Channels } from "../Channels/Channels";

import { NarrowTopbar } from "./NarrowTopbar";

interface NarrowChannelsProps {
  community: string;
  setShowChannels: (val: boolean) => void;
  membersList: string[];
  groupList: string[][];
  setCreateChat: (val: boolean) => void;
}

export function NarrowChannels({
  community,
  setShowChannels,
  membersList,
  groupList,
  setCreateChat,
}: NarrowChannelsProps) {
  return (
    <ListWrapper>
      <NarrowTopbar list="Channels" community={community} />
      <Channels
        onCommunityClick={() => setShowChannels(false)}
        membersList={membersList}
        groupList={groupList}
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
