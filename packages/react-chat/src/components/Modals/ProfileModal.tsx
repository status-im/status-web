import React, { useMemo, useState } from "react";
import styled from "styled-components";

import { useBlockedUsers } from "../../contexts/blockedUsersProvider";
import { useFriends } from "../../contexts/friendsProvider";
import { copy } from "../../utils";
import { buttonStyles } from "../Buttons/buttonStyle";
import { ClearSvg } from "../Icons/ClearIcon";
import { CopySvg } from "../Icons/CopyIcon";
import { EditSvg } from "../Icons/EditIcon";
import { LeftIconSvg } from "../Icons/LeftIcon";
import { UntrustworthIcon } from "../Icons/UntrustworthIcon";
import { UserIcon } from "../Icons/UserIcon";
import { textMediumStyles } from "../Text";

import { Modal } from "./Modal";
import { ButtonSection, Heading, Section } from "./ModalStyle";

export const ProfileModalName = "profileModal";

interface ProfileModalProps {
  user: string;
  image?: string;
  renaming: boolean;
  customName?: string;
  trueName?: string;
  setRenaming: (val: boolean) => void;
  setTrueName: (val: string) => void;
  setCustomName: (val: string) => void;
}

export const ProfileModal = ({
  user,
  image,
  renaming,
  customName,
  trueName,
  setRenaming,
  setTrueName,
  setCustomName,
}: ProfileModalProps) => {
  const [isUntrustworthy, setIsUntrustworthy] = useState(false);

  const { blockedUsers, setBlockedUsers } = useBlockedUsers();

  const userInBlocked = useMemo(
    () => blockedUsers.includes(user),
    [blockedUsers, user]
  );

  const { friends, setFriends } = useFriends();

  const userIsFriend = useMemo(() => friends.includes(user), [friends, user]);

  return (
    <Modal name={ProfileModalName} className="profile">
      <Section>
        <Heading>{user.slice(0, 10)}’s Profile</Heading>
      </Section>

      <ProfileSection>
        <NameSection>
          {image ? (
            <ProfileIcon
              style={{
                backgroundImage: `url(${image}`,
              }}
            />
          ) : (
            <UserIcon />
          )}
          <UserNameWrapper>
            <UserName>{customName ? customName : user.slice(0, 10)}</UserName>
            {isUntrustworthy && <UntrustworthIcon />}
            {!renaming && (
              <button onClick={() => setRenaming(true)}>
                {" "}
                <EditSvg width={24} height={24} />
              </button>
            )}
          </UserNameWrapper>
          {trueName && <UserTrueName>{trueName}</UserTrueName>}
          {trueName && <button onClick={() => setTrueName("")}></button>}
        </NameSection>
        {renaming ? (
          <NameInputWrapper>
            <NameInput
              placeholder="Only you will see this nickname"
              value={customName}
              onChange={(e) => setCustomName(e.currentTarget.value)}
            />
            {customName && (
              <ClearBtn
                onClick={() => {
                  setCustomName("");
                  setTrueName("");
                }}
              >
                <ClearSvg width={16} height={16} className="profile" />
              </ClearBtn>
            )}
          </NameInputWrapper>
        ) : (
          <>
            <UserAddressWrapper>
              <UserAddress>Chatkey: {user.slice(0, 30)}</UserAddress>

              <CopyButton onClick={() => copy(user)}>
                <CopySvg width={24} height={24} />
              </CopyButton>
            </UserAddressWrapper>
            <EmojiKey>🎩🍞🥑🦍🌈📡💅🏻♣️🔔⛸👵🅱</EmojiKey>{" "}
          </>
        )}
      </ProfileSection>
      <ButtonSection>
        {renaming ? (
          <>
            <BackBtn onClick={() => setRenaming(false)}>
              <LeftIconSvg width={28} height={28} />
            </BackBtn>
            <Btn
              disabled={!customName}
              onClick={() => {
                setTrueName(user.slice(0, 10));
                setRenaming(false);
              }}
            >
              Apply nickname
            </Btn>
          </>
        ) : (
          <>
            {!userIsFriend && (
              <ProfileBtn
                className={userInBlocked ? "" : "red"}
                onClick={() => {
                  userInBlocked
                    ? setBlockedUsers((prev) => prev.filter((e) => e != user))
                    : setBlockedUsers((prev) => [...prev, user]);
                }}
              >
                {userInBlocked ? "Unblock" : "Block"}
              </ProfileBtn>
            )}
            {userIsFriend && (
              <ProfileBtn
                className="red"
                onClick={() =>
                  setFriends((prev) => prev.filter((e) => e != user))
                }
              >
                Remove Contact
              </ProfileBtn>
            )}
            <ProfileBtn
              className={isUntrustworthy ? "" : "red"}
              onClick={() => setIsUntrustworthy(!isUntrustworthy)}
            >
              {isUntrustworthy
                ? "Remove Untrustworthy Mark"
                : "Mark as Untrustworthy"}
            </ProfileBtn>
            {!userIsFriend && (
              <Btn onClick={() => setFriends((prev) => [...prev, user])}>
                Send Contact Request
              </Btn>
            )}
          </>
        )}
      </ButtonSection>
    </Modal>
  );
};

