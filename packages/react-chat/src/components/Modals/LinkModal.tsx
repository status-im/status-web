import React from "react";
import styled from "styled-components";

import { textMediumStyles } from "../Text";

import { BasicModalProps, Modal } from "./Modal";

interface LinkModalProps extends BasicModalProps {
  link: string;
}

export const LinkModal = ({ isVisible, onClose, link }: LinkModalProps) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <Section>
        <Text>Are you sure you want to visit {link}</Text>
      </Section>
      <ButtonSection>
        <ButtonNo onClick={onClose}>No</ButtonNo>
        <ButtonYes
          onClick={() => {
            window?.open(link, "_blank", "noopener")?.focus();
            onClose();
          }}
        >
          Yes
        </ButtonYes>
      </ButtonSection>
    </Modal>
  );
};

const ButtonSection = styled.div`
  display: flex;
`;

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

const ButtonYes = styled.button`
  background-color: ${({ theme }) => theme.tertiary};
  padding: 10px;
  width: 50px;
  height: 40px;
  border-radius: 10px;
  margin: 10px;
`;

const ButtonNo = styled.button`
  background-color: ${({ theme }) => theme.secondary};
  padding: 10px;
  width: 50px;
  height: 40px;
  border-radius: 10px;
  margin: 10px;
`;
