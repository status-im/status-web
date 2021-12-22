import React, { useMemo } from "react";
import { bufToHex } from "status-communities/dist/cjs/utils";
import styled from "styled-components";

import {
  useIdentity,
  useNickname,
  useSetIdentity,
} from "../../contexts/identityProvider";
import { useMessengerContext } from "../../contexts/messengerProvider";
import { TopBtn } from "../Chat/ChatTopbar";
import { LogoutIcon } from "../Icons/LogoutIcon";
import { UserIcon } from "../Icons/UserIcon";

import { Member, MemberData, MemberIcon } from "./Member";

interface MembersListProps {
  switchShowMembers?: () => void;
}

export function MembersList({ switchShowMembers }: MembersListProps) {
  const { contacts } = useMessengerContext();
  const identity = useIdentity();
  const nickname = useNickname();
  const logout = useSetIdentity();
  const userContacts = useMemo(() => {
    if (identity) {
      return Object.values(contacts).filter(
        (e) => e.id != bufToHex(identity.publicKey)
      );
    } else {
      return Object.values(contacts);
    }
  }, [contacts, identity]);
  const onlineContacts = useMemo(
    () => userContacts.filter((e) => e.online),
    [userContacts]
  );
  const offlineContacts = useMemo(
    () => userContacts.filter((e) => !e.online),
    [userContacts]
  );

  return (
    <MembersListWrap>
      {identity && (
        <MemberCategory>
          <MemberCategoryName>You</MemberCategoryName>
          <MemberData className="you">
            <Row>
              <MemberIcon>
                <UserIcon memberView={true} />
              </MemberIcon>
              <MemberName>{nickname}</MemberName>
            </Row>
            <TopBtn onClick={() => logout(undefined)}>
              <LogoutIcon />
            </TopBtn>
          </MemberData>
        </MemberCategory>
      )}
      {onlineContacts.length > 0 && (
        <MemberCategory>
          <MemberCategoryName>Online</MemberCategoryName>
          {onlineContacts.map((contact) => (
            <Member
              key={contact.id}
              contact={contact}
              isOnline={contact.online}
              switchShowMembers={switchShowMembers}
            />
          ))}
        </MemberCategory>
      )}
      {offlineContacts.length > 0 && (
        <MemberCategory>
          <MemberCategoryName>Offline</MemberCategoryName>
          {offlineContacts.map((contact) => (
            <Member
              key={contact.id}
              contact={contact}
              isOnline={contact.online}
              switchShowMembers={switchShowMembers}
            />
          ))}
        </MemberCategory>
      )}
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

const Row = styled.div`
  display: flex;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
