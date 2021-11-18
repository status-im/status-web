import React, { useMemo } from "react";
import { bufToHex } from "status-communities/dist/cjs/utils";
import styled from "styled-components";

import { useFriends } from "../../contexts/friendsProvider";
import { useIdentity } from "../../contexts/identityProvider";
import { useModal } from "../../contexts/modalProvider";
import { useManageContact } from "../../hooks/useManageContact";
import { UserAddress } from "../Chat/ChatMessages";
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
  id: string;
  setShowMenu: (val: boolean) => void;
};

export function ContactMenu({ id, setShowMenu }: ContactMenuProps) {
  const identity = useIdentity();
  const isUser = useMemo(
    () => id === bufToHex(identity.publicKey),
    [id, identity]
  );

  const { setModal } = useModal(ProfileModalName);
  const { friends, setFriends } = useFriends();

  const userIsFriend = useMemo(() => friends.includes(id), [friends, id]);
  const { contact, setBlocked, setIsUntrustworthy } = useManageContact(id);

  if (!contact) return null;
  return (
    <ContactDropdown>
      <ContactInfo>
        <UserIcon />
        <UserNameWrapper>
          <UserName>{contact.customName ?? id.slice(0, 10)}</UserName>
          {contact.isUntrustworthy && <UntrustworthIcon />}
        </UserNameWrapper>
        {contact.customName && (
          <UserTrueName>({contact.trueName})</UserTrueName>
        )}
        <UserAddress>
          {id.slice(0, 10)}...{id.slice(-3)}
        </UserAddress>
      </ContactInfo>
      <MenuSection>
        <MenuItem
          onClick={() => {
            setModal({ id, renamingState: false });
          }}
        >
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
            setModal({ id, renamingState: true });
          }}
        >
          <EditSvg width={16} height={16} />
          <MenuText>Rename</MenuText>
        </MenuItem>
      </MenuSection>
      <MenuSection>
        <MenuItem onClick={() => setIsUntrustworthy(!contact.isUntrustworthy)}>
          <WarningSvg
            width={16}
            height={16}
            className={contact.isUntrustworthy ? "" : "red"}
          />
          <MenuText className={contact.isUntrustworthy ? "" : "red"}>
            {contact.isUntrustworthy
              ? "Remove Untrustworthy Mark"
              : "Mark as Untrustworthy"}
          </MenuText>
        </MenuItem>

        {!userIsFriend && !isUser && (
          <MenuItem
            onClick={() => {
              setBlocked(!contact.blocked);
              setShowMenu(false);
            }}
          >
            <BlockSvg width={16} height={16} className="red" />
            <MenuText className="red">
              {contact.blocked ? "Unblock User" : "Block User"}
            </MenuText>
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
