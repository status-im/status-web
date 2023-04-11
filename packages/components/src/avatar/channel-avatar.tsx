import { LockedIcon, UnlockedIcon } from '@status-im/icons/12'
import { type ColorTokens, Stack, styled, Text } from '@tamagui/core'

type Props = {
  emoji: string
  color?: ColorTokens
  background?: ColorTokens
  size: 32 | 24 | 20
  lock?: 'locked' | 'unlocked' | 'none'
}

const emojiSizes: Record<Props['size'], number> = {
  32: 14,
  24: 13,
  20: 11,
}

// https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=399-20709&t=kX5LC5OYFnSF8BiZ-11
const ChannelAvatar = (props: Props) => {
  const { emoji, background = '$blue-50-opa-20', size, lock = 'none' } = props

  return (
    <Base size={size} backgroundColor={background}>
      {lock !== 'none' && (
        <LockBase variant={size}>
          {lock === 'locked' ? <LockedIcon /> : <UnlockedIcon />}
        </LockBase>
      )}

      <Text fontSize={emojiSizes[size]}>{emoji}</Text>
    </Base>
  )
}

export { ChannelAvatar }
export type { Props as ChannelAvatarProps }

const Base = styled(Stack, {
  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',

  variants: {
    size: {
      '...': (size: number) => {
        return {
          width: size,
          height: size,
          borderRadius: size / 2,
        }
      },
    },
  },
})

const LockBase = styled(Stack, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 16,
  height: 16,
  backgroundColor: '$white-100',
  position: 'absolute',
  borderRadius: '$16',

  variants: {
    variant: {
      32: {
        right: -4,
        bottom: -4,
      },
      24: {
        right: -4,
        bottom: -4,
      },
      20: {
        right: -6,
        bottom: -6,
      },
    },
  },
})
