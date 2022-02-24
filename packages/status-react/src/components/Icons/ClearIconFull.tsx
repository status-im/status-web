import React from 'react'

import styled from 'styled-components'

type ClearSvgFullProps = {
  width: number
  height: number
  className?: string
}

export function ClearSvgFull({ height, width, className }: ClearSvgFullProps) {
  return (
    <Icon
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM11 5C11.2441 5.24408 11.2441 5.63981 11 5.88388L8.88393 8L11 10.1161C11.2441 10.3602 11.2441 10.7559 11 11C10.756 11.2441 10.3602 11.2441 10.1162 11L8.00005 8.88389L5.88393 11C5.63985 11.2441 5.24412 11.2441 5.00005 11C4.75597 10.7559 4.75597 10.3602 5.00005 10.1161L7.11616 8L5.00005 5.88389C4.75597 5.63981 4.75597 5.24408 5.00005 5C5.24412 4.75593 5.63985 4.75593 5.88393 5L8.00005 7.11612L10.1162 5C10.3602 4.75592 10.756 4.75592 11 5Z"
      />
    </Icon>
  )
}

const Icon = styled.svg`
  fill: ${({ theme }) => theme.secondary};

  &:hover {
    fill: ${({ theme }) => theme.primary};
  }
`
