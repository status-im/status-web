import React from "react";
import styled from "styled-components";

interface GroupIconProps {
  activeView?: boolean;
}

export const GroupIcon = ({ activeView }: GroupIconProps) => {
  return (
    <Icon
      width="14"
      height="10"
      viewBox="0 0 14 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${activeView && "active"}`}
    >
      <path d="M7 4.5C8.24265 4.5 9.25 3.49264 9.25 2.25C9.25 1.00736 8.24265 0 7 0C5.75736 0 4.75 1.00736 4.75 2.25C4.75 3.49264 5.75736 4.5 7 4.5Z" />
      <path d="M3.12343 9.01012C3.56395 7.27976 5.13252 6 7 6C8.86749 6 10.4361 7.27976 10.8766 9.01012C11.0128 9.54533 10.5523 10 10 10H4C3.44772 10 2.98718 9.54533 3.12343 9.01012Z" />
      <path d="M3.5 4.25C3.5 5.2165 2.7165 6 1.75 6C0.783502 6 0 5.2165 0 4.25C0 3.2835 0.783502 2.5 1.75 2.5C2.7165 2.5 3.5 3.2835 3.5 4.25Z" />
      <path d="M12.25 6C13.2165 6 14 5.2165 14 4.25C14 3.2835 13.2165 2.5 12.25 2.5C11.2835 2.5 10.5 3.2835 10.5 4.25C10.5 5.2165 11.2835 6 12.25 6Z" />
    </Icon>
  );
};

const Icon = styled.svg`
  fill: ${({ theme }) => theme.secondary};

  &.active {
    fill: ${({ theme }) => theme.primary};
  }
`;
