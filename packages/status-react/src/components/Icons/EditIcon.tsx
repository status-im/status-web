import React from 'react'

import styled from 'styled-components'

type EditIconProps = {
  width: number
  height: number
  className?: string
}

export function EditIcon({ width, height, className }: EditIconProps) {
  return (
    <Icon
      width={width}
      height={height}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.7914 2.16376C11.6321 1.32302 12.9952 1.32302 13.836 2.16376C14.6767 3.00451 14.6767 4.36763 13.836 5.20838L6.0015 13.0429C5.71671 13.3276 5.36405 13.5352 4.97679 13.6458L2.1717 14.4472C1.99679 14.4972 1.80854 14.4484 1.67992 14.3198C1.55129 14.1912 1.50251 14.0029 1.55249 13.828L2.35394 11.0229C2.46459 10.6357 2.6721 10.283 2.95688 9.99823L10.7914 2.16376ZM13.1276 2.87212C12.6781 2.42258 11.9492 2.42258 11.4997 2.87212L3.66524 10.7066C3.50083 10.871 3.38103 11.0746 3.31716 11.2981C3.07579 12.1429 3.85682 12.9239 4.70159 12.6826C4.92515 12.6187 5.12874 12.4989 5.29315 12.3345L13.1276 4.50003C13.5772 4.05049 13.5772 3.32165 13.1276 2.87212Z"
      />
    </Icon>
  )
}

const Icon = styled.svg`
  fill: ${({ theme }) => theme.tertiary};

  &.grey {
    fill: ${({ theme }) => theme.secondary};
  }
`
