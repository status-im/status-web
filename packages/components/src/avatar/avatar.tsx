import { cloneElement, useMemo, useState } from 'react'

import { LockedIcon, MembersIcon, UnlockedIcon } from '@status-im/icons'
import { Stack, styled, Unspaced } from '@tamagui/core'
import { Platform } from 'react-native'

import { Image } from '../image'
import { Text } from '../text'
import { tokens } from '../tokens'
import { generateIdenticonRing } from './utils'

import type { TextProps } from '../text'
import type { RadiusTokens } from '../tokens'
import type { IconProps } from '@status-im/icons'
import type { ColorTokens, GetStyledVariants } from '@tamagui/core'

type UserAvatarProps = {
  type: 'user'
  size: 80 | 56 | 48 | 32 | 28 | 24 | 20 | 16
  name: string
  src?: string
  backgroundColor?: ColorTokens
  indicator?: GetStyledVariants<typeof Indicator>['state']
  colorHash?: number[][]
}

type GroupAvatarProps = {
  type: 'group'
  size: 80 | 48 | 32 | 28 | 20
  name: string
  src?: string
  backgroundColor?: ColorTokens
}

type WalletAvatarProps = {
  type: 'wallet'
  size: 80 | 48 | 32 | 28 | 20
  name: string
  backgroundColor?: ColorTokens
}

type ChannelAvatarProps = {
  type: 'channel'
  size: 80 | 32 | 28 | 24 | 20
  name: string
  emoji?: string
  backgroundColor?: ColorTokens
  background?: ColorTokens
  lock?: 'locked' | 'unlocked'
}

type CommunityAvatarProps = {
  type: 'community'
  size: 80 | 32 | 28 | 24 | 20 | 16
  name: string
  src?: string
  backgroundColor?: ColorTokens
}

type AccountAvatarProps = {
  type: 'account'
  size: 80 | 48 | 32 | 28 | 24 | 20 | 16
  name: string
  src?: string
  backgroundColor?: ColorTokens
}

type IconAvatarProps = {
  type: 'icon'
  size: 48 | 32 | 28 | 24 | 20 | 16
  icon: React.ReactElement
  backgroundColor?: ColorTokens
  color?: ColorTokens
}

type AvatarProps =
  | UserAvatarProps
  | GroupAvatarProps
  | WalletAvatarProps
  | ChannelAvatarProps
  | CommunityAvatarProps
  | AccountAvatarProps
  | IconAvatarProps

type ImageLoadingStatus = 'loading' | 'loaded' | 'error'

const userPaddingSizes: Record<UserAvatarProps['size'], number> = {
  '80': 4,
  '56': 2,
  '48': 2,
  '32': 2,
  '28': 0,
  '24': 0,
  '20': 0,
  '16': 0,
}

const accountRadiusSizes: Record<AccountAvatarProps['size'], RadiusTokens> = {
  '80': '$16',
  '48': '$12',
  '32': '$10',
  '28': '$8',
  '24': '$8',
  '20': '$6',
  '16': '$6',
}

const channelEmojiSizes: Record<ChannelAvatarProps['size'], TextProps['size']> =
  {
    // todo: design review
    '80': 27,
    '32': 15,
    '28': 13,
    '24': 13,
    '20': 11,
  }

const textSizes: Record<NonNullable<AvatarProps['size']>, TextProps['size']> = {
  '80': 27,
  '56': 19,
  '48': 19,
  '32': 15,
  '28': 13,
  '24': 13,
  '20': 11,
  '16': 11,
}

const groupMembersIconSizes: Record<
  GroupAvatarProps['size'],
  IconProps['size'] | number // to scales SVG
> = {
  // todo: design review
  '80': 36,
  '48': 20,
  '32': 16,
  '28': 16,
  '20': 12,
}

const channelLockIconVariants: Record<
  ChannelAvatarProps['size'],
  {
    baseVariant: GetStyledVariants<typeof LockBase>['variant']
    iconSize: IconProps['size'] | number // to scales SVG
  }
> = {
  // todo: design review
  '80': { baseVariant: 80, iconSize: 40 },
  '32': { baseVariant: 24, iconSize: 12 },
  '28': { baseVariant: 24, iconSize: 12 },
  '24': { baseVariant: 24, iconSize: 12 },
  '20': { baseVariant: 20, iconSize: 12 },
}

