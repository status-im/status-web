import styled, { keyframes } from "styled-components";

import { Theme } from "../../styles/themes";

interface SkeletonProps {
  theme: Theme;
  width?: string;
  height?: string;
  borderRadius?: string;
}

const waveKeyframe = keyframes`
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

export const Skeleton = styled.div<SkeletonProps>`
  position: relative;
  display: inline-block;
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "22px"};
  background: ${({ theme }) => theme.skeletonDark};
  border-radius: ${({ borderRadius }) => borderRadius || "8px"};
  margin-bottom: 5px;
  overflow: hidden;

  &::after {
    animation: ${waveKeyframe} 1.6s linear 0.5s infinite;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.skeletonLight} 0%,
      ${({ theme }) => theme.skeletonDark} 100%
    );
    content: "";
    position: absolute;
    transform: translateX(-100%);
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
  }
`;
