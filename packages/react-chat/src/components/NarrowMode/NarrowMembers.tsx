import React from "react";
import styled from "styled-components";

import { CommunityData } from "../../helpers/communityMock";
import { MembersList } from "../Members";

import { NarrowTopbar } from "./NarrowTopbar";

interface NarrowMembersProps {
  community: CommunityData;
  setShowChannels: (val: boolean) => void;
  setShowMembersList: (val: boolean) => void;
}

export function NarrowMembers({
  community,
  setShowChannels,
  setShowMembersList,
}: NarrowMembersProps) {
  return (
    <ListWrapper>
      <NarrowTopbar list="Community members" community={community.name} />
      <MembersList
        community={community}
        setShowChannels={setShowChannels}
        setShowMembers={setShowMembersList}
      />
    </ListWrapper>
  );
}

const ListWrapper = styled.div`
  padding: 0px 18px 18px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  overflow: auto;
`;