const ProfileSection = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NameSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`;

const ProfileIcon = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: end;
  border-radius: 50%;
  background-color: #bcbdff;
  background-size: contain;
  background-position: center;
  flex-shrink: 0;
  position: relative;
  cursor: pointer;
`;

const UserNameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;

  & > svg {
    fill: ${({ theme }) => theme.tertiary};
  }
`;

const UserName = styled.p`
  color: ${({ theme }) => theme.primary};
  font-weight: bold;
  font-size: 22px;
  line-height: 30px;
  letter-spacing: -0.2px;
  margin-right: 8px;
`;

const UserTrueName = styled.p`
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  margin-top: 8px;
`;

const UserAddressWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

const UserAddress = styled.p`
  display: flex;
  letter-spacing: 1px;
  margin-right: 8px;
  color: ${({ theme }) => theme.secondary};

  ${textMediumStyles}
`;
const EmojiKey = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 15px;
  line-height: 14px;
  letter-spacing: 0.2px;
`;

const ProfileBtn = styled.button`
  padding: 11px 24px;
  ${buttonStyles}
  background: ${({ theme }) => theme.bodyBackgroundColor};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  margin-left: 8px;

  &.red {
    color: ${({ theme }) => theme.redColor};
  }

  &.red:hover {
    background: ${({ theme }) => theme.buttonNoBgHover};
  }

  &:hover {
    background: ${({ theme }) => theme.buttonBgHover};
  }
`;

const CopyButton = styled.button`
  & > svg {
    fill: ${({ theme }) => theme.tertiary};
  }
`;

const Btn = styled.button`
  padding: 11px 24px;
  margin-left: 8px;
  ${buttonStyles}

  &:hover {
    background: ${({ theme }) => theme.buttonBgHover};
  }

  &:disabled {
    background: ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.secondary};
  }
`;

const BackBtn = styled(Btn)`
  position: absolute;
  left: 16px;
  top: 16px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  padding: 8px;
  margin-left: 0;

  & > svg {
    fill: ${({ theme }) => theme.tertiary};
  }
`;

const ClearBtn = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;

  & > svg {
    fill: ${({ theme }) => theme.secondary};
  }
`;

const NameInputWrapper = styled.div`
  position: relative;
`;

const NameInput = styled.input`
  width: 328px;
  padding: 11px 16px;
  background: ${({ theme }) => theme.inputColor};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.primary};
  outline: none;

  ${textMediumStyles}

  &:focus {
    outline: 1px solid ${({ theme }) => theme.tertiary};
    caret-color: ${({ theme }) => theme.notificationColor};
  }
`;
