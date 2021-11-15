import React, { ReactNode, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

import { useModal } from "../../contexts/modalProvider";
import { CrossIcon } from "../Icons/CrossIcon";

export interface BasicModalProps {
  name: string;
  className?: string;
}

export interface ModalProps extends BasicModalProps {
  children: ReactNode;
}

export const Modal = ({ name, children, className }: ModalProps) => {
  const { isVisible, setModal } = useModal(name);

  const listenKeyboard = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setModal(false);
      }
    },
    [setModal]
  );

  useEffect(() => {
    if (isVisible) {
      window.addEventListener("keydown", listenKeyboard, true);
      return () => {
        window.removeEventListener("keydown", listenKeyboard, true);
      };
    }
  }, [isVisible, listenKeyboard]);

  if (!isVisible) return null;

  const element = document.getElementById("modal-root");

  if (element) {
    return createPortal(
      <ModalView>
        <ModalOverlay onClick={() => setModal(false)} />
        <ModalBody className={className}>
          <CloseButton onClick={() => setModal(false)} className={className}>
            <CrossIcon />
          </CloseButton>
          {children}
        </ModalBody>
      </ModalView>,
      element
    );
  }
  return null;
};

const ModalView = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
`;

const ModalBody = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  max-width: 480px;
  width: 100%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.bodyBackgroundColor};
  border-radius: 8px;
  overflow-y: auto;

  &.picture {
    max-width: 820px;
    border-radius: 0;
  }

  &.profile {
    max-width: 640px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.primary};
  opacity: 0.4;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 10px;

  &.picture {
    display: none;
  }
`;
