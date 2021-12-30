import React, { useState } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { Contact } from "../../models/Contact";
import { ContactMenu } from "../Form/ContactMenu";
import { Icon } from "../Icons/Icon";
import { UserAddress } from "../Messages/Styles";

import { UserLogo } from "./UserLogo";

interface MemberProps {
  contact: Contact;
  isOnline?: boolean;
  isYou?: boolean;
  switchShowMembers?: () => void;
  onClick?: () => void;
}

export function Member({
  contact,
  isOnline,
  isYou,
  switchShowMembers,
  onClick,
}: MemberProps) {
  const { setChannel } = useMessengerContext();

  const [showMenu, setShowMenu] = useState(false);

  const onMemberClick = () => {
    if (!isYou) {
      switchShowMembers?.();
      setChannel({
        id: contact.id,
        name: contact?.customName ?? contact.trueName,
        type: "dm",
        description: "Contact",
        members: [contact],
      });
    }
  };

  return (
    <MemberData
      onClick={onClick ? onClick : onMemberClick}
      className={`${isYou && "you"}`}
    >
      <MemberIcon
        style={{
          backgroundImage: "unset",
        }}
        className={
          !isYou && isOnline ? "online" : !isYou && !isOnline ? "offline" : ""
        }
        onClick={() => setShowMenu((e) => !e)}
      >
        {showMenu && <ContactMenu id={contact.id} setShowMenu={setShowMenu} />}
        <UserLogo
          contact={contact}
          radius={30}
          colorWheel={[
            ["red", 150],
            ["blue", 250],
            ["green", 360],
          ]}
        />
      </MemberIcon>
      <Column>
        <MemberName>{contact?.customName ?? contact.trueName}</MemberName>
        <UserAddress>
          {contact.id.slice(0, 5)}...{contact.id.slice(-3)}
        </UserAddress>
      </Column>
    </MemberData>
  );
}

export const MemberData = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  cursor: pointer;

  &.you {
    margin-bottom: 0;
    cursor: default;
  }
`;

export const MemberName = styled.p`
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.primary};
  opacity: 0.7;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const MemberIcon = styled(Icon)`
  width: 29px;
  height: 29px;
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

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`;
