import { useEffect, useMemo, useState } from 'react'

import { Stack, styled, Unspaced } from '@tamagui/core'
import { Platform } from 'react-native'

import { Image } from '../image'
import { tokens } from '../tokens'
import { generateIdenticonRing } from './utils'

import type { GetStyledVariants } from '@tamagui/core'

type Variants = GetStyledVariants<typeof Base>

type AvatarProps =
  | {
      type: 'user'
      size: 80 | 56 | 48 | 32 | 28 | 24 | 20 | 16
      src: string
      outline?: Variants['outline']
      indicator?: GetStyledVariants<typeof Indicator>['state']
    }
  | {
      type: 'user'
      size: 80 | 56 | 48 | 32
      src: string
      outline?: Variants['outline']
      indicator?: GetStyledVariants<typeof Indicator>['state']
      colorHash?: number[][]
    }
  | {
      type: 'community'
      size: 80 | 32 | 24 | 20
      src: string
      outline?: Variants['outline']
    }
  | {
      type: 'account'
      size: 80 | 48 | 32 | 28 | 24 | 20
      src: string
      outline?: Variants['outline']
    }

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

// todo?: use tokens
const paddings: Record<NonNullable<AvatarProps['size']>, number | undefined> = {
  '80': 4,
  '56': 2,
  '48': 2,
  '32': 2,
  '28': undefined,
  '24': undefined,
  '20': undefined,
  '16': undefined,
}

const radii: Record<NonNullable<AvatarProps['size']>, number | undefined> = {
  '80': 16,
  '56': undefined,
  '48': 12,
  '32': 10,
  '28': 8,
  '24': 8,
  '20': 6,
  '16': undefined,
}

type AvatarWithIdenticon = Extract<AvatarProps, { colorHash?: number[][] }>

function hasIdenticon(props: AvatarProps): props is AvatarWithIdenticon {
  return (props as AvatarWithIdenticon).colorHash !== undefined
}

const Avatar = (props: AvatarProps) => {
  const { type, src, size, outline = false } = props

  // todo?: conditional hook(s)

  const colorHash = hasIdenticon(props) ? props.colorHash : null
  const identiconRing = useMemo(() => {
    if (colorHash) {
      const gradient = generateIdenticonRing(colorHash)
      return `conic-gradient(from 90deg, ${gradient})`
    }
  }, [colorHash])

  const [status, setStatus] = useState<ImageLoadingStatus>('idle')
  useEffect(() => {
    setStatus('idle')
  }, [src])

  const radius = type === 'account' ? radii[size] : tokens.radius['full'].val
  const padding = identiconRing ? paddings[size] : 0

  return (
    <Stack style={{ position: 'relative' }}>
      <Base
        borderRadius={radius}
        padding={padding}
        size={size}
        outline={outline}
        // todo?: https://reactnative.dev/docs/images.html#background-image-via-nesting or svg instead
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        style={{
          ...(Platform.OS === 'web' && {
            background: identiconRing,
          }),
        }}
      >
        <Image
          src={src}
          backgroundColor={'$neutral-95'}
          borderRadius={radius}
          width="full"
          aspectRatio={1}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />

        {status === 'error' && <Fallback borderRadius={radius} />}
      </Base>

      {props.type === 'user' && props.indicator && (
        <Unspaced>
          <Indicator size={size} state={props.indicator} />
        </Unspaced>
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

  width: '100%',
  height: '100%',

  backgroundColor: '$neutral-95',
})
