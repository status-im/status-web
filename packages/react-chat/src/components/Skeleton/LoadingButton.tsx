import React from "react";
import styled from "styled-components";

import { textSmallStyles } from "../Text";

interface LoadingButtonProps {
  loadNextDay: () => void;
  lastMessage: Date;
}

export const LoadingButton = ({
  loadNextDay,
  lastMessage,
}: LoadingButtonProps) => {
  return (
    <Button onClick={loadNextDay}>
      Last message date {lastMessage.toDateString()}
    </Button>
  );
};

const Button = styled.button`
  display: flex;
  align-self: center;
  align-items: center;
  justify-content: center;
  padding: 4px 5px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  color: ${({ theme }) => theme.primary};
  box-shadow: 0px 2px 4px rgba(0, 34, 51, 0.16),
    0px 4px 12px rgba(0, 34, 51, 0.08);
  border-radius: 8px;
  font-weight: 500;

  ${textSmallStyles}
`;
