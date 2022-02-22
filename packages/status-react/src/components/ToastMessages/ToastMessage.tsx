import React from "react";
import styled, { keyframes } from "styled-components";

import { useToasts } from "../../contexts/toastProvider";
import { Toast } from "../../models/Toast";
import { Column } from "../CommunityIdentity";
import { CheckIcon } from "../Icons/CheckIcon";
import { CommunityIcon } from "../Icons/CommunityIcon";
import { CrossIcon } from "../Icons/CrossIcon";
import { ProfileIcon } from "../Icons/ProfileIcon";
import { textSmallStyles } from "../Text";

export function AnimationToastMessage() {
  return keyframes`
    0% { 
      opacity: 0;
      transform: translateY(-100%); }
    100% { 
      opacity: 1;
      transform: translateY(0); }
`;
}

type ToastMessageProps = {
  toast: Toast;
};

export function ToastMessage({ toast }: ToastMessageProps) {
  const { setToasts } = useToasts();

  const closeToast = () => {
    setToasts((prev) => prev.filter((e) => e != toast));
  };

  return (
    <ToastWrapper>
      <ToastBlock>
        {toast.type === "confirmation" && (
          <IconWrapper className="green">
            <CheckIcon width={20} height={20} className="green" />
          </IconWrapper>
        )}
        {toast.type === "incoming" && (
          <IconWrapper className="blue">
            <ProfileIcon width={20} height={20} />
          </IconWrapper>
        )}
        {(toast.type === "approvement" || toast.type === "rejection") && (
          <IconWrapper
            className={toast.type === "approvement" ? "green" : "red"}
          >
            <CommunityIcon
              width={20}
              height={19}
              className={toast.type === "approvement" ? "green" : "red"}
            />
          </IconWrapper>
        )}
        <Column>
          <ToastText>{toast.text}</ToastText>
          {toast.request && <ToastRequest>{toast.request}</ToastRequest>}
        </Column>
      </ToastBlock>
      <CloseButton onClick={closeToast}>
        <CrossIcon />
      </CloseButton>
    </ToastWrapper>
  );
}

const ToastWrapper = styled.div`
  width: 343px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-top: 8px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  box-shadow: ${({ theme }) => theme.shadow};
  border-radius: 8px;
  animation: ${AnimationToastMessage} 2s ease;
`;

const ToastBlock = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.primary};
`;

const ToastText = styled.p`
  font-weight: 500;
  ${textSmallStyles};
`;

const ToastRequest = styled(ToastText)`
  width: 243px;
  color: ${({ theme }) => theme.secondary};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const IconWrapper = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-right: 12px;

  &.green {
    background: ${({ theme }) => theme.greenBg};
  }

  &.blue {
    background: ${({ theme }) => theme.blueBg};
  }

  &.red {
    background: ${({ theme }) => theme.buttonNoBg};
  }
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
`;
