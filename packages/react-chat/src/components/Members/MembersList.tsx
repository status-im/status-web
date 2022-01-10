import React, { useMemo } from "react";
import { utils } from "status-communities/dist/cjs";
import { bufToHex } from "status-communities/dist/cjs/utils";
import styled from "styled-components";

import { useIdentity } from "../../contexts/identityProvider";
import { useMessengerContext } from "../../contexts/messengerProvider";
import { useModal } from "../../contexts/modalProvider";
import { buttonStyles } from "../Buttons/buttonStyle";
import { LogoutIcon } from "../Icons/LogoutIcon";
import { LogoutModalName } from "../Modals/LogoutModal";

import { Member } from "./Member";

interface MembersListProps {
  switchShowMembers?: () => void;
}

export function MembersList({ switchShowMembers }: MembersListProps) {
  const { contacts, nickname } = useMessengerContext();
  const identity = useIdentity();
  const { setModal } = useModal(LogoutModalName);

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
          <Row>
            <Member
              contact={{
                id: utils.bufToHex(identity.publicKey),
                customName: nickname,
                trueName: utils.bufToHex(identity.publicKey),
              }}
              isYou={true}
            />
            <LogoutBtn onClick={() => setModal(true)}>
              <LogoutIcon />
            </LogoutBtn>
          </Row>
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

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoutBtn = styled.button`
  ${buttonStyles}
  width: 32px;
  height: 32px;
  border-radius: 50%;
  padding: 0;
`;
