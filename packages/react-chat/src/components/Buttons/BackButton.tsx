import React from "react";
import styled from "styled-components";

import { LeftIcon } from "../Icons/LeftIcon";

interface BackButtonProps {
  onBtnClick: () => void;
  className?: string;
}

export function BackButton({ onBtnClick, className }: BackButtonProps) {
  return (
    <BackBtn onClick={onBtnClick} className={className}>
      <LeftIcon width={24} height={24} className="black" />
    </BackBtn>
  );
}

const BackBtn = styled.button`
  position: absolute;
  left: 0;
  top: 8px;
  width: 32px;
  height: 44px;
  padding: 0;

  &.narrow {
    position: static;
    margin-right: 13px;
  }
`;
