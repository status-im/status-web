import React, { useMemo } from "react";
import styled from "styled-components";

import { useBlockedUsers } from "../../contexts/blockedUsersProvider";
import { ChatMessage } from "../../models/ChatMessage";
import { Icon } from "../Chat/ChatMessages";
import { AddContactSvg } from "../Icons/AddContactIcon";
import { BlockSvg } from "../Icons/BlockIcon";
import { EditSvg } from "../Icons/EditIcon";
import { ProfileSvg } from "../Icons/ProfileIcon";
import { UntrustworthIcon } from "../Icons/UntrustworthIcon";
import { UserIcon } from "../Icons/UserIcon";
import { WarningSvg } from "../Icons/WarningIcon";
import { textMediumStyles } from "../Text";

import { DropdownMenu, MenuItem, MenuText } from "./DropdownMenu";

type ContactMenuProps = {
  message: ChatMessage;
  setShowMenu: (val: boolean) => void;
  isUntrustworthy: boolean;
  setIsUntrustworthy: (val: boolean) => void;
  viewProfile: () => void;
};

export function ContactMenu({
  message,
  setShowMenu,
  isUntrustworthy,
  setIsUntrustworthy,
  viewProfile,
}: ContactMenuProps) {
  const id = message.sender;
  const { blockedUsers, setBlockedUsers } = useBlockedUsers();

  const userInBlocked = useMemo(
    () => blockedUsers.includes(id),
    [blockedUsers, id]
  );

  return (
    <ContactDropdown>
      <ContactInfo>
        {message.image ? (
          <Icon
            style={{
              backgroundImage: `url(${message.image}`,
            }}
          />
        ) : (
          <UserIcon />
        )}
        <UserNameWrapper>
          <UserName>{message.sender.slice(0, 10)}</UserName>
          {isUntrustworthy && <UntrustworthIcon />}
        </UserNameWrapper>
        <UserAddress>
          {message.sender.slice(0, 10)}...{message.sender.slice(-3)}
        </UserAddress>
      </ContactInfo>
      <MenuSection>
        <MenuItem onClick={viewProfile}>
          <ProfileSvg width={16} height={16} />
          <MenuText>View Profile</MenuText>
        </MenuItem>
        <MenuItem>
          <AddContactSvg width={16} height={16} />
          <MenuText>Send Contact Request</MenuText>
        </MenuItem>
        <MenuItem>
          <EditSvg width={16} height={16} />
          <MenuText>Rename</MenuText>
        </MenuItem>
      </MenuSection>
      <MenuSection>
        <MenuItem onClick={() => setIsUntrustworthy(!isUntrustworthy)}>
          <WarningSvg
            width={16}
            height={16}
            className={isUntrustworthy ? "" : "red"}
          />
          <MenuText className={isUntrustworthy ? "" : "red"}>
            {isUntrustworthy
              ? "Remove Untrustworthy Mark"
              : "Mark as Untrustworthy"}
          </MenuText>
        </MenuItem>

        {!userInBlocked && (
          <MenuItem
            onClick={() => {
              userInBlocked
                ? setBlockedUsers((prev) => prev.filter((e) => e != id))
                : setBlockedUsers((prev) => [...prev, id]);
              setShowMenu(false);
            }}
          >
            <BlockSvg width={16} height={16} className="red" />
            <MenuText className="red">Block User</MenuText>
          </MenuItem>
        )}
      </MenuSection>
    </ContactDropdown>
  );
}

const ContactDropdown = styled(DropdownMenu)`
  top: 20px;
  left: 0px;
  width: 222px;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MenuSection = styled.div`
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px solid ${({ theme }) => theme.inputColor};
`;

const UserNameWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const UserName = styled.p`
  color: ${({ theme }) => theme.primary};
  margin-right: 4px;

  ${textMediumStyles}
`;

const UserAddress = styled.p`
  font-size: 10px;
  line-height: 14px;
  letter-spacing: 0.2px;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.secondary};
`;
