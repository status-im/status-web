import React from "react";
import { utils } from "status-communities/dist/cjs";
import { bufToHex } from "status-communities/dist/cjs/utils";
import styled from "styled-components";

import { useIdentity } from "../../contexts/identityProvider";
import { useMessengerContext } from "../../contexts/messengerProvider";
import { UserIcon } from "../Icons/UserIcon";

import { Member, MemberData, MemberIcon } from "./Member";

interface MembersListProps {
  switchShowMembers?: () => void;
  setMembersList: any;
}

export function MembersList({
  switchShowMembers,
  setMembersList,
}: MembersListProps) {
  const { contacts } = useMessengerContext();
  const identity = useIdentity();

  return (
    <MembersListWrap>
      <MemberCategory>
        <MemberCategoryName>You</MemberCategoryName>
        <MemberData>
          <MemberIcon>
            <UserIcon memberView={true} />
          </MemberIcon>
          <MemberName>{utils.bufToHex(identity.publicKey)}</MemberName>
        </MemberData>
      </MemberCategory>
      <MemberCategory>
        <MemberCategoryName>Online</MemberCategoryName>
        {Object.values(contacts)
          .filter((e) => e.id != bufToHex(identity.publicKey))
          .filter((e) => e.online)
          .map((contact) => (
            <Member
              key={contact.id}
              contact={contact}
              isOnline={contact.online}
              switchShowMembers={switchShowMembers}
              setMembersList={setMembersList}
            />
          ))}
      </MemberCategory>
      <MemberCategory>
        <MemberCategoryName>Offline</MemberCategoryName>
        {Object.values(contacts)
          .filter((e) => e.id != bufToHex(identity.publicKey))
          .filter((e) => !e.online)
          .map((contact) => (
            <Member
              key={contact.id}
              contact={contact}
              isOnline={contact.online}
              switchShowMembers={switchShowMembers}
              setMembersList={setMembersList}
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
