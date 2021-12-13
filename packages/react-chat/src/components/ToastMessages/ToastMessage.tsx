import React from "react";
import styled, { keyframes } from "styled-components";

import { useToasts } from "../../contexts/toastProvider";
import { Toast } from "../../models/Toast";
import { CheckSvg } from "../Icons/CheckIcon";
import { CrossIcon } from "../Icons/CrossIcon";
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
        {toast.type !== "verification" && (
          <CheckWrapper>
            <CheckSvg width={20} height={20} className="accept" />
          </CheckWrapper>
        )}
        <ToastText>
          {toast.type === "request"
            ? "Contact Request Sent"
            : "Verification Request Sent"}
        </ToastText>
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

const CheckWrapper = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  margin-right: 12px;
  background: rgba(78, 188, 96, 0.1);
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
`;
