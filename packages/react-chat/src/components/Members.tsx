import React from "react";
import styled from "styled-components";

import { CommunityData } from "../helpers/communityMock";
import { Theme } from "../styles/themes";

import { Icon } from "./Chat/ChatMessages";
import { UserIcon } from "./Icons/UserIcon";

interface MembersProps {
  theme: Theme;
  community: CommunityData;
  setShowChannels: (val: boolean) => void;
}

export function Members({ theme, community, setShowChannels }: MembersProps) {
  return (
    <MembersWrapper theme={theme}>
      <MemberHeading theme={theme}>Members</MemberHeading>
      <MembersList
        theme={theme}
        community={community}
        setShowChannels={setShowChannels}
      />
    </MembersWrapper>
  );
}

interface MembersListProps {
  theme: Theme;
  community: CommunityData;
  setShowChannels: (val: boolean) => void;
}

export function MembersList({
  theme,
  community,
  setShowChannels,
}: MembersListProps) {
  return (
    <MembersListWrap>
      <MemberCategory>
        <MemberCategoryName theme={theme}>You</MemberCategoryName>
        <MemberData>
          <MemberIcon>
            <UserIcon theme={theme} memberView={true} />
          </MemberIcon>
          <MemberName theme={theme}>Guest564732</MemberName>
        </MemberData>
      </MemberCategory>
      <MemberCategory>
        <MemberCategoryName theme={theme}>Online</MemberCategoryName>
        {community.membersList
          .filter((member) => member.isOnline)
          .map((member) => (
            <Member
              key={member.id}
              theme={theme}
              member={member}
              isOnline={member.isOnline}
              setShowChannels={setShowChannels}
            />
          ))}
      </MemberCategory>
      <MemberCategory>
        <MemberCategoryName theme={theme}>Offline</MemberCategoryName>
        {community.membersList
          .filter((member) => !member.isOnline)
          .map((member) => (
            <Member
              key={member.id}
              theme={theme}
              member={member}
              isOnline={member.isOnline}
              setShowChannels={setShowChannels}
            />
          ))}
      </MemberCategory>
    </MembersListWrap>
  );
}

interface MemberProps {
  theme: Theme;
  member: any;
  isOnline: boolean;
  setShowChannels: (val: boolean) => void;
}

export function Member({
  theme,
  member,
  isOnline,
  setShowChannels,
}: MemberProps) {
  return (
    <MemberData onClick={() => setShowChannels(true)}>
      <MemberIcon
        style={{
          backgroundImage: member.avatar ? `url(${member.avatar})` : "unset",
        }}
        className={isOnline ? "online" : ""}
        theme={theme}
      >
        {!member.avatar && <UserIcon theme={theme} memberView={true} />}
      </MemberIcon>
      <MemberName theme={theme}>{member.name}</MemberName>
    </MemberData>
  );
}

interface ThemeProps {
  theme: Theme;
}

const MembersWrapper = styled.div<ThemeProps>`
  width: 18%;
  height: 100%;
  min-width: 164px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.sectionBackgroundColor};
  padding: 16px;
`;

const MemberHeading = styled.h2<ThemeProps>`
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 16px;
`;

const MemberCategoryName = styled.h3<ThemeProps>`
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.secondary};
  margin-bottom: 8px;
`;

const MemberName = styled.p<ThemeProps>`
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.primary};
  opacity: 0.7;
  margin-left: 8px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const MembersListWrap = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const MemberCategory = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const MemberData = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const MemberIcon = styled(Icon)<ThemeProps>`
  width: 24px;
  height: 24px;
  position: relative;
  background-size: contain;
  background-position: center;
  flex-shrink: 0;

  &.online {
    &::after {
      content: "";
      position: absolute;
      right: -1px;
      bottom: 1px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #4ebc60;
      border: 2px solid ${({ theme }) => theme.bodyBackgroundColor};
    }
  }
`;
