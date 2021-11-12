import React from "react";
import styled from "styled-components";

import { useModal } from "../../contexts/modalProvider";
import { buttonStyles } from "../Buttons/buttonStyle";
import { textMediumStyles } from "../Text";

import { Modal } from "./Modal";
import { ButtonSection, Heading, Section } from "./ModalStyle";

export const LinkModalName = "LinkModal";

interface LinkModalProps {
  link: string;
}

export const LinkModal = ({ link }: LinkModalProps) => {
  const { setModal } = useModal(LinkModalName);
  return (
    <Modal name={LinkModalName}>
      <Section>
        <Heading>Are you sure you want to visit this website?</Heading>
      </Section>
      <Section>
        <Link>{link}</Link>
      </Section>
      <ButtonSection>
        <ButtonNo onClick={() => setModal(false)}>No</ButtonNo>
        <ButtonYes
          onClick={() => {
            window?.open(link, "_blank", "noopener")?.focus();
            setModal(false);
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
