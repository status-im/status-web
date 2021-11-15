import React from "react";
import styled from "styled-components";

import { copy } from "../../utils";
import { buttonStyles } from "../Buttons/buttonStyle";
import { CopySvg } from "../Icons/CopyIcon";
import { EditSvg } from "../Icons/EditIcon";
import { UntrustworthIcon } from "../Icons/UntrustworthIcon";
import { UserIcon } from "../Icons/UserIcon";
import { textMediumStyles } from "../Text";

import { Modal } from "./Modal";
import { ButtonSection, Heading, Section } from "./ModalStyle";

export const ProfileModalName = "profileModal";

interface ProfileModalProps {
  user: string;
  image?: string;
  isUntrustworthy: boolean;
  setIsUntrustworthy: (val: boolean) => void;
}

export const ProfileModal = ({
  user,
  image,
  isUntrustworthy,
  setIsUntrustworthy,
}: ProfileModalProps) => {
  return (
    <Modal name={ProfileModalName} className="profile">
      <Section>
        <Heading>{user.slice(0, 10)}’s Profile</Heading>
      </Section>

      <Section>
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
            <UserName>{user.slice(0, 10)}</UserName>
            {isUntrustworthy && <UntrustworthIcon />}
            <EditSvg width={24} height={24} />
          </UserNameWrapper>
        </NameSection>

        <UserAddressWrapper>
          <UserAddress>Chatkey: {user.slice(0, 30)}</UserAddress>

          <CopyButton onClick={() => copy(user)}>
            <CopySvg width={24} height={24} />
          </CopyButton>
        </UserAddressWrapper>

        <EmojiKey>🎩🍞🥑🦍🌈📡💅🏻♣️🔔⛸👵🅱</EmojiKey>
      </Section>
      <ButtonSection>
        <ProfileBtn className="red">Remove Contact</ProfileBtn>
        <ProfileBtn
          className={isUntrustworthy ? "" : "red"}
          onClick={() => setIsUntrustworthy(!isUntrustworthy)}
        >
          {isUntrustworthy
            ? "Remove Untrustworthy Mark"
            : "Mark as Untrustworthy"}
        </ProfileBtn>
      </ButtonSection>
    </Modal>
  );
};

const NameSection = styled.div`
  display: flex;
  flex-direction: column;
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

  &:hover {
    background: ${({ theme }) => theme.buttonBgHover};
  }
`;

const CopyButton = styled.button`
  & > svg {
    fill: ${({ theme }) => theme.tertiary};
  }
`;
