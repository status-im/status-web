import React from "react";
import { Identity } from "status-communities/dist/cjs";
import styled from "styled-components";

import { MembersList } from "./MembersList";

interface MembersProps {
  identity: Identity;
  setShowChannels: (val: boolean) => void;
  setMembersList: any;
}

export function Members({
  identity,
  setShowChannels,
  setMembersList,
}: MembersProps) {
  return (
    <MembersWrapper>
      <MemberHeading>Members</MemberHeading>
      <MembersList
        identity={identity}
        setShowChannels={setShowChannels}
        setMembersList={setMembersList}
      />
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
