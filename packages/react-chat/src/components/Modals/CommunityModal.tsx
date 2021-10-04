import React from "react";
import styled from "styled-components";

import { DownloadButton } from "../Buttons/DownloadButton";
import {
  CommunityIdentity,
  CommunityIdentityProps,
} from "../CommunityIdentity";
import { CopyInput } from "../Form/CopyInput";
import { StatusLogo } from "../Icons/StatusLogo";
import { textMediumStyles, textSmallStyles } from "../Text";

import { BasicModalProps, Modal } from "./Modal";

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
  theme,
}: CommunityModalProps) => {
  return (
    <Modal theme={theme} isVisible={isVisible} onClose={onClose}>
      <Section theme={theme}>
        <CommunityIdentity
          theme={theme}
          icon={icon}
          name={name}
          subtitle={subtitle}
        />
      </Section>
      <Section theme={theme}>
        <Text theme={theme}>{description}</Text>
      </Section>
      <Section theme={theme}>
        <CopyInput
          theme={theme}
          value={publicKey}
          label="Community public key"
        />
        <Hint theme={theme}>
          To access this community, paste community public key in Status desktop
          or mobile app
        </Hint>
      </Section>
      <BottomSection theme={theme}>
        <StatusLogo theme={theme} />
        <DownloadButton theme={theme} />
      </BottomSection>
    </Modal>
  );
};

const Section = styled.div`
  padding: 20px 16px;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.border};
  }
`;

const Text = styled.p`
  color: ${({ theme }) => theme.primary};

  ${textMediumStyles}
`;

const Hint = styled.p`
  margin-top: 16px;
  color: ${({ theme }) => theme.secondary};

  ${textSmallStyles}
`;

const BottomSection = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