const Avatar = (props: AvatarProps) => {
  const colorHash = 'colorHash' in props ? props.colorHash : undefined
  const identiconRing = useMemo(() => {
    if (colorHash) {
      const gradient = generateIdenticonRing(colorHash)
      return `conic-gradient(from 90deg, ${gradient})`
    }
  }, [colorHash])

  const [status, setStatus] = useState<ImageLoadingStatus>()

  const padding =
    props.type === 'user' && identiconRing ? userPaddingSizes[props.size] : 0
  const radius: RadiusTokens =
    props.type === 'account' ? accountRadiusSizes[props.size] : '$full'
  const backgroundColor = getBackgroundColor()

  function getBackgroundColor(): ColorTokens {
    if ('src' in props && props.src) {
      switch (status) {
        case 'error':
          break
        case 'loaded':
          return '$transparent'
        case 'loading':
        default:
          return '$white-100'
      }
    }

    if (props.backgroundColor) {
      return props.backgroundColor
    }

    if (props.type === 'channel') {
      return '$blue-50-opa-20'
    }

    return '$neutral-95'
  }

  const renderContent = () => {
    switch (props.type) {
      case 'user':
      case 'account':
      case 'group':
      case 'community': {
        if (!props.src) {
          return (
            <Fallback borderRadius={radius} backgroundColor={backgroundColor}>
              {/* todo?: contrasting color to background */}
              {props.type === 'group' ? (
                <MembersIcon
                  size={groupMembersIconSizes[props.size] as IconProps['size']}
                  color="$white-100"
                />
              ) : (
                <Text
                  size={textSizes[props.size]}
                  weight="medium"
                  color="$white-100"
                >
                  {props.name.slice(0, 2).toUpperCase()}
                </Text>
              )}
            </Fallback>
          )
        }

        return (
          <>
            <Image
              src={props.src}
              backgroundColor={backgroundColor}
              // todo: use tamagui image with token support
              borderRadius={
                tokens.radius[
                  radius
                    .toString()
                    .replace('$', '') as keyof typeof tokens.radius
                ].val
              }
              width="full"
              aspectRatio={1}
              onLoadStart={() => {
                if (status) {
                  return
                }

                setStatus('loading')
              }}
              onLoad={() => setStatus('loaded')}
              onError={() => setStatus('error')}
            />
            {/* todo?: add fallback to Image */}
            {status === 'error' && (
              <Fallback
                borderRadius={radius}
                backgroundColor={backgroundColor}
              />
            )}
          </>
        )
      }
      case 'wallet':
        return (
          <Fallback borderRadius={radius} backgroundColor={backgroundColor}>
            <Text
              size={textSizes[props.size]}
              weight="medium"
              color="$white-100"
            >
              {props.name.slice(0, 2).toUpperCase()}
            </Text>
          </Fallback>
        )
      case 'channel':
        if (props.emoji) {
          return <Text size={channelEmojiSizes[props.size]}>{props.emoji}</Text>
        }

        return (
          <Text size={textSizes[props.size]}>
            {props.name.slice(0, 1).toUpperCase()}
          </Text>
        )
      case 'icon':
        return cloneElement(props.icon, { color: props.color ?? '$white-100' })
      default:
        return
    }
  }

  const renderBadge = () => {
    switch (props.type) {
      case 'user': {
        const { indicator = 'none', size } = props

        if (!indicator || indicator === 'none') {
          return
        }

        return (
          <Unspaced>
            <Indicator size={size} state={indicator} />
          </Unspaced>
        )
      }
      case 'channel': {
        if (!props.lock) {
          return
        }

        const iconVariant = channelLockIconVariants[props.size]

        return (
          <LockBase variant={iconVariant.baseVariant}>
            {props.lock === 'locked' ? (
              <LockedIcon size={iconVariant.iconSize as IconProps['size']} />
            ) : (
              <UnlockedIcon size={iconVariant.iconSize as IconProps['size']} />
            )}
          </LockBase>
        )
      }
      default:
        return
    }
  }

  return (
    <Stack style={{ position: 'relative', height: 'fit-content' }}>
      <Base
        borderRadius={radius}
        padding={padding}
        size={props.size}
        backgroundColor={backgroundColor}
        // todo?: https://reactnative.dev/docs/images.html#background-image-via-nesting or svg instead
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        style={{
          ...(Platform.OS === 'web' && {
            background: identiconRing,
          }),
        }}
      >
        {renderContent()}
      </Base>
      {renderBadge()}
    </Stack>
  )
}

export { Avatar }
export type {
  AccountAvatarProps,
  AvatarProps,
  ChannelAvatarProps,
  CommunityAvatarProps,
  GroupAvatarProps,
  IconAvatarProps,
  UserAvatarProps,
  WalletAvatarProps,
}

const Base = styled(Stack, {
  name: 'Avatar',

  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',

  variants: {
    size: {
      80: {
        width: 80,
        height: 80,
      },
      56: {
        width: 56,
        height: 56,
      },
      48: {
        width: 48,
        height: 48,
      },
      32: {
        width: 32,
        height: 32,
      },
      28: {
        width: 28,
        height: 28,
      },
      24: {
        width: 24,
        height: 24,
      },
      20: {
        width: 20,
        height: 20,
      },
      16: {
        width: 16,
        height: 16,
      },
    },
  } as const,
})

const Fallback = styled(Stack, {
  name: 'AvatarFallback',

  justifyContent: 'center',
  alignItems: 'center',

  width: '100%',
  height: '100%',
})

const Indicator = styled(Stack, {
  name: 'AvatarIndicator',

  position: 'absolute',
  zIndex: 2,
  borderWidth: 2,
  borderColor: '$white-100',
  borderRadius: '$10',

  variants: {
    size: {
      80: {
        width: 16,
        height: 16,
        bottom: 4,
        right: 4,
      },
      56: {
        width: 12,
        height: 12,
        bottom: 2,
        right: 2,
      },
      48: {
        width: 12,
        height: 12,
        right: 0,
        bottom: 0,
      },
      32: {
        width: 12,
        height: 12,
        right: -2,
        bottom: -2,
      },
      28: {
        width: 12,
        height: 12,
        right: -2,
        bottom: -2,
      },
      24: {
        width: 12,
        height: 12,
        right: -2,
        bottom: -2,
      },
      20: {
        display: 'none',
      },
      16: {
        display: 'none',
      },
    },

    state: {
      none: {},
      online: {
        backgroundColor: '$success-50',
      },
      offline: {
        backgroundColor: '$neutral-40',
      },
    },
  } as const,
})

const LockBase = styled(Stack, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 16,
  height: 16,
  backgroundColor: '$white-100',
  position: 'absolute',
  borderRadius: '$full',

  variants: {
    variant: {
      80: {
        width: 48,
        height: 48,
        right: -14,
        bottom: -14,
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
  } as const,
})
