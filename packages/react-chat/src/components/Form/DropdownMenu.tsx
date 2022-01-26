import React, { ReactNode, useRef } from "react";
import styled from "styled-components";

import { useClickOutside } from "../../hooks/useClickOutside";
import { textSmallStyles } from "../Text";

type DropdownMenuProps = {
  children: ReactNode;
  className?: string;
  closeMenu: (val: boolean) => void;
};

export function DropdownMenu({
  children,
  className,
  closeMenu,
}: DropdownMenuProps) {
  const ref = useRef(null);
  useClickOutside(ref, () => closeMenu(false));

  return (
    <MenuBlock className={className} ref={ref}>
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
  position: relative;

  &:hover,
  &:hover > span {
    background: ${({ theme }) => theme.border};
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

  &.channel {
    top: calc(100% - 32px);
  }

  &.side {
    top: 20px;
    left: calc(100% - 35px);
    right: unset;
  }

  &.narrow {
    top: 20px;
    right: 0;
  }

  &.submenu {
    top: -8px;
    left: 100%;
    right: unset;
  }
`;

const MenuList = styled.ul`
  list-style: none;
`;
