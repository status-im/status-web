import React, { useMemo } from "react";
import { utils } from "status-communities/dist/cjs";
import styled from "styled-components";

import {
  useIdentity,
  useNickname,
  useSetIdentity,
} from "../../contexts/identityProvider";
import { useModal } from "../../contexts/modalProvider";
import { decryptIdentity, loadEncryptedIdentity } from "../../utils";
import { buttonTransparentStyles } from "../Buttons/buttonStyle";
import { UserLogo } from "../Members/UserLogo";

import { Modal } from "./Modal";
import {
  Btn,
  ButtonSection,
  Heading,
  MiddleSection,
  Section,
  Text,
} from "./ModalStyle";
import { EmojiKey, UserAddress, UserName } from "./ProfileModal";
import { UserCreationModalName } from "./UserCreationModal";

export const ProfileFoundModalName = "ProfileFoundModal";

export function ProfileFoundModal() {
  const { setModal } = useModal(ProfileFoundModalName);
  const { setModal: setCreationModal } = useModal(UserCreationModalName);

  const identity = useIdentity();
  const setIdentity = useSetIdentity();
  const encryptedIdentity = useMemo(() => loadEncryptedIdentity(), []);
  const nickname = useNickname();

  if (identity && encryptedIdentity) {
    return (
      <Modal name={ProfileFoundModalName}>
        <Section>
          <Heading>Throwaway Profile found</Heading>
        </Section>
        <MiddleSection>
          <LogoWrapper>
            <UserLogo
              contact={{
                id: utils.bufToHex(identity.publicKey),
                customName: nickname,
                trueName: utils.bufToHex(identity.publicKey),
              }}
              radius={80}
              colorWheel={[
                ["red", 150],
                ["blue", 250],
                ["green", 360],
              ]}
            />
          </LogoWrapper>

          <UserName className="small">
            {utils.bufToHex(identity.publicKey)}
          </UserName>

          <UserAddress className="small">
            {" "}
            Chatkey: {identity.privateKey.slice(0, 10)}...
            {identity.privateKey.slice(-3)}{" "}
          </UserAddress>
          <EmojiKey>🎩🍞🥑🦍🌈📡💅🏻♣️🔔⛸👵🅱</EmojiKey>

          <Text>
            Throwaway Profile is found in your local browser’s cache. Would you
            like to load it and use it?{" "}
          </Text>
        </MiddleSection>
        <ButtonSection>
          <SkipBtn
            onClick={() => {
              setCreationModal(true);
              setModal(false);
            }}
          >
            Skip
          </SkipBtn>
          <Btn
            onClick={async () => {
              const identity = await decryptIdentity(
                encryptedIdentity,
                "noPassword"
              );
              setIdentity(identity);
              setModal(false);
            }}
          >
            Load Throwaway Profile
          </Btn>
        </ButtonSection>
      </Modal>
    );
  } else {
    return null;
  }
}

const LogoWrapper = styled.div`
  margin-bottom: 8px;
`;

const SkipBtn = styled.button`
  ${buttonTransparentStyles}
`;
