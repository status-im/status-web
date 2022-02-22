import React from "react";
import styled from "styled-components";

type BlockSvgProps = {
  width: number;
  height: number;
  className?: string;
};

export function BlockSvg({ width, height, className }: BlockSvgProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.00065 14.6673C4.31875 14.6673 1.33398 11.6825 1.33398 8.00065C1.33398 4.31875 4.31875 1.33398 8.00065 1.33398C11.6826 1.33398 14.6673 4.31875 14.6673 8.00065C14.6673 11.6826 11.6825 14.6673 8.00065 14.6673ZM3.91306 11.3811C3.77473 11.5195 3.54679 11.5099 3.43096 11.3523C2.74134 10.4136 2.33398 9.2547 2.33398 8.00065C2.33398 4.87104 4.87104 2.33398 8.00065 2.33398C9.2547 2.33398 10.4136 2.74135 11.3523 3.43096C11.5099 3.54679 11.5195 3.77473 11.3811 3.91306L3.91306 11.3811ZM4.62017 12.0882C4.48183 12.2266 4.49138 12.4545 4.64904 12.5703C5.58769 13.26 6.7466 13.6673 8.00065 13.6673C11.1303 13.6673 13.6673 11.1303 13.6673 8.00065C13.6673 6.7466 13.26 5.58769 12.5703 4.64904C12.4545 4.49138 12.2266 4.48183 12.0882 4.62017L4.62017 12.0882Z"
      />
    </svg>
  );
}

export const BlockIcon = () => {
  return <Icon width={16} height={16} />;
};

const Icon = styled(BlockSvg)`
  & > path {
    fill: ${({ theme }) => theme.redColor};
  }

  &:hover > path {
    fill: ${({ theme }) => theme.bodyBackgroundColor};
  }
`;
