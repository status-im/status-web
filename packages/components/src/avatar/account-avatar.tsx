import { type ColorTokens, Stack, styled } from '@tamagui/core'

import type { RadiusTokens } from '../tokens'

type EmojiSize = 14 | 16 | 20 | 24 | 28 | 32 | 48

type Props = {
  emoji: string
  backgroundColor?: ColorTokens
  size?: 20 | 24 | 28 | 32 | 48 | 80
  shape: 'circle' | 'rounded'
}

const textSizes: Record<NonNullable<Props['size']>, EmojiSize> = {
  '80': 48,
  '48': 32,
  '32': 24,
  '28': 20,
  '24': 16,
  '20': 14,
}

const borderRadiusSizes: Record<NonNullable<Props['size']>, RadiusTokens> = {
  80: '$16',
  48: '$12',
  32: '$10',
  28: '$8',
  24: '$8',
  20: '$6',
}

const AccountAvatar = (props: Props) => {
  const { emoji, backgroundColor = '$blue-50-opa-20', size = 32, shape } = props
  return (
    <Base
      backgroundColor={backgroundColor}
      size={size}
      borderRadius={shape === 'circle' ? '$full' : borderRadiusSizes[size]}
    >
      {emoji}
    </Base>
  )
}

const Base = styled(Stack, {
  justifyContent: 'center',
  alignItems: 'center',
  display: 'inline-flex',

  variants: {
    size: {
      '...': (size: number) => {
        return {
          width: size,
          height: size,
          fontSize: textSizes[size as NonNullable<Props['size']>],
        }
      },
    },
  },
})

export { AccountAvatar }
export type { Props as AccountAvatarProps }
