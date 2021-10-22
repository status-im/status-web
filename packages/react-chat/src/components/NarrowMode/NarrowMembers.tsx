import React from "react";
import styled from "styled-components";

import { CommunityData } from "../../models/CommunityData";
import { MembersList } from "../Members/MembersList";

import { NarrowTopbar } from "./NarrowTopbar";

interface NarrowMembersProps {
  community: CommunityData;
  setShowChannels: (val: boolean) => void;
  setShowMembersList: (val: boolean) => void;
  setMembersList: any;
}

export function NarrowMembers({
  community,
  setShowChannels,
  setShowMembersList,
  setMembersList,
}: NarrowMembersProps) {
  return (
    <ListWrapper>
      <NarrowTopbar list="Community members" community={community.name} />
      <MembersList
        community={community}
        setShowChannels={setShowChannels}
        setShowMembers={setShowMembersList}
        setMembersList={setMembersList}
      />
    </ListWrapper>
  );
}

const ListWrapper = styled.div`
  padding: 0px 18px 18px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  overflow: auto;
`;
