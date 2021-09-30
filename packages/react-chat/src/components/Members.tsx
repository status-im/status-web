import React from "react";
import styled from "styled-components";

import { ChannelData } from "../helpers/channelsMock";
import { Theme } from "../styles/themes";

import { Icon } from "./Chat/ChatMessages";
import { UserIcon } from "./Icons/UserIcon";

interface MembersProps {
  theme: Theme;
  channel: ChannelData;
}

export function Members({ theme, channel }: MembersProps) {
  return (
    <MembersWrapper theme={theme}>
      <MemberHeading theme={theme}>Members</MemberHeading>
      <MembersList>
        <MemberCategory>
          <MemberCategoryName theme={theme}>You</MemberCategoryName>
          <MemberData>
            <Icon>
              <UserIcon theme={theme} />
            </Icon>
            <MemberName theme={theme}>Guest564732</MemberName>
          </MemberData>
        </MemberCategory>
        <MemberCategory>
          <MemberCategoryName theme={theme}>Online</MemberCategoryName>
          {channel.membersList
            .filter((member) => member.isOnline)
            .map((member) => (
              <Member
                theme={theme}
                member={member}
                isOnline={member.isOnline}
              />
            ))}
        </MemberCategory>
        <MemberCategory>
          <MemberCategoryName theme={theme}>Offline</MemberCategoryName>
          {channel.membersList
            .filter((member) => !member.isOnline)
            .map((member) => (
              <Member
                theme={theme}
                member={member}
                isOnline={member.isOnline}
              />
            ))}
        </MemberCategory>
      </MembersList>
    </MembersWrapper>
  );
}

interface MemberProps {
  theme: Theme;
  member: any;
  isOnline: boolean;
}

export function Member({ theme, member, isOnline }: MemberProps) {
  return (
    <MemberData>
      <MemberIcon
        style={{
          backgroundImage: member.avatar ? `url(${member.avatar})` : "unset",
        }}
        className={isOnline ? "online" : ""}
        theme={theme}
      >
        {!member.avatar && <UserIcon theme={theme} />}
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
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.sectionBackgroundColor};
  padding: 16px;
`;

const MemberHeading = styled.h2<ThemeProps>`
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.textPrimaryColor};
  margin-bottom: 16px;
`;

const MemberCategoryName = styled.h3<ThemeProps>`
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.textSecondaryColor};
  margin-bottom: 8px;
`;

const MemberName = styled.p<ThemeProps>`
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.textPrimaryColor};
  opacity: 0.7;
  margin-left: 8px;
`;

const MembersList = styled.div`
  display: flex;
  flex-direction: column;
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
  position: relative;
  background-size: contain;
  background-position: center;

  &.online {
    &::after {
      content: "";
      position: absolute;
      right: -1px;
      bottom: 1px;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background-color: #4ebc60;
      border: 2px solid ${({ theme }) => theme.bodyBackgroundColor};
    }
  }
`;
