import {
  ContactIcon,
  UntrustworthyIcon,
  VerifiedIcon,
} from '@status-im/icons/12'
import { XStack } from 'tamagui'

import { Text } from '../text'

interface Props {
  name: string
  nickname?: string
  address?: string
  status?: 'verified' | 'untrustworthy' | 'contact'
  time?: string
  orientation?: 'horizontal' | 'vertical'
}

const Author = (props: Props) => {
  const { name, status, address, time } = props

  return (
    <XStack space={8} alignItems="center">
      <XStack space={4} alignItems="center">
        <Text size={13} weight="semibold">
          {name}
        </Text>
        {status === 'contact' && <ContactIcon />}
        {status === 'verified' && <VerifiedIcon />}
        {status === 'untrustworthy' && <UntrustworthyIcon />}
      </XStack>

      {address && (
        <Text size={11} color="$neutral-50">
          {address}
          {time && ` · ${time}`}
        </Text>
      )}
    </XStack>
  )
}

export { Author }
export type { Props as AuthorProps }
