import React, { ReactNode } from "react";
import styled from "styled-components";

import { Theme } from "../styles/themes";

import { BackIcon } from "./Icons/BackIcon";

interface NarrowTopbarProps {
  theme: Theme;
  children: ReactNode;
  onClick: () => void;
}

export function NarrowTopbar({ theme, children, onClick }: NarrowTopbarProps) {
  return (
    <TopbarWrapper theme={theme}>
      <GoBackBtn onClick={onClick}>
        <BackIcon theme={theme} />
      </GoBackBtn>

      <HeadingWrapper>{children}</HeadingWrapper>
    </TopbarWrapper>
  );
}

interface ThemeProps {
  theme: Theme;
}

const TopbarWrapper = styled.div<ThemeProps>`
  display: flex;
  justify-content: center;
  background-color: ${({ theme }) => theme.bodyBackgroundColor};
  padding: 14px 0;
  position: relative;
`;

const HeadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const GoBackBtn = styled.button`
  width: 24px;
  height: 24px;
  margin-right: 18px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`;
