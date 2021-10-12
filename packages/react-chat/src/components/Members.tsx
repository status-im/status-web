import React, { useCallback } from "react";
import styled from "styled-components";

import { useNarrow } from "../contexts/narrowProvider";
import { CommunityData } from "../helpers/communityMock";

import { Icon } from "./Chat/ChatMessages";
import { UserIcon } from "./Icons/UserIcon";

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

interface MembersListProps {
  community: CommunityData;
  setShowChannels: (val: boolean) => void;
  setShowMembers?: (val: boolean) => void;
}

export function MembersList({
  community,
  setShowChannels,
  setShowMembers,
}: MembersListProps) {
  return (
    <MembersListWrap>
      <MemberCategory>
        <MemberCategoryName>You</MemberCategoryName>
        <MemberData>
          <MemberIcon>
            <UserIcon memberView={true} />
          </MemberIcon>
          <MemberName>Guest564732</MemberName>
        </MemberData>
      </MemberCategory>
      <MemberCategory>
        <MemberCategoryName>Online</MemberCategoryName>
        {community.membersList
          .filter((member) => member.isOnline)
          .map((member) => (
            <Member
              key={member.id}
              member={member}
              isOnline={member.isOnline}
              setShowChannels={setShowChannels}
              setShowMembers={setShowMembers}
            />
          ))}
      </MemberCategory>
      <MemberCategory>
        <MemberCategoryName>Offline</MemberCategoryName>
        {community.membersList
          .filter((member) => !member.isOnline)
          .map((member) => (
            <Member
              key={member.id}
              member={member}
              isOnline={member.isOnline}
              setShowChannels={setShowChannels}
              setShowMembers={setShowMembers}
            />
          ))}
      </MemberCategory>
    </MembersListWrap>
  );
}

interface MemberProps {
  member: any;
  isOnline: boolean;
  setShowChannels: (val: boolean) => void;
  setShowMembers?: (val: boolean) => void;
}

export function Member({
  member,
  isOnline,
  setShowChannels,
  setShowMembers,
}: MemberProps) {
  const narrow = useNarrow();

  const switchMemberList = useCallback(() => {
    setShowChannels(false);
    if (setShowMembers) setShowMembers(false);
  }, [setShowMembers]);

  return (
    <MemberData
      onClick={() =>
        narrow && setShowMembers ? switchMemberList() : setShowChannels(true)
      }
    >
      <MemberIcon
        style={{
          backgroundImage: member.avatar ? `url(${member.avatar})` : "unset",
        }}
        className={isOnline ? "online" : "offline"}
      >
        {!member.avatar && <UserIcon memberView={true} />}
      </MemberIcon>
      <MemberName>{member.name}</MemberName>
    </MemberData>
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

const MemberCategoryName = styled.h3`
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.secondary};
  margin-bottom: 8px;
`;

const MemberName = styled.p`
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

const MemberIcon = styled(Icon)`
  width: 24px;
  height: 24px;
  position: relative;
  background-size: contain;
  background-position: center;
  flex-shrink: 0;

  &.offline {
    &::after {
      content: "";
      position: absolute;
      right: -1px;
      bottom: -2px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.secondary};
      border: 2px solid ${({ theme }) => theme.bodyBackgroundColor};
    }
  }

  &.online {
    &::after {
      content: "";
      position: absolute;
      right: -1px;
      bottom: -2px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #4ebc60;
      border: 2px solid ${({ theme }) => theme.bodyBackgroundColor};
    }
  }
`;
