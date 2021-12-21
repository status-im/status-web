import React, { useState } from "react";
import { Identity } from "status-communities/dist/cjs";
import styled from "styled-components";

import {
  useSetIdentity,
  useSetNikcname,
} from "../../contexts/identityProvider";
import { useModal } from "../../contexts/modalProvider";
import { NameInput } from "../../styles/Inputs";
import { LeftIconSvg } from "../Icons/LeftIcon";
import { UserLogo } from "../Members/UserLogo";

import { Modal } from "./Modal";
import {
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
        <Content>
          <Title>Your profile</Title>
          <StyledHint>
            Longer and unusual names are better as they are less likely to be
            used by someone else.
          </StyledHint>
          <LogoWrapper>
            <UserLogo
              text={customNameInput.slice(0, 2)}
              radius={80}
              colorWheel={[
                ["red", 150],
                ["blue", 250],
                ["green", 360],
              ]}
            />
          </LogoWrapper>
          <NameInput
            placeholder="Display name"
            value={customNameInput}
            onChange={(e) => setCustomNameInput(e.currentTarget.value)}
          />
        </Content>
      </MiddleSection>
      <ButtonSection style={{ marginBottom: "40px" }}>
        <BackBtn onClick={() => setModal(false)}>
          <LeftIconSvg width={28} height={28} />
        </BackBtn>
        <Btn
          onClick={() => {
            setIdentity(Identity.generate());
            setNickname(customNameInput);
            setModal(false);
          }}
        >
          Next
        </Btn>
      </ButtonSection>
    </Modal>
  );
}

const MiddleSection = styled(Section)`
  margin-bottom: 102px;
`;

const LogoWrapper = styled.div`
  position: relative;
  display: flex;
  margin-top: 32px;
  margin-bottom: 38px;
`;

const StyledHint = styled(Hint)`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 22px;
  text-align: center;
`;

const Title = styled(Text)`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 22px;
  line-height: 30px;

  text-align: center;
  letter-spacing: -0.2px;
  margin-bottom: 16px;
`;

const Content = styled.div`
  margin-top: 16px;
  margin-left: 65px;
  margin-right: 65px;
`;
