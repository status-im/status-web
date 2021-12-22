import React, { useState } from "react";
import { Identity } from "status-communities/dist/cjs";
import styled from "styled-components";

import {
  useSetIdentity,
  useSetNikcname,
} from "../../contexts/identityProvider";
import { useModal } from "../../contexts/modalProvider";
import { Contact } from "../../models/Contact";
import { NameInput } from "../../styles/Inputs";
import { AddIcon } from "../Icons/AddIcon";
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

export const UserCreationModalName = "UserCreationModal";

export function UserCreationModal() {
  const setIdentity = useSetIdentity();
  const setNickname = useSetNikcname();

  const [customNameInput, setCustomNameInput] = useState("");
  const { setModal } = useModal(UserCreationModalName);
  return (
    <Modal name={UserCreationModalName}>
      <Section>
        <Heading>Create a Status Profile</Heading>
      </Section>
      <MiddleSection>
        <Title>Your profile</Title>
        <StyledHint>
          Longer and unusual names are better as they are <br /> less likely to
          be used by someone else.
        </StyledHint>
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
          <AddIconWrapper>
            <AddIcon />
          </AddIconWrapper>
        </LogoWrapper>
        <NameInput
          placeholder="Display name"
          value={customNameInput}
          onChange={(e) => setCustomNameInput(e.currentTarget.value)}
        />
      </MiddleSection>
      <ButtonSection>
        <BackBtn onClick={() => setModal(false)}>
          <LeftIconSvg width={28} height={28} />
        </BackBtn>
        <Btn
          onClick={() => {
            setIdentity(Identity.generate());
            setNickname(customNameInput);
            setModal(false);
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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  margin-bottom: 102px;
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
