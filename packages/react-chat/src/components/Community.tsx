import React from "react";
import styled from "styled-components";

import { CommunityData } from "../helpers/communityMock";
import { Theme } from "../styles/themes";

interface CommunityProps {
  theme: Theme;
  community: CommunityData;
}

export function Community({ theme, community }: CommunityProps) {
  return (
    <CommunityWrap>
      <CommunityLogo src={community.icon} alt={`${community.name} logo`} />
      <CommunityInfo>
        <CommunityName theme={theme}>{community.name}</CommunityName>
        <MembersAmount theme={theme}>{community.members} members</MembersAmount>
      </CommunityInfo>
    </CommunityWrap>
  );
}

interface ThemeProps {
  theme: Theme;
}

const CommunityWrap = styled.div`
  display: flex;
`;

const CommunityLogo = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-left: 10px;
`;

const CommunityInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`;

const CommunityName = styled.h1<ThemeProps>`
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.textPrimaryColor};
`;

export const MembersAmount = styled.p<ThemeProps>`
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  color: ${({ theme }) => theme.textSecondaryColor};
`;
