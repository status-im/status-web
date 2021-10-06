import React from "react";
import styled from "styled-components";

import { Theme } from "../../styles/themes";

interface NarrowTopbarProps {
  theme: Theme;
  list: string;
  community: string;
}

export function NarrowTopbar({ theme, list, community }: NarrowTopbarProps) {
  return (
    <TopbarWrapper theme={theme}>
      <Heading theme={theme}>{list}</Heading>
      <SubHeading theme={theme}>{community}</SubHeading>
    </TopbarWrapper>
  );
}

interface ThemeProps {
  theme: Theme;
}

const TopbarWrapper = styled.div<ThemeProps>`
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  background-color: ${({ theme }) => theme.bodyBackgroundColor};
  padding: 14px 0;
  position: relative;
`;

const Heading = styled.p<ThemeProps>`
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
`;

const SubHeading = styled.p<ThemeProps>`
  font-weight: 500;
  color: ${({ theme }) => theme.secondary};
`;
