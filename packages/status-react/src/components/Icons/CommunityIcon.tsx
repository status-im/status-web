import React from 'react'

import styled from 'styled-components'

type CommunityIconProps = {
  width: number
  height: number
  className?: string
}

export const CommunityIcon = ({
  width,
  height,
  className,
}: CommunityIconProps) => {
  return (
    <Icon
      width={width}
      height={height}
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.6641 14C11.7686 14 12.6641 13.1046 12.6641 12C13.7686 12 14.6641 11.1046 14.6641 10V4C14.6641 2.89543 13.7686 2 12.6641 2C7.14121 2 2.66406 6.47715 2.66406 12C2.66406 13.1046 3.55949 14 4.66406 14H10.6641ZM5.16406 12C4.88792 12 4.66244 11.7755 4.67944 11.4999C4.92738 7.47997 8.14404 4.26332 12.164 4.01538C12.4396 3.99838 12.6641 4.22386 12.6641 4.5V5.5C12.6641 5.77614 12.4394 5.99783 12.1642 6.02052C9.24919 6.26094 6.925 8.58513 6.68459 11.5002C6.66189 11.7754 6.4402 12 6.16406 12H5.16406ZM12.6641 8.5C12.6641 8.22386 12.4391 7.99672 12.1651 8.03082C10.3549 8.25609 8.92015 9.69083 8.69489 11.501C8.66078 11.775 8.88792 12 9.16406 12H10.1641C10.4402 12 10.6576 11.7727 10.7258 11.5051C10.9057 10.7982 11.4622 10.2417 12.1691 10.0617C12.4367 9.99359 12.6641 9.77614 12.6641 9.5V8.5Z"
      />
    </Icon>
  )
}

const Icon = styled.svg`
  fill: ${({ theme }) => theme.secondary};

  &.green {
    fill: ${({ theme }) => theme.greenColor};
  }

  &.red {
    fill: ${({ theme }) => theme.redColor};
  }
`
