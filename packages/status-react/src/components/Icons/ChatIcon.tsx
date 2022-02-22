import React from 'react'
import styled from 'styled-components'

type ChatSvgProps = {
  width: number
  height: number
}

export function ChatSvg({ width, height }: ChatSvgProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.69922 7.99922C1.69922 4.51983 4.51983 1.69922 7.99922 1.69922C11.4786 1.69922 14.2992 4.51983 14.2992 7.99922V11.9992C14.2992 13.2695 13.2695 14.2992 11.9992 14.2992H7.99922C4.51983 14.2992 1.69922 11.4786 1.69922 7.99922ZM7.99922 3.19922C5.34825 3.19922 3.19922 5.34825 3.19922 7.99922C3.19922 10.6502 5.34825 12.7992 7.99922 12.7992H11.9992C12.441 12.7992 12.7992 12.441 12.7992 11.9992V7.99922C12.7992 5.34825 10.6502 3.19922 7.99922 3.19922Z"
      />
    </svg>
  )
}

export const ChatIcon = () => {
  return <Icon width={16} height={16} />
}

const Icon = styled(ChatSvg)`
  & > path {
    fill: ${({ theme }) => theme.tertiary};
  }

  &:hover > path {
    fill: ${({ theme }) => theme.bodyBackgroundColor};
  }
`
