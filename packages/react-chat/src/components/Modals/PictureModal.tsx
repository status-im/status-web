import React from "react";
import styled from "styled-components";

import { Modal } from "./Modal";

export const PictureModalName = "PictureModal";

interface PictureModalProps {
  image: string;
}

export const PictureModal = ({ image }: PictureModalProps) => {
  return (
    <Modal name={PictureModalName} className="picture">
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
