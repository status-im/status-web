import React from 'react'
import styled from 'styled-components'

import { TipIcon } from '../Icons/TipIcon'
import { textSmallStyles } from '../Text'

type TooltipProps = {
  tip: string
  className?: string
}

export function Tooltip({ tip, className }: TooltipProps) {
  return (
    <TooltipWrapper className={className}>
      <TooltipBlock>
        <TooltipText>{tip}</TooltipText>
        <TipIcon className={className} />
      </TooltipBlock>
    </TooltipWrapper>
  )
}

const TooltipWrapper = styled.div`
  width: max-content;
  position: absolute;
  top: calc(-100% - 12px);
  left: 50%;
  transform: translateX(-50%);
  visibility: hidden;

  &.read {
    left: 18%;
  }

  &.muted {
    top: calc(100% + 8px);
    z-index: 10;
  }
`
const TooltipBlock = styled.div`
  background: ${({ theme }) => theme.primary};
  border-radius: 8px;
  position: relative;
  padding: 8px;
`

const TooltipText = styled.p`
  font-weight: 500;
  color: ${({ theme }) => theme.bodyBackgroundColor};
  ${textSmallStyles};
`
