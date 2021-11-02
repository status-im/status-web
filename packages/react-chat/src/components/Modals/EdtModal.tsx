import React, { useState } from "react";
import styled from "styled-components";
// import { ChannelData } from '../../models/ChannelData';

import { ChannelLogo } from "../Channels/Channel";

import { BasicModalProps, Modal } from "./Modal";
import { Heading, Hint, Label, Section } from "./ModalStyle";

// interface EditModalProps extends BasicModalProps {
//   channel: ChannelData;
// }

export const EditModal = ({ isVisible, onClose }: BasicModalProps) => {
  const [groupName, setGroupName] = useState("");

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <Section>
        <Heading>Are you sure you want to visit this website?</Heading>
      </Section>

      <Section>
        <NameSection>
          <LabelGroup>
            <Label>Name the group</Label>
            <Hint>0/30</Hint>
          </LabelGroup>

          <NameInput
            value={groupName}
            placeholder="A catchy name"
            onInput={(e) => setGroupName(e.currentTarget.value)}
          />
        </NameSection>
        <LogoSection>
          <Label>Group image</Label>
          <GroupLogo></GroupLogo>
          <AddBtn></AddBtn>
        </LogoSection>
      </Section>
    </Modal>
  );
};

const NameSection = styled(Section)`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const LabelGroup = styled(Section)`
  display: flex;
  justify-content: center;
`;
const NameInput = styled.input`
  padding: 14px 70px 14px 8px;
  background: ${({ theme }) => theme.inputColor};
  border-radius: 8px;
`;

const LogoSection = styled(Section)`
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;
  position: relative;
`;

const GroupLogo = styled(ChannelLogo)`
  width: 128px;
  height: 128px;
  font-weight: bold;
  font-size: 80px;
`;

const AddBtn = styled.button`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.tertiary};
  position: absolute;
  top: 0;
  right: 8px;
`;
