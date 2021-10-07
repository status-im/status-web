import React from "react";
import styled from "styled-components";

import { Theme } from "../../styles/themes";
import { LoadingIcon } from "../Icons/LoadingIcon";
import { textSmallStyles } from "../Text";

interface LoadingProps {
  theme: Theme;
}

export const Loading = ({ theme }: LoadingProps) => {
  return (
    <LoadingBlock theme={theme}>
      <LoadingIcon theme={theme} />
      <LoadingText>Loading messages...</LoadingText>
    </LoadingBlock>
  );
};

const LoadingBlock = styled.div<LoadingProps>`
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  bottom: -35px;
  transform: translateX(-50%);
  padding: 4px 5px 4px 7px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  color: ${({ theme }) => theme.primary};
  box-shadow: 0px 2px 4px rgba(0, 34, 51, 0.16),
    0px 4px 12px rgba(0, 34, 51, 0.08);
  border-radius: 8px;
`;

const LoadingText = styled.p<LoadingProps>`
  color: ${({ theme }) => theme.primary};
  margin-left: 8px;
  font-weight: 500;

  ${textSmallStyles}
`;
