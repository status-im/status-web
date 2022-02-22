import React from "react";
import styled from "styled-components";

type TipIconProps = {
  className?: string;
};

export const TipIcon = ({ className }: TipIconProps) => {
  return (
    <Icon
      width="26"
      height="8"
      viewBox="0 0 26 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M0.738296 -2.08325e-08L25.2617 -2.16474e-06C24.525 -2.10033e-06 23.8185 0.216311 23.2975 0.601352L13.491 7.84966C13.2198 8.05011 12.7802 8.05011 12.509 7.84966L2.70248 0.601354C2.18155 0.216314 1.47501 -8.52379e-08 0.738296 -2.08325e-08Z" />
    </Icon>
  );
};

const Icon = styled.svg`
  fill: ${({ theme }) => theme.primary};
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);

  &.read {
    left: 62%;
  }

  &.muted {
    top: -8px;
    transform: rotate(180deg) translateX(50%);
  }
`;
