import { ContactIcon, UntrustworthyIcon, VerifiedIcon } from '@status-im/icons'
import { XStack } from 'tamagui'

import { Text } from '../text'

import type { TextProps } from '../text'

type Props = {
  name: string
  size?: Extract<TextProps['size'], 13 | 15>
  nickname?: string
  status?: 'verified' | 'untrustworthy' | 'contact'
  address?: string
  time?: string
}

const Author = (props: Props) => {
  const { name, size = 13, nickname, status, address, time } = props

  return (
    <XStack gap={8} alignItems="center">
      <XStack gap={4} alignItems="center">
        <Text size={size} weight="semibold">
          {name}
        </Text>

        {nickname && (
          <Text size={11} color="$neutral-60">
            · {nickname}
          </Text>
        )}
        {status === 'contact' && <ContactIcon size={12} />}
        {status === 'verified' && (
          <VerifiedIcon size={12} color="$success-50" />
        )}
        {status === 'untrustworthy' && <UntrustworthyIcon size={12} />}
      </XStack>

      {(address || time) && (
        <XStack gap={4} alignItems="center">
          {address && (
            <Text size={11} color="$neutral-50" type="monospace">
              {address}
            </Text>
          )}
          {time && (
            <Text size={11} color="$neutral-50">
              · {time}
            </Text>
          )}
        </XStack>
      )}
    </XStack>
  )
}

export { Author }
export type { Props as AuthorProps }
