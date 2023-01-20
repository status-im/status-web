import { Contact, Untrustworthy, Verified } from '@status-im/icons/12'
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
        {status === 'contact' && <Contact />}
        {status === 'verified' && <Verified />}
        {status === 'untrustworthy' && <Untrustworthy />}
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
