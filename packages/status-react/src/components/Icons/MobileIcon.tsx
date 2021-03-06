import React from 'react'

import styled from 'styled-components'

export const MobileIcon = () => {
  return (
    <Icon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 18.5C12.8284 18.5 13.5 17.8284 13.5 17C13.5 16.1716 12.8284 15.5 12 15.5C11.1716 15.5 10.5 16.1716 10.5 17C10.5 17.8284 11.1716 18.5 12 18.5Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 6C5 3.79086 6.79086 2 9 2H15C17.2091 2 19 3.79086 19 6V18C19 20.2091 17.2091 22 15 22H9C6.79086 22 5 20.2091 5 18V6ZM6.5 6C6.5 4.61929 7.61929 3.5 9 3.5H15C16.3807 3.5 17.5 4.61929 17.5 6V18C17.5 19.3807 16.3807 20.5 15 20.5H9C7.61929 20.5 6.5 19.3807 6.5 18V6Z"
      />
    </Icon>
  )
}

const Icon = styled.svg`
  fill: ${({ theme }) => theme.tertiary};
`
