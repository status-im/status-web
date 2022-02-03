import React, { ReactNode } from "react";
import styled from "styled-components";

import { textSmallStyles } from "../Text";

type DropdownMenuProps = {
  children: ReactNode;
  className?: string;
  style?: { top: number; left: number };
  menuRef?: React.MutableRefObject<null>;
  id?: string;
};

export function DropdownMenu({
  children,
  className,
  style,
  menuRef,
  id,
}: DropdownMenuProps) {
  return (
    <MenuBlock className={className} style={style} ref={menuRef} id={id}>
      <MenuList>{children}</MenuList>
    </MenuBlock>
  );
}

const MenuBlock = styled.div`
  width: 207px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  box-shadow: 0px 2px 4px rgba(0, 34, 51, 0.16),
    0px 4px 12px rgba(0, 34, 51, 0.08);
  border-radius: 8px;
  padding: 8px 0;
  position: absolute;
  z-index: 2;
`;

const MenuList = styled.ul`
  list-style: none;
`;

export const MenuItem = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px 8px 8px 14px;
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
  position: relative;

  &:hover,
  &:hover > span {
    background: ${({ theme }) => theme.border};
  }

  &.picker:hover {
    background: ${({ theme }) => theme.bodyBackgroundColor};
  }

  & > svg.red {
    fill: ${({ theme }) => theme.redColor};
  }
`;

export const MenuText = styled.span`
  margin-left: 6px;
  color: ${({ theme }) => theme.primary};

  &.red {
    color: ${({ theme }) => theme.redColor};
  }

  ${textSmallStyles}
`;

export const MenuSection = styled.div`
  padding: 4px 0;
  margin: 4px 0;
  border-top: 1px solid ${({ theme }) => theme.inputColor};
  border-bottom: 1px solid ${({ theme }) => theme.inputColor};

  &.channel {
    padding: 0;
    margin: 0;
    border: none;
  }

  &.message {
    padding: 4px 0 0;
    margin: 4px 0 0;
    border-bottom: none;
  }
`;
