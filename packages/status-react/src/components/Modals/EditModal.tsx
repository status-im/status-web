import React, { useState } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { useModal } from "../../contexts/modalProvider";
import { buttonStyles } from "../Buttons/buttonStyle";
import { ChannelLogo } from "../Channels/ChannelIcon";
import { inputStyles } from "../Form/inputStyles";
import { AddIcon } from "../Icons/AddIcon";
import { textMediumStyles } from "../Text";

import { Modal } from "./Modal";
import {
  AddWrapper,
  ButtonSection,
  Heading,
  Hint,
  Section,
} from "./ModalStyle";

export const EditModalName = "editModal";

export const EditModal = () => {
  const { activeChannel, changeGroupChatName } = useMessengerContext();
  const { setModal } = useModal(EditModalName);

  const [groupName, setGroupName] = useState("");
  const [image, setImage] = useState("");

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (e.currentTarget?.files?.length) {
      setImage(URL.createObjectURL(e.currentTarget.files[0]));
    }
  };

  const handleUpload = () => {
    if (activeChannel) {
      if (image) {
        activeChannel.icon = image; // Need function to send image to waku
        setImage("");
      }
      if (groupName) {
        changeGroupChatName(groupName, activeChannel.id);
        setGroupName("");
      }
      setModal(false);
    }
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
          <GroupLogo icon={activeChannel?.icon}>
            {!activeChannel?.icon &&
              !image &&
              activeChannel?.name?.slice(0, 1)?.toUpperCase()}
            {image && <LogoPreview src={image} />}
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

const NameInput = styled.input`
  padding: 14px 70px 14px 8px;

  ${inputStyles}
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

const LogoPreview = styled.img`
  width: 128px;
  height: 128px;
  border-radius: 50%;
`;

const AddPictureInputWrapper = styled(AddWrapper)`
  top: 0;
  right: 8px;
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
`;
