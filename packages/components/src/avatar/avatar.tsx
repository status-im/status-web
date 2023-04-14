import { cloneElement, useMemo, useState } from 'react'

import { LockedIcon, UnlockedIcon } from '@status-im/icons/12'
import { Stack, styled, Unspaced } from '@tamagui/core'
import { Platform } from 'react-native'

import { Image } from '../image'
import { Text } from '../text'
import { tokens } from '../tokens'
import { generateIdenticonRing } from './utils'

import type { TextProps } from '../text'
import type { ColorTokens, GetStyledVariants } from '@tamagui/core'

type Variants = GetStyledVariants<typeof Base>

type AvatarProps =
  | {
      type: 'user'
      size: 80 | 56 | 48 | 32 | 28 | 24 | 20 | 16
      name: string
      src?: string
      outline?: Variants['outline']
      backgroundColor?: ColorTokens
      indicator?: GetStyledVariants<typeof Indicator>['state']
    }
  | {
      type: 'user'
      size: 80 | 56 | 48 | 32
      name: string
      src?: string
      outline?: Variants['outline']
      backgroundColor?: ColorTokens
      indicator?: GetStyledVariants<typeof Indicator>['state']
      colorHash?: number[][]
    }
  | {
      type: 'channel'
      size: 32 | 24 | 20
      emoji: string
      outline?: Variants['outline']
      backgroundColor?: ColorTokens
      background?: ColorTokens
      lock?: 'locked' | 'unlocked'
    }
  | {
      type: 'channel'
      size: 80
      emoji: string
      outline?: Variants['outline']
      backgroundColor?: ColorTokens
      background?: ColorTokens
    }
  | {
      type: 'community'
      size: 80 | 32 | 24 | 20
      name: string
      src?: string
      outline?: Variants['outline']
      backgroundColor?: ColorTokens
    }
  | {
      type: 'account'
      size: 80 | 48 | 32 | 28 | 24 | 20
      name: string
      src?: string
      outline?: Variants['outline']
      backgroundColor?: ColorTokens
    }
  | {
      type: 'icon'
      size: 48 | 32 | 20
      icon: React.ReactElement
      outline?: Variants['outline']
      backgroundColor?: ColorTokens
      color?: ColorTokens
    }

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

// todo?: use tokens
const paddingSizes: Record<
  NonNullable<AvatarProps['size']>,
  number | undefined
> = {
  '80': 4,
  '56': 2,
  '48': 2,
  '32': 2,
  '28': undefined,
  '24': undefined,
  '20': undefined,
  '16': undefined,
}

const radiusSizes: Record<
  NonNullable<AvatarProps['size']>,
  number | undefined
> = {
  '80': 16,
  '56': undefined,
  '48': 12,
  '32': 10,
  '28': 8,
  '24': 8,
  '20': 6,
  '16': undefined,
}

const emojiSizes: Record<AvatarProps['size'], TextProps['size'] | undefined> = {
  '80': 32,
  '56': undefined,
  '48': undefined,
  '32': 15,
  '28': undefined,
  '24': 13,
  '20': 11,
  '16': undefined,
}

const textSizes: Record<NonNullable<AvatarProps['size']>, TextProps['size']> = {
  '80': 32,
  '56': 27,
  '48': 19,
  '32': 15,
  '28': 13,
  '24': 13,
  '20': 11,
  '16': 11,
}

function hasIdenticon(
  props: AvatarProps
): props is Extract<AvatarProps, { colorHash?: number[][] }> {
  return (
    (props as Extract<AvatarProps, { colorHash?: number[][] }>).colorHash !==
    undefined
  )
}

function hasLock(
  props: AvatarProps
): props is Extract<AvatarProps, { lock?: 'locked' | 'unlocked' }> {
  return (
    (props as Extract<AvatarProps, { lock?: 'locked' | 'unlocked' }>).lock !==
    undefined
  )
}

function hasImage(
  props: AvatarProps
): props is Extract<AvatarProps, { src?: string }> {
  return (props as Extract<AvatarProps, { src?: string }>).src !== undefined
}

const Avatar = (props: AvatarProps) => {
  const { type, size, backgroundColor = '$neutral-95', outline = false } = props

  // todo?: conditional hook(s)

  const colorHash = hasIdenticon(props) ? props.colorHash : null
  const identiconRing = useMemo(() => {
    if (colorHash) {
      const gradient = generateIdenticonRing(colorHash)
      return `conic-gradient(from 90deg, ${gradient})`
    }
  }, [colorHash])

  const [status, setStatus] = useState<ImageLoadingStatus>('idle')

  const padding = identiconRing ? paddingSizes[size] : 0
  const radius =
    type === 'account' ? radiusSizes[size] : tokens.radius['full'].val
  const src = hasImage(props) ? props.src : null

  return (
    <Stack style={{ position: 'relative' }}>
      <Base
        borderRadius={radius}
        padding={padding}
        size={size}
        outline={outline}
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
        {/* todo?: render fn(s) */}

        {(props.type === 'user' || props.type === 'account') && (
          <>
            {src ? (
              <>
                <Image
                  src={src}
                  backgroundColor={backgroundColor}
                  borderRadius={radius}
                  width="full"
                  aspectRatio={1}
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
            ) : (
              <Fallback borderRadius={radius} backgroundColor={backgroundColor}>
                {/* fixme: contrasting color to background */}
                <Text size={textSizes[size]} weight="medium" color="$white-100">
                  {props.name.slice(0, 2).toUpperCase()}
                </Text>
              </Fallback>
            )}
          </>
        )}

        {props.type === 'channel' && (
          // fixme: Type 'undefined' is not assignable to type '32 | 11 | 13 | 15 | 19 | 27'
          <Text size={emojiSizes[size] as TextProps['size']}>
            {props.emoji}
          </Text>
        )}

        {props.type === 'icon' && (
          <>{cloneElement(props.icon, { color: props.color })}</>
        )}
      </Base>

      {props.type === 'user' && props.indicator && (
        <Unspaced>
          <Indicator size={size} state={props.indicator} />
        </Unspaced>
      )}

      {props.type === 'channel' && hasLock(props) && (
        <LockBase variant={props.size}>
          {props.lock === 'locked' ? <LockedIcon /> : <UnlockedIcon />}
        </LockBase>
      )}
    </Stack>
  )
}

export { Avatar }
export type { AvatarProps }

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

    outline: {
      true: {
        borderWidth: 2,
        borderColor: '$white-100',
      },
    },
  } as const,
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

const Fallback = styled(Stack, {
  name: 'AvatarFallback',

  justifyContent: 'center',
  alignItems: 'center',

  width: '100%',
  height: '100%',
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
