import React from "react";
import styled from "styled-components";

import { LoadingIcon } from "../Icons/LoadingIcon";
import { textSmallStyles } from "../Text";

export const Loading = () => {
  return (
    <LoadingBlock>
      <LoadingIcon />
      <LoadingText>Loading messages...</LoadingText>
    </LoadingBlock>
  );
};

const LoadingBlock = styled.div`
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
  z-index: 2;
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.primary};
  margin-left: 8px;
  font-weight: 500;

  ${textSmallStyles}
`;
