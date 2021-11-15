import React, { useState } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { useModal } from "../../contexts/modalProvider";
import { buttonStyles } from "../Buttons/buttonStyle";
import { ChannelLogo } from "../Channels/Channel";
import { AddIcon } from "../Icons/AddIcon";
import { textMediumStyles } from "../Text";

import { Modal } from "./Modal";
import { ButtonSection, Heading, Section } from "./ModalStyle";

export const EditModalName = "editModal";

export const EditModal = () => {
  const { activeChannel } = useMessengerContext();
  const [groupName, setGroupName] = useState("");
  const [image, setImage] = useState("");

  const handleChange = (e: any) => {
    if (e.target.files.length) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const { setModal } = useModal(EditModalName);

  const handleUpload = () => {
    activeChannel.icon = image;
    activeChannel.name = groupName;
    setModal(false);
  };

  return (
    <Modal name={EditModalName}>
      <Section>
        <Heading>Edit group name and image</Heading>
      </Section>

      <Section>
        <NameSection>
          <LabelGroup>
            <Label>Name the group</Label>
            <Hint>{groupName.length}/30</Hint>
          </LabelGroup>

          <NameInput
            value={groupName}
            type="text"
            placeholder="A catchy name"
            maxLength={30}
            onInput={(e) => setGroupName(e.currentTarget.value)}
          />
        </NameSection>
        <LogoSection>
          <Label>Group image</Label>
          <GroupLogo
            style={{
              backgroundImage: image
                ? `url(${image}`
                : activeChannel.icon
                ? `url(${activeChannel.icon}`
                : "",
            }}
          >
            {!activeChannel.icon &&
              !image &&
              activeChannel.name.slice(0, 1).toUpperCase()}
            <AddPictureInputWrapper>
              <AddIcon />
              <AddPictureInput
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleChange}
              />
            </AddPictureInputWrapper>
          </GroupLogo>
        </LogoSection>
      </Section>
      <ButtonSection>
        <SaveBtn onClick={handleUpload}>Save changes</SaveBtn>
      </ButtonSection>
    </Modal>
  );
};

const NameSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const LabelGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.p`
  color: ${({ theme }) => theme.primary};
  padding: 10px 0;

  ${textMediumStyles}
`;

const Hint = styled.p`
  color: ${({ theme }) => theme.secondary};
  font-size: 12px;
  line-height: 16px;
`;

const NameInput = styled.input`
  padding: 14px 70px 14px 8px;
  background: ${({ theme }) => theme.inputColor};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.inputColor};
  color: ${({ theme }) => theme.primary};
  outline: none;

  ${textMediumStyles}

  &:focus {
    outline: none;
    caret-color: ${({ theme }) => theme.notificationColor};
  }
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 8px;
`;

const GroupLogo = styled(ChannelLogo)`
  width: 128px;
  height: 128px;
  font-weight: bold;
  font-size: 80px;
  position: relative;
  align-self: center;
  margin-right: 0;
`;

const AddPictureInputWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 8px;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.tertiary};
  border-radius: 50%;
`;

const AddPictureInput = styled.input`
  position: absolute;
  top: 0;
  right: 0;
  width: 40px;
  height: 40px;
  opacity: 0;
  z-index: 2;
  cursor: pointer;
`;

const SaveBtn = styled.button`
  padding: 11px 24px;

  ${buttonStyles}

  &:hover {
    background: ${({ theme }) => theme.buttonBgHover};
  }
`;
