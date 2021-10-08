import React from "react";
import styled from "styled-components";

import { BasicModalProps, Modal } from "./Modal";

interface PictureModalProps extends BasicModalProps {
  image: string;
}

export const PictureModal = ({
  isVisible,
  onClose,
  image,
}: PictureModalProps) => {
  return (
    <Modal isVisible={isVisible} onClose={onClose} className="picture">
      <ModalImageWrapper>
        <ModalImage src={image}></ModalImage>
      </ModalImageWrapper>
    </Modal>
  );
};

const ModalImageWrapper = styled.div`
  display: flex;
  max-width: 820px;
  max-height: 820px;
`;

const ModalImage = styled.img`
  width: 100%;
  height: 100%;
`;
