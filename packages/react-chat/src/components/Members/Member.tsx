import React, { useState } from "react";
import styled from "styled-components";

import { Contact } from "../../models/Contact";
import { Icon } from "../Chat/ChatMessages";
import { ContactMenu } from "../Form/ContactMenu";
import { UserIcon } from "../Icons/UserIcon";

interface MemberProps {
  contact: Contact;
  isOnline?: boolean;
  switchShowMembers?: () => void;
  setMembersList?: any;
  onClick?: () => void;
}

export function Member({
  contact,
  isOnline,
  switchShowMembers,
  setMembersList,
  onClick,
}: MemberProps) {
  const startDialog = (member: string) => {
    setMembersList((prevMembers: string[]) => {
      if (prevMembers.find((chat) => chat === member)) {
        return prevMembers;
      } else {
        return [...prevMembers, member];
      }
    });
  };

  const [showMenu, setShowMenu] = useState(false);

  const onMemberClick = () => {
    switchShowMembers?.();
    startDialog(contact.id);
  };

  return (
    <MemberData onClick={onClick ? onClick : onMemberClick}>
      <MemberIcon
        style={{
          backgroundImage: "unset",
        }}
        className={isOnline ? "online" : "offline"}
        onClick={() => setShowMenu((e) => !e)}
      >
        {showMenu && <ContactMenu id={contact.id} setShowMenu={setShowMenu} />}
        <UserIcon memberView={true} />
      </MemberIcon>
      <MemberName>{contact.customName ?? contact.id}</MemberName>
    </MemberData>
  );
}

export const MemberData = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  cursor: pointer;
`;

export const MemberName = styled.p`
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

export const MemberIcon = styled(Icon)`
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
