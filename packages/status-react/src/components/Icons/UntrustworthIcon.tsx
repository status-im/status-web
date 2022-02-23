import React from "react";
import styled from "styled-components";

export const UntrustworthIcon = () => {
  return (
    <Icon
      width="11"
      height="10"
      viewBox="0 0 11 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="5.5" cy="5" r="5" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.28125 7.65625C6.28125 8.08772 5.93147 8.4375 5.5 8.4375C5.06853 8.4375 4.71875 8.08772 4.71875 7.65625C4.71875 7.22478 5.06853 6.875 5.5 6.875C5.93147 6.875 6.28125 7.22478 6.28125 7.65625ZM5.5 1.875C5.15482 1.875 4.875 2.15482 4.875 2.5V5.3125C4.875 5.65768 5.15482 5.9375 5.5 5.9375C5.84518 5.9375 6.125 5.65768 6.125 5.3125V2.5C6.125 2.15482 5.84518 1.875 5.5 1.875Z"
        fill="white"
      />
    </Icon>
  );
};

const Icon = styled.svg`
  & > circle {
    fill: ${({ theme }) => theme.redColor};
  }
`;
