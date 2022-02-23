import React from 'react'
import styled from 'styled-components'

interface ReadIconProps {
  isRead?: boolean
}

export const ReadIcon = ({ isRead }: ReadIconProps) => {
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
        d="M22.863 4.42224C23.2076 4.652 23.3008 5.11765 23.071 5.4623L13.197 19.4224C13.0723 19.6094 12.8704 19.7306 12.6468 19.7527C12.4232 19.7749 12.2015 19.6956 12.0426 19.5367L6.04259 13.5367C5.7497 13.2438 5.7497 12.7689 6.04259 12.476C6.33548 12.1832 6.81036 12.1832 7.10325 12.476L12.4564 17.8291L21.8229 4.63025C22.0527 4.2856 22.5183 4.19247 22.863 4.42224Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.8545 4.38389C18.1916 4.62465 18.2696 5.09306 18.0289 5.43012L12.0514 13.7988C11.8106 14.1359 11.3422 14.214 11.0052 13.9732C10.6681 13.7325 10.59 13.2641 10.8308 12.927L16.8083 4.55828C17.049 4.22122 17.5174 4.14314 17.8545 4.38389Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.0183 12.48C1.31 12.1859 1.78487 12.184 2.07895 12.4757L8.09656 18.4446C8.39064 18.7363 8.39257 19.2112 8.10087 19.5053C7.80917 19.7994 7.3343 19.8013 7.04022 19.5096L1.02261 13.5407C0.728529 13.249 0.7266 12.7741 1.0183 12.48Z"
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
