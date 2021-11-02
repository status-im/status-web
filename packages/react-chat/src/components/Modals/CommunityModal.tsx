import React from "react";
import styled from "styled-components";

import { useNarrow } from "../../contexts/narrowProvider";
import { DownloadButton } from "../Buttons/DownloadButton";
import {
  CommunityIdentity,
  CommunityIdentityProps,
} from "../CommunityIdentity";
import { CopyInput } from "../Form/CopyInput";
import { StatusLogo } from "../Icons/StatusLogo";

import { BasicModalProps, Modal } from "./Modal";
import { Hint, Section, Text } from "./ModalStyle";

interface CommunityModalProps extends BasicModalProps, CommunityIdentityProps {
  description: string;
  publicKey: string;
}

export const CommunityModal = ({
  isVisible,
  onClose,
  icon,
  name,
  subtitle,
  description,
  publicKey,
}: CommunityModalProps) => {
  const narrow = useNarrow();

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <Section>
        <CommunityIdentity icon={icon} name={name} subtitle={subtitle} />
      </Section>
      <Section>
        <Text>{description}</Text>
      </Section>
      <Section>
        <CopyInput value={publicKey} label="Community public key" />
        <Hint>
          To access this community, paste community public key in Status desktop
          or mobile app.
          {narrow && <StyledDownloadButton />}
        </Hint>
      </Section>
      {!narrow && (
        <BottomSection>
          <StatusLogo />
          <DownloadButton />
        </BottomSection>
      )}
    </Modal>
  );
};

const BottomSection = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledDownloadButton = styled(DownloadButton)`
  display: inline;
  padding: 0;
  margin-left: 4px;
  background: none;
  font-size: 13px;
  line-height: 18px;
  text-decoration: underline;
  color: ${({ theme }) => theme.secondary};
`;
