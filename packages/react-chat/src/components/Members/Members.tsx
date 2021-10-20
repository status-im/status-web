import React from "react";
import styled from "styled-components";

import { CommunityData } from "../../models/CommunityData";

import { MembersList } from "./MembersList";

interface MembersProps {
  community: CommunityData;
  setShowChannels: (val: boolean) => void;
}

export function Members({ community, setShowChannels }: MembersProps) {
  return (
    <MembersWrapper>
      <MemberHeading>Members</MemberHeading>
      <MembersList community={community} setShowChannels={setShowChannels} />
    </MembersWrapper>
  );
}

const MembersWrapper = styled.div`
  width: 18%;
  height: 100%;
  min-width: 164px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.sectionBackgroundColor};
  padding: 16px;
`;

const MemberHeading = styled.h2`
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 16px;
`;
