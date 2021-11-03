import React, { useState } from "react";
import styled from "styled-components";

import { ChannelData } from "../../models/ChannelData";
import { uintToImgUrl } from "../../utils/uintToImgUrl";
import { buttonStyles } from "../Buttons/buttonStyle";
import { ChannelLogo } from "../Channels/Channel";
import { AddIcon } from "../Icons/AddIcon";
import { textMediumStyles } from "../Text";

import { BasicModalProps, Modal } from "./Modal";
import { Heading, Section } from "./ModalStyle";

interface EditModalProps extends BasicModalProps {
  channel: ChannelData;
}

export const EditModal = ({ isVisible, onClose, channel }: EditModalProps) => {
  const [groupName, setGroupName] = useState("");
  const [imageUint, setImageUint] = useState<undefined | Uint8Array>(undefined);
  const [showSizeLimit, setShowSizeLimit] = useState(false);

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
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
              backgroundImage: channel.icon
                ? `url(${channel.icon}`
                : imageUint
                ? uintToImgUrl(imageUint)
                : "",
            }}
          >
            {!channel.icon && channel.name.slice(0, 1).toUpperCase()}
            <AddPictureInputWrapper>
              <AddIcon />
              <AddPictureInput
                type="file"
                multiple={true}
                accept="image/png, image/jpeg"
                onChange={(e) => {
                  const fileReader = new FileReader();
                  fileReader.onloadend = (s) => {
                    const arr = new Uint8Array(s.target?.result as ArrayBuffer);
                    setImageUint(arr);
                  };

                  if (e?.target?.files?.[0]) {
                    if (e.target.files[0].size < 1024 * 1024) {
                      fileReader.readAsArrayBuffer(e.target.files[0]);
                    } else {
                      setShowSizeLimit(true);
                    }
                  }
                }}
              />
            </AddPictureInputWrapper>
          </GroupLogo>
          {showSizeLimit && <Label>File size must be less than 1MB</Label>}
        </LogoSection>
      </Section>
      <ButtonSection>
        <SaveBtn>Save changes</SaveBtn>
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

const ButtonSection = styled(Section)`
  display: flex;
  justify-content: flex-end;
`;

const SaveBtn = styled.button`
  padding: 11px 24px;

  ${buttonStyles}

  &:hover {
    background: ${({ theme }) => theme.buttonBgHover};
  }
`;
