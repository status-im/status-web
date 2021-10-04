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
    <ChannelsWrapper theme={theme}>
      <ChannelsTopbar>
        <Wrapper>
          <GoBackBtn onClick={onClick}>
            <BackIcon theme={theme} />
          </GoBackBtn>
          {children}
        </Wrapper>
      </ChannelsTopbar>
    </ChannelsWrapper>
  );
}

interface ThemeProps {
  theme: Theme;
}

const ChannelsWrapper = styled.div<ThemeProps>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bodyBackgroundColor};
  padding: 18px;
`;

const ChannelsTopbar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 14px 4px;
`;

const Wrapper = styled.div`
  display: flex;
`;

const GoBackBtn = styled.button`
  width: 24px;
  height: 24px;
  margin-right: 18px;
`;
