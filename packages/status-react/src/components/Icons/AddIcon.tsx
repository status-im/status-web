import React from 'react'

import styled from 'styled-components'

export const AddIcon = () => {
  return (
    <Icon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 5.25C12.4142 5.25 12.75 5.58579 12.75 6V10.75C12.75 11.0261 12.9739 11.25 13.25 11.25H18C18.4142 11.25 18.75 11.5858 18.75 12C18.75 12.4142 18.4142 12.75 18 12.75H13.25C12.9739 12.75 12.75 12.9739 12.75 13.25V18C12.75 18.4142 12.4142 18.75 12 18.75C11.5858 18.75 11.25 18.4142 11.25 18V13.25C11.25 12.9739 11.0261 12.75 10.75 12.75H6C5.58579 12.75 5.25 12.4142 5.25 12C5.25 11.5858 5.58579 11.25 6 11.25H10.75C11.0261 11.25 11.25 11.0261 11.25 10.75V6C11.25 5.58579 11.5858 5.25 12 5.25Z" />
    </Icon>
  )
}

const Icon = styled.svg`
  & > path {
    fill: ${({ theme }) => theme.bodyBackgroundColor};
  }
`
