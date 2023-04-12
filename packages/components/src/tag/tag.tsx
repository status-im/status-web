import { Stack, styled } from '@tamagui/core'

import { Text } from '../text'

import type { TextProps } from '../text'

type Props = {
  size: 32 | 24
  emoji?: string
  label?: string
  selected?: boolean
  disabled?: boolean
}

// todo?: export this map from text
const textSizes: Record<NonNullable<Props['size']>, TextProps['size']> = {
  '32': 15,
  '24': 13,
}

const Tag = (props: Props) => {
  const { size, emoji, label, selected, disabled } = props

  return (
    <Base
      size={size}
      selected={selected}
      disabled={disabled}
      emojiOnly={Boolean(emoji && !label)}
    >
      {/* todo: twemoji loading and parsing provider/script */}
      {emoji && <Text size={textSizes[size]}>{emoji}</Text>}
      {label && (
        <Text size={textSizes[size]} weight="medium">
          {label}
        </Text>
      )}
    </Base>
  )
}

const Base = styled(Stack, {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '$neutral-20',
  borderRadius: '$full',

  variants: {
    size: {
      32: {
        height: 32,
        minWidth: 32,
        paddingHorizontal: 12,
        gap: 6,
      },
      24: {
        height: 24,
        minWidth: 24,
        paddingHorizontal: 8,
        gap: 5,
      },
    },

    selected: {
      true: {
        backgroundColor: '$primary-50-opa-10',
        borderColor: '$primary-50',
      },
    },

    disabled: {
      true: {
        opacity: 0.3,
        cursor: 'default',
      },
    },

    emojiOnly: {
      true: {
        paddingHorizontal: 0,
      },
    },
  },
})

export { Tag }
