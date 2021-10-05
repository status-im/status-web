import React from "react";
import styled from "styled-components";

import { Theme } from "../../styles/themes";

interface ThemeProps {
  theme: Theme;
}

export const BackIcon = ({ theme }: ThemeProps) => {
  return (
    <Icon
      width="18"
      height="14"
      viewBox="0 0 18 14"
      xmlns="http://www.w3.org/2000/svg"
      theme={theme}
    >
      <path
        d="M7.53033 1.53033C7.82322 1.23744 7.82322 0.762563 7.53033 0.46967C7.23744 0.176777 6.76256 0.176777 6.46967 0.46967L0.46967 6.46967C0.176777 6.76256 0.176777 7.23744 0.46967 7.53033L6.46967 13.5303C6.76256 13.8232 7.23744 13.8232 7.53033 13.5303C7.82322 13.2374 7.82322 12.7626 7.53033 12.4697L3.66421 8.60355C3.34923 8.28857 3.57232 7.75 4.01777 7.75H17C17.4142 7.75 17.75 7.41421 17.75 7C17.75 6.58579 17.4142 6.25 17 6.25H4.01777C3.57231 6.25 3.34923 5.71143 3.66421 5.39645L7.53033 1.53033Z"
        fill="black"
      />
    </Icon>
  );
};

const Icon = styled.svg<ThemeProps>`
  & > path {
    fill: ${({ theme }) => theme.primary};
  }
`;
