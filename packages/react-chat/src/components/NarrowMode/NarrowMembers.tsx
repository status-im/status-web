import React from "react";
import styled from "styled-components";

import { CommunityData } from "../../helpers/communityMock";
import { Theme } from "../../styles/themes";
import { MembersList } from "../Members";

import { NarrowTopbar } from "./NarrowTopbar";

interface NarrowMembersProps {
  theme: Theme;
  community: CommunityData;
  setShowChannels: (val: boolean) => void;
  setShowMembersList: (val: boolean) => void;
}

export function NarrowMembers({
  theme,
  community,
  setShowChannels,
  setShowMembersList,
}: NarrowMembersProps) {
  return (
    <ListWrapper theme={theme}>
      <NarrowTopbar
        theme={theme}
        list="Community members"
        community={community.name}
        onClick={() => setShowMembersList(false)}
      />
      <MembersList
        theme={theme}
        community={community}
        setShowChannels={setShowChannels}
        setShowMembers={setShowMembersList}
      />
    </ListWrapper>
  );
}

interface ThemeProps {
  theme: Theme;
}

const ListWrapper = styled.div<ThemeProps>`
  padding: 18px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
`;
