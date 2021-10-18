import React from "react";
import styled from "styled-components";

import { buttonStyles } from "../Buttons/buttonStyle";
import { textMediumStyles } from "../Text";

import { BasicModalProps, Modal } from "./Modal";

interface LinkModalProps extends BasicModalProps {
  link: string;
}

export const LinkModal = ({ isVisible, onClose, link }: LinkModalProps) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <Section>
        <Question>Are you sure you want to visit this website?</Question>
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

const Section = styled.div`
  padding: 16px;

  & + & {
    border-top: 1px solid ${({ theme }) => theme.border};
  }
`;

const Question = styled.p`
  color: ${({ theme }) => theme.primary};
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
`;

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
  background: rgba(255, 45, 85, 0.1);
  color: #ff2d55;
`;

const ButtonYes = styled.button`
  padding: 11px 24px;

  ${buttonStyles}
`;
