import React from 'react'

import styled from 'styled-components'

interface ReadMessageIconProps {
  isRead?: boolean
}

export const ReadMessageIcon = ({ isRead }: ReadMessageIconProps) => {
  return (
    <Icon
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${isRead && 'read'}`}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.7751 5.57055C21.1415 5.90642 21.1662 6.47573 20.8304 6.84214L10.2605 18.3729C10.0946 18.5539 9.862 18.6592 9.61658 18.6646C9.37116 18.6699 9.13421 18.5747 8.96064 18.4012L3.19524 12.6358C2.84377 12.2843 2.84377 11.7145 3.19524 11.363C3.54672 11.0115 4.11656 11.0115 4.46804 11.363L9.1995 16.0945C9.40079 16.2957 9.72928 16.2886 9.92163 16.0788L19.5035 5.62584C19.8394 5.25943 20.4087 5.23468 20.7751 5.57055Z"
      />
    </Icon>
  )
}

const Icon = styled.svg`
  fill: ${({ theme }) => theme.tertiary};

  &.read {
    fill: ${({ theme }) => theme.secondary};
  }
`
