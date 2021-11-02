import React from "react";
import styled from "styled-components";

import { buttonStyles } from "../Buttons/buttonStyle";
import { textMediumStyles } from "../Text";

import { BasicModalProps, Modal } from "./Modal";
import { Heading, Section } from "./ModalStyle";

interface LinkModalProps extends BasicModalProps {
  link: string;
}

export const LinkModal = ({ isVisible, onClose, link }: LinkModalProps) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <Section>
        <Heading>Are you sure you want to visit this website?</Heading>
      </Section>
      <Section>
        <Link>{link}</Link>
      </Section>
      <ButtonSection>
        <ButtonNo onClick={onClose}>No</ButtonNo>
        <ButtonYes
          onClick={() => {
            window?.open(link, "_blank", "noopener")?.focus();
            onClose();
          }}
        >
          Yes, take me there
        </ButtonYes>
      </ButtonSection>
    </Modal>
  );
};

const Link = styled.a`
  text-decoration: none;
  word-break: break-all;
  color: ${({ theme }) => theme.primary};

  ${textMediumStyles}
`;

const ButtonSection = styled(Section)`
  display: flex;
  justify-content: flex-end;
`;

const ButtonNo = styled.button`
  padding: 11px 24px;
  margin-right: 16px;

  ${buttonStyles}
  background: ${({ theme }) => theme.buttonNoBg};
  color: ${({ theme }) => theme.redColor};

  &:hover {
    background: ${({ theme }) => theme.buttonNoBgHover};
  }
`;

const ButtonYes = styled.button`
  padding: 11px 24px;

  ${buttonStyles}

  &:hover {
    background: ${({ theme }) => theme.buttonBgHover};
  }
`;
