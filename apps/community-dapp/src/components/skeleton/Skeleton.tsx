import styled, { keyframes } from 'styled-components'

interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
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
`

export const Skeleton = styled.div<SkeletonProps>`
  position: relative;
  display: inline-block;
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '12px'};
  background: #eeeeee;
  border-radius: ${({ borderRadius }) => borderRadius || '10px'};
  overflow: hidden;

  &::after {
    animation: ${waveKeyframe} 1.6s linear 0.5s infinite;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    content: '';
    position: absolute;
    transform: translateX(-100%);
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
  }
`
