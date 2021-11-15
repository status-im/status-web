import React, { ReactNode } from "react";
import styled from "styled-components";

import { textSmallStyles } from "../Text";

type DropdownMenuProps = {
  children: ReactNode;
  className?: string;
};

export function DropdownMenu({ children, className }: DropdownMenuProps) {
  return (
    <MenuBlock className={className}>
      <MenuList>{children}</MenuList>
    </MenuBlock>
  );
}

export const MenuItem = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px 8px 8px 14px;
  cursor: pointer;
  color: ${({ theme }) => theme.primary};

  &:hover,
  &:hover > span {
    background: ${({ theme }) => theme.tertiary};
    color: ${({ theme }) => theme.bodyBackgroundColor};
  }

  & > svg {
    fill: ${({ theme }) => theme.tertiary};
  }

  & > svg.red {
    fill: ${({ theme }) => theme.redColor};
  }

  &:hover > svg {
    fill: ${({ theme }) => theme.bodyBackgroundColor};
  }
`;

export const MenuText = styled.span`
  margin-left: 6px;
  color: ${({ theme }) => theme.tertiary};

  &.red {
    color: ${({ theme }) => theme.redColor};
  }

  ${textSmallStyles}
`;

const MenuBlock = styled.div`
  width: 207px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  box-shadow: 0px 2px 4px rgba(0, 34, 51, 0.16),
    0px 4px 12px rgba(0, 34, 51, 0.08);
  border-radius: 8px;
  padding: 8px 0;
  position: absolute;
  right: 8px;
  top: calc(100% - 8px);
  z-index: 2;
`;

const MenuList = styled.ul`
  list-style: none;
`;
