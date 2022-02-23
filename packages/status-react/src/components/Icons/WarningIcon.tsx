import React from "react";
import styled from "styled-components";

type WarningSvgProps = {
  width: number;
  height: number;
  className?: string;
};

export function WarningSvg({ width, height, className }: WarningSvgProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M8.00065 4.16732C8.27679 4.16732 8.50065 4.39118 8.50065 4.66732V9.33398C8.50065 9.61013 8.27679 9.83398 8.00065 9.83398C7.72451 9.83398 7.50065 9.61013 7.50065 9.33398V4.66732C7.50065 4.39118 7.72451 4.16732 8.00065 4.16732Z" />
      <path d="M8.00065 12.5007C8.46089 12.5007 8.83399 12.1276 8.83399 11.6673C8.83399 11.2071 8.46089 10.834 8.00065 10.834C7.54041 10.834 7.16732 11.2071 7.16732 11.6673C7.16732 12.1276 7.54041 12.5007 8.00065 12.5007Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.33398 8.00065C1.33398 11.6825 4.31875 14.6673 8.00065 14.6673C11.6825 14.6673 14.6673 11.6825 14.6673 8.00065C14.6673 4.31875 11.6826 1.33398 8.00065 1.33398C4.31875 1.33398 1.33398 4.31875 1.33398 8.00065ZM2.33398 8.00065C2.33398 11.1303 4.87104 13.6673 8.00065 13.6673C11.1303 13.6673 13.6673 11.1303 13.6673 8.00065C13.6673 4.87104 11.1303 2.33398 8.00065 2.33398C4.87104 2.33398 2.33398 4.87104 2.33398 8.00065Z"
      />
    </svg>
  );
}

export const WarningIcon = () => {
  return <Icon width={16} height={16} />;
};

const Icon = styled(WarningSvg)`
  & > path {
    fill: ${({ theme }) => theme.tertiary};
  }

  &.red > path {
    fill: ${({ theme }) => theme.redColor};
  }

  &:hover > path {
    fill: ${({ theme }) => theme.bodyBackgroundColor};
  }
`;
