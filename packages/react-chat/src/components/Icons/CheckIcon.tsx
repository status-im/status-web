import React from "react";
import styled from "styled-components";

interface CheckIconProps {
  isHovered:
    | boolean
    | {
        onMouseOver(): void;
        onMouseOut(): void;
      };
}

export const CheckIcon = ({ isHovered }: CheckIconProps) => {
  return (
    <Icon
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={isHovered ? "isHovered" : ""}
    >
      <path d="M11.0826 5.61085C11.2358 5.38108 11.1737 5.07065 10.9439 4.91747C10.7142 4.7643 10.4037 4.82638 10.2506 5.05615L6.58887 10.5487L5.02014 8.97994C4.82488 8.78468 4.50829 8.78468 4.31303 8.97994C4.11777 9.17521 4.11777 9.49179 4.31303 9.68705L6.31303 11.687C6.41895 11.793 6.56679 11.8458 6.71585 11.8311C6.86492 11.8163 6.99952 11.7355 7.08261 11.6108L11.0826 5.61085Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.99992 14.6668C4.31802 14.6668 1.33325 11.6821 1.33325 8.00016C1.33325 4.31826 4.31802 1.3335 7.99992 1.3335C11.6818 1.3335 14.6666 4.31826 14.6666 8.00016C14.6666 11.6821 11.6818 14.6668 7.99992 14.6668ZM7.99992 13.6668C4.8703 13.6668 2.33325 11.1298 2.33325 8.00016C2.33325 4.87055 4.8703 2.3335 7.99992 2.3335C11.1295 2.3335 13.6666 4.87055 13.6666 8.00016C13.6666 11.1298 11.1295 13.6668 7.99992 13.6668Z"
      />
    </Icon>
  );
};

const Icon = styled.svg`
  & > path {
    fill: ${({ theme }) => theme.tertiary};
  }

  &.isHovered > path {
    fill: ${({ theme }) => theme.bodyBackgroundColor};
  }
`;
