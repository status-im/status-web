import React from "react";
import styled from "styled-components";

import { LeftIconSvg } from "../Icons/LeftIcon";

interface BackButtonProps {
  onBtnClick: () => void;
}

export function BackButton({ onBtnClick }: BackButtonProps) {
  return (
    <BackBtn onClick={onBtnClick}>
      <LeftIconSvg width={24} height={24} className="black" />
    </BackBtn>
  );
}

const BackBtn = styled.button`
  position: absolute;
  left: 0;
  top: 8px;
  width: 32px;
  height: 32px;
  padding: 0;
`;
