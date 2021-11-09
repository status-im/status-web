import React, { useMemo } from "react";
import styled from "styled-components";

import { useBlockedUsers } from "../../contexts/blockedUsersProvider";
import { ChatMessage } from "../../models/ChatMessage";
import { Icon } from "../Chat/ChatMessages";
import { AddContactSvg } from "../Icons/AddContactIcon";
import { BlockSvg } from "../Icons/BlockIcon";
import { EgitGroupSvg } from "../Icons/EditGroupIcon";
import { ProfileSvg } from "../Icons/ProfileIcon";
import { UserIcon } from "../Icons/UserIcon";
import { WarningSvg } from "../Icons/WarningIcon";
import { textMediumStyles } from "../Text";

import { DropdownMenu, MenuItem, MenuText } from "./DropdownMenu";

type ContactMenuProps = {
  message: ChatMessage;
  setShowMenu: (val: boolean) => void;
};

export function ContactMenu({ message, setShowMenu }: ContactMenuProps) {
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
        <UserName>{message.sender.slice(0, 10)}</UserName>
      </ContactInfo>
      <MenuSection>
        <MenuItem>
          <ProfileSvg width={16} height={16} />
          <MenuText>View Profile</MenuText>
        </MenuItem>
        <MenuItem>
          <AddContactSvg width={16} height={16} />
          <MenuText>Send Contact Request</MenuText>
        </MenuItem>
        <MenuItem>
          <EgitGroupSvg width={16} height={16} />
          <MenuText>Rename</MenuText>
        </MenuItem>
      </MenuSection>
      <MenuSection>
        <MenuItem>
          <WarningSvg width={16} height={16} className="red" />
          <MenuText className="red">Mark as Untrustworthy</MenuText>
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

const UserName = styled.p`
  color: ${({ theme }) => theme.primary};

  ${textMediumStyles}
`;
