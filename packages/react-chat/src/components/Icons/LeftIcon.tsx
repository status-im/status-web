import React from "react";
import styled from "styled-components";

type LeftIconProps = {
  width: number;
  height: number;
  className?: string;
};

export function LeftIcon({ width, height, className }: LeftIconProps) {
  return (
    <Icon
      width={width}
      height={height}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M7.01957 4.35355C7.21483 4.15829 7.21483 3.84171 7.01957 3.64645C6.82431 3.45118 6.50772 3.45118 6.31246 3.64645L2.31246 7.64645C2.1172 7.84171 2.1172 8.15829 2.31246 8.35355L6.31246 12.3536C6.50772 12.5488 6.82431 12.5488 7.01957 12.3536C7.21483 12.1583 7.21483 11.8417 7.01957 11.6464L4.44216 9.06904C4.23217 8.85905 4.38089 8.5 4.67786 8.5H13.3327C13.6088 8.5 13.8327 8.27614 13.8327 8C13.8327 7.72386 13.6088 7.5 13.3327 7.5H4.67786C4.38089 7.5 4.23217 7.14095 4.44216 6.93096L7.01957 4.35355Z" />
    </Icon>
  );
}

const Icon = styled.svg`
  fill: ${({ theme }) => theme.tertiary};

  &.black {
    fill: ${({ theme }) => theme.primary};
  }

  &.red {
    fill: ${({ theme }) => theme.redColor};
  }
`;
