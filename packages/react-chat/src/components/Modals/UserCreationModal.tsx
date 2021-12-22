import React, { useState } from "react";
import { Identity } from "status-communities/dist/cjs";
import styled from "styled-components";

import {
  useIdentity,
  useSetIdentity,
  useSetNikcname,
} from "../../contexts/identityProvider";
import { useModal } from "../../contexts/modalProvider";
import { Contact } from "../../models/Contact";
import { NameInput } from "../../styles/Inputs";
import { AddIcon } from "../Icons/AddIcon";
import { ChainIcon } from "../Icons/ChainIcon";
import { LeftIconSvg } from "../Icons/LeftIcon";
import { UserLogo } from "../Members/UserLogo";

import { Modal } from "./Modal";
import {
  AddWrapper,
  BackBtn,
  Btn,
  ButtonSection,
  Heading,
  Hint,
  Section,
  Text,
} from "./ModalStyle";
import { EmojiKey, UserAddress } from "./ProfileModal";

export const UserCreationModalName = "UserCreationModal";

export function UserCreationModal() {
  const identity = useIdentity();
  const setIdentity = useSetIdentity();
  const setNickname = useSetNikcname();

  const [customNameInput, setCustomNameInput] = useState("");
  const [nextStep, setNextStep] = useState(false);
  const { setModal } = useModal(UserCreationModalName);
  return (
    <Modal name={UserCreationModalName}>
      <Section>
        <Heading>Create a Status Profile</Heading>
      </Section>
      <MiddleSection className={`${!nextStep && "initial"}`}>
        {nextStep ? (
          <Title>Your emojihash and identicon ring</Title>
        ) : (
          <Title>Your profile</Title>
        )}
        {nextStep ? (
          <StyledHint>
            {" "}
            This set of emojis and coloured ring around your avatar are unique
            and represent your chat key, so your friends can easily distinguish
            you from potential impersonators.
          </StyledHint>
        ) : (
          <StyledHint>
            Longer and unusual names are better as they are <br /> less likely
            to be used by someone else.
          </StyledHint>
        )}

        <LogoWrapper>
          <UserLogo
            contact={{ trueName: customNameInput } as Contact}
            radius={80}
            colorWheel={[
              ["red", 150],
              ["blue", 250],
              ["green", 360],
            ]}
          />
          {!nextStep && (
            <AddIconWrapper>
              <AddIcon />
            </AddIconWrapper>
          )}
        </LogoWrapper>
        {!nextStep && (
          <NameInput
            placeholder="Display name"
            value={customNameInput}
            onChange={(e) => setCustomNameInput(e.currentTarget.value)}
          />
        )}
        {nextStep && identity && (
          <>
            <UserAddress>
              {" "}
              Chatkey: {identity.privateKey.slice(0, 10)}...
              {identity.privateKey.slice(-3)}{" "}
            </UserAddress>
            <ChainIcons>
              <ChainIcon className="transformed" />
              <ChainIcon />
            </ChainIcons>
            <UserAttributes>
              <EmojiKey>🎩🍞🥑🦍🌈📡💅🏻♣️🔔⛸👵🅱</EmojiKey>
              <UserLogo
                contact={{ trueName: customNameInput } as Contact}
                radius={40}
                colorWheel={[
                  ["red", 150],
                  ["blue", 250],
                  ["green", 360],
                ]}
              />
            </UserAttributes>
          </>
        )}
      </MiddleSection>
      <ButtonSection>
        <BackBtn onClick={() => setModal(false)}>
          <LeftIconSvg width={28} height={28} />
        </BackBtn>
        <Btn
          onClick={() => {
            nextStep
              ? setModal(false)
              : (setIdentity(Identity.generate()),
                setNickname(customNameInput),
                setNextStep(true));
          }}
          disabled={!customNameInput}
        >
          Next
        </Btn>
      </ButtonSection>
    </Modal>
  );
}

const MiddleSection = styled(Section)`
  height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &.initial {
    padding: 32px;
  }
`;

const Title = styled(Text)`
  font-weight: bold;
  font-size: 22px;
  line-height: 30px;
  letter-spacing: -0.2px;
  margin-bottom: 16px;
`;

const StyledHint = styled(Hint)`
  font-size: 15px;
  line-height: 22px;
  margin-bottom: 32px;
  text-align: center;
`;

const LogoWrapper = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 32px;
`;

const AddIconWrapper = styled(AddWrapper)`
  top: 0;
  right: -50%;
  transform: translateX(-50%);
`;

const ChainIcons = styled.div`
  width: 104px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
`;

const UserAttributes = styled.div`
  width: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;
