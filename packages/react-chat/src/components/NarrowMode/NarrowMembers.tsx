import React from "react";
import { Identity } from "status-communities/dist/cjs";
import styled from "styled-components";

import { CommunityData } from "../../models/CommunityData";
import { Contact } from "../../models/Contact";
import { MembersList } from "../Members/MembersList";

import { NarrowTopbar } from "./NarrowTopbar";

interface NarrowMembersProps {
  identity: Identity;
  community: CommunityData;
  contacts: Contact[];
  setShowChannels: (val: boolean) => void;
  setShowMembersList: (val: boolean) => void;
  setMembersList: any;
}

export function NarrowMembers({
  identity,
  community,
  contacts,
  setShowChannels,
  setShowMembersList,
  setMembersList,
}: NarrowMembersProps) {
  return (
    <ListWrapper>
      <NarrowTopbar list="Community members" community={community.name} />
      <MembersList
        identity={identity}
        contacts={contacts}
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
