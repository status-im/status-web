import { XStack } from 'tamagui'

import { Paragraph } from '../typography'

interface Props {
  name: string
  nickname?: string
  address?: string
  status?: 'verified' | 'untrustworthy' | 'contact'
  time?: string
  orientation?: 'horizontal' | 'vertical'
}

const Author = (props: Props) => {
  const { name, status, nickname, address, time } = props

  return (
    <XStack space={8} alignItems="center">
      <XStack space={4} alignItems="center">
        <Paragraph weight="semibold" variant="smaller" color="$neutral-100">
          {name}
        </Paragraph>
        {status === 'contact' && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="6" cy="6" r="5" fill="#4360DF" />
            <path
              d="M9 9.5V9.5C8.37526 8.56288 7.3235 8 6.19722 8H5.80278C4.6765 8 3.62474 8.56288 3 9.5V9.5"
              stroke="white"
              strokeLinejoin="round"
            />
            <circle cx="6" cy="6" r="4.25" stroke="#4360DF" strokeWidth="1.5" />
            <circle
              cx="6"
              cy="4.5"
              r="1.5"
              stroke="white"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {status === 'verified' && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="6" cy="6" r="5" fill="#26A69A" />
            <path
              d="M4 6.3L5.33333 7.5L8 4.5"
              stroke="white"
              strokeWidth="1.1"
            />
          </svg>
        )}
        {status === 'untrustworthy' && (
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="6" cy="6" r="5" fill="#E65F5C" />
            <path d="M6 7L6 3" stroke="white" strokeWidth="1.1" />
            <path d="M6 9L6 8" stroke="white" strokeWidth="1.1" />
          </svg>
        )}
      </XStack>

      {address && (
        <Paragraph color="$neutral-50" fontSize={11}>
          {address}
          {time && ` · ${time}`}
        </Paragraph>
      )}
    </XStack>
  )
}

export { Author }
export type { Props as AuthorProps }
