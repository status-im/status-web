import React from "react";
import styled from "styled-components";

import { CommunityData } from "../../helpers/communityMock";
import { UserIcon } from "../Icons/UserIcon";

import { Member, MemberData, MemberIcon } from "./Member";

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
