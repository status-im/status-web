import { LockedIcon, UnlockedIcon } from '@status-im/icons'
import { type ColorTokens, Stack, styled, Text } from '@tamagui/core'

type Props =
  | {
      type: 'channel'
      emoji: string
      color?: ColorTokens
      background?: ColorTokens
      size: 32 | 24 | 20
      lock?: 'locked' | 'unlocked'
    }
  | {
      type: 'channel'
      emoji: string
      color?: ColorTokens
      background?: ColorTokens
      size: 80
    }

const emojiSizes: Record<Props['size'], number> = {
  80: 32,
  32: 14,
  24: 13,
  20: 11,
}

type AvatarWithIdenticon = Extract<Props, { lock?: 'locked' | 'unlocked' }>

function hasLock(props: Props): props is AvatarWithIdenticon {
  return (props as AvatarWithIdenticon).lock !== undefined
}

const ChannelAvatar = (props: Props) => {
  const { emoji, background = '$blue-50-opa-20', size } = props

  return (
    <Base size={size} backgroundColor={background}>
      {hasLock(props) && (
        <LockBase variant={props.size}>
          {props.lock === 'locked' ? (
            <LockedIcon size={12} />
          ) : (
            <UnlockedIcon size={12} />
          )}
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
