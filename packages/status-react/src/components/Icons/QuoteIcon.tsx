import React from 'react'
import styled from 'styled-components'

type QuoteProps = {
  width: number
  height: number
}

export function QuoteSvg({ width, height }: QuoteProps) {
  return (
    <Icon
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.47619 69L1.05641 9.05601C1.02532 4.61595 4.61605 1 9.05622 1H21"
        strokeOpacity="0.4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  )
}

const Icon = styled.svg`
  & > path {
    stroke: ${({ theme }) => theme.secondary};
  }
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
`
