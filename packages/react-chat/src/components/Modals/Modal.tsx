import React, { ReactNode, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

import { Theme } from "../../styles/themes";
import { CrossIcon } from "../Icons/CrossIcon";

export interface BasicModalProps {
  isVisible: boolean;
  onClose: () => void;
  className?: string;
  theme: Theme;
}

export interface ModalProps extends BasicModalProps {
  children: ReactNode;
}

export const Modal = ({
  isVisible,
  onClose,
  children,
  className,
  theme,
}: ModalProps) => {
  const listenKeyboard = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        onClose();
      }
    },
    [onClose]
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

  return createPortal(
    <ModalView>
      <ModalOverlay onClick={onClose} theme={theme} />
      <ModalBody theme={theme} className={className}>
        <CloseButton onClick={onClose}>
          <CrossIcon theme={theme} />
        </CloseButton>
        {children}
      </ModalBody>
    </ModalView>,
    document.body
  );
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
`;
