import React from "react";
import styled from "styled-components";

import { Theme } from "../../styles/themes";

export const CrossIcon = ({ theme }: { theme: Theme }) => (
  <Icon
    theme={theme}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 4.57404L1.72275 0.296796C1.32616 -0.0997918 0.689941 -0.0975927 0.296174 0.296174C-0.100338 0.692686 -0.0973145 1.32864 0.296796 1.72275L4.57404 6L0.296796 10.2772C-0.0997918 10.6738 -0.0975927 11.3101 0.296174 11.7038C0.692686 12.1003 1.32864 12.0973 1.72275 11.7032L6 7.42596L10.2772 11.7032C10.6738 12.0998 11.3101 12.0976 11.7038 11.7038C12.1003 11.3073 12.0973 10.6714 11.7032 10.2772L7.42596 6L11.7032 1.72275C12.0998 1.32616 12.0976 0.689941 11.7038 0.296174C11.3073 -0.100338 10.6714 -0.0973145 10.2772 0.296796L6 4.57404Z"
      fill="black"
    />
  </Icon>
);

const Icon = styled.svg`
  & > path {
    fill: ${({ theme }) => theme.primary};
  }
`;
