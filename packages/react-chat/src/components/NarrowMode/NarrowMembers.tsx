import React from "react";
import styled from "styled-components";

import { MembersList } from "../Members/MembersList";

import { NarrowTopbar } from "./NarrowTopbar";

interface NarrowMembersProps {
  switchShowMembersList: () => void;
}

export function NarrowMembers({ switchShowMembersList }: NarrowMembersProps) {
  return (
    <ListWrapper>
      <NarrowTopbar list="Community members" />
      <MembersList switchShowMembers={switchShowMembersList} />
    </ListWrapper>
  );
}

const ListWrapper = styled.div`
  padding: 0px 18px 18px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  overflow: auto;
`;
