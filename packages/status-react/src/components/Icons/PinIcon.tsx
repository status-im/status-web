import React from 'react'

import styled from 'styled-components'

type PinIconProps = {
  width: number
  height: number
  className?: string
}

export function PinIcon({ width, height, className }: PinIconProps) {
  return (
    <Icon
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M14.8956 7.28455C14.8956 6.45612 14.2474 5.60892 13.4478 5.39227C12.6482 5.17563 12 5.67157 12 6.5C12 7.32843 12.6482 8.17563 13.4478 8.39227C14.2474 8.60892 14.8956 8.11297 14.8956 7.28455Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C8.68629 2 6 4.68629 6 8C6 10.9077 8.06835 13.3323 10.814 13.8828C11.0613 13.9324 11.25 14.1429 11.25 14.3951L11.25 21C11.25 21.4142 11.5858 21.75 12 21.75C12.4142 21.75 12.75 21.4142 12.75 21L12.75 14.3951C12.75 14.1429 12.9387 13.9324 13.186 13.8828C15.9317 13.3323 18 10.9077 18 8C18 4.68629 15.3137 2 12 2ZM7.5 8C7.5 10.4853 9.51472 12.5 12 12.5C14.4853 12.5 16.5 10.4853 16.5 8C16.5 5.51472 14.4853 3.5 12 3.5C9.51472 3.5 7.5 5.51472 7.5 8Z"
      />
    </Icon>
  )
}

const Icon = styled.svg`
  fill: ${({ theme }) => theme.secondary};

  &.menu {
    fill: ${({ theme }) => theme.tertiary};
  }

  &.small {
    width: 14px;
    height: 14px;
  }
`
