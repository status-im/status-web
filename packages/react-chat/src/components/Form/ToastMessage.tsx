import React from "react";
import styled from "styled-components";

import { CheckSvg } from "../Icons/CheckIcon";
import { CrossIcon } from "../Icons/CrossIcon";
import { textSmallStyles } from "../Text";

type ToastMessageProps = {
  message: string;
  className?: string;
};

export function ToastMessage({ message, className }: ToastMessageProps) {
  return (
    <ToastWrapper className={className}>
      <ToastBlock>
        <CheckWrapper>
          <CheckSvg width={20} height={20} className="accept" />
        </CheckWrapper>
        <ToastText>{message}</ToastText>
      </ToastBlock>
      <CrossIcon />
    </ToastWrapper>
  );
}

const ToastWrapper = styled.div`
  width: 343px;
  position: absolute;
  bottom: 56px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  box-shadow: 0px 2px 4px rgba(0, 34, 51, 0.16),
    0px 4px 12px rgba(0, 34, 51, 0.08);
  border-radius: 8px;
`;

const ToastBlock = styled.div`
  color: ${({ theme }) => theme.primary};
`;

const ToastText = styled.p`
  font-weight: 500;
  ${textSmallStyles};
`;

const CheckWrapper = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
`;
