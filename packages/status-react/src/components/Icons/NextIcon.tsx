import React from 'react'

import styled from 'styled-components'

export const NextIcon = () => {
  return (
    <Icon
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.46967 5.46967C9.76256 5.17678 10.2374 5.17678 10.5303 5.46967L16.1768 11.1161C16.6649 11.6043 16.6649 12.3957 16.1768 12.8839L10.5303 18.5303C10.2374 18.8232 9.76256 18.8232 9.46967 18.5303C9.17678 18.2374 9.17678 17.7626 9.46967 17.4697L14.5858 12.3536C14.781 12.1583 14.781 11.8417 14.5858 11.6464L9.46967 6.53033C9.17678 6.23744 9.17678 5.76256 9.46967 5.46967Z"
      />
    </Icon>
  )
}

const Icon = styled.svg`
  fill: ${({ theme }) => theme.primary};
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
`
