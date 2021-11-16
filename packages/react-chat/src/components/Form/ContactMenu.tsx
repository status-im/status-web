import React, { useMemo } from "react";
import styled from "styled-components";

import { useBlockedUsers } from "../../contexts/blockedUsersProvider";
import { useFriends } from "../../contexts/friendsProvider";
import { useModal } from "../../contexts/modalProvider";
import { ChatMessage } from "../../models/ChatMessage";
import { Icon, UserAddress } from "../Chat/ChatMessages";
import { AddContactSvg } from "../Icons/AddContactIcon";
import { BlockSvg } from "../Icons/BlockIcon";
import { ChatSvg } from "../Icons/ChatIcon";
import { EditSvg } from "../Icons/EditIcon";
import { ProfileSvg } from "../Icons/ProfileIcon";
import { UntrustworthIcon } from "../Icons/UntrustworthIcon";
import { UserIcon } from "../Icons/UserIcon";
import { WarningSvg } from "../Icons/WarningIcon";
import { ProfileModalName } from "../Modals/ProfileModal";
import { textMediumStyles } from "../Text";

import { DropdownMenu, MenuItem, MenuText } from "./DropdownMenu";

type ContactMenuProps = {
  message: ChatMessage;
  setShowMenu: (val: boolean) => void;
  isUntrustworthy: boolean;
  setIsUntrustworthy: (val: boolean) => void;
  customName?: string;
  trueName?: string;
  setRenaming: (val: boolean) => void;
};

export function ContactMenu({
  message,
  setShowMenu,
  isUntrustworthy,
  setIsUntrustworthy,
  customName,
  trueName,
  setRenaming,
}: ContactMenuProps) {
  const id = message.sender;
  const { blockedUsers, setBlockedUsers } = useBlockedUsers();

  const userInBlocked = useMemo(
    () => blockedUsers.includes(id),
    [blockedUsers, id]
  );

  const { friends, setFriends } = useFriends();

  const userIsFriend = useMemo(() => friends.includes(id), [friends, id]);

  const { setModal } = useModal(ProfileModalName);

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
          <UserName>
            {customName ? customName : message.sender.slice(0, 10)}
          </UserName>
          {isUntrustworthy && <UntrustworthIcon />}
        </UserNameWrapper>
        {trueName && <UserTrueName>({trueName})</UserTrueName>}
        <UserAddress>
          {message.sender.slice(0, 10)}...{message.sender.slice(-3)}
        </UserAddress>
      </ContactInfo>
      <MenuSection>
        <MenuItem onClick={() => setModal(true)}>
          <ProfileSvg width={16} height={16} />
          <MenuText>View Profile</MenuText>
        </MenuItem>
        {!userIsFriend && (
          <MenuItem onClick={() => setFriends((prev) => [...prev, id])}>
            <AddContactSvg width={16} height={16} />
            <MenuText>Send Contact Request</MenuText>
          </MenuItem>
        )}
        {userIsFriend && (
          <MenuItem>
            <ChatSvg width={16} height={16} />
            <MenuText>Send Message</MenuText>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setModal(true);
            setRenaming(true);
          }}
        >
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

        {!userIsFriend && (
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

const UserTrueName = styled.p`
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  margin-top: 4px;
`;
