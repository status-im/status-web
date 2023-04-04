import { useEffect, useMemo, useState } from 'react'

import { Stack, styled, Text, Unspaced } from '@tamagui/core'

import { Image } from '../image'
import { generateIdenticonRing } from './utils'

import type { GetStyledVariants } from '@tamagui/core'

type Variants = GetStyledVariants<typeof Base>

type Props = {
  src: string
  size: 80 | 56 | 48 | 32 | 28 | 24 | 20 | 16
  shape?: Variants['shape']
  indicator?: GetStyledVariants<typeof Indicator>['state']
} & {
  type: 'user'
  colorHash?: number[][]
}

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

const Avatar = (props: Props) => {
  const { src, size, shape = 'circle', indicator = 'none', colorHash } = props

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

  return (
    <Base
      size={size}
      shape={shape}
      style={{
        background: identiconRing,
        // 'background': 'red',
        // padding: 4,
        ...(!identiconRing
          ? {
              '--identicon-size': 0,
              // padding: 0
            }
          : {
              // padding: 4,
              // '--identicon-size': 4
            }),
      }}
    >
      {indicator !== 'none' && (
        <Unspaced>
          <Indicator size={size} state={indicator} />
        </Unspaced>
      )}
      <Shape shape={shape}>
        <Image
          src={src}
          width="full"
          aspectRatio={1}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />

        {status === 'error' && (
          <Fallback
            width={size}
            height={size}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            PP
          </Fallback>
        )}
      </Shape>
    </Base>
  )
}

export { Avatar }
export type { Props as AvatarProps }

const Base = styled(Stack, {
  name: 'Avatar',

  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',

  variants: {
    // defined in Avatar props
    size: {
      // '...': (size: number) => {
      //   return {
      //     width: size,
      //     height: size,
      //     '--identicon-size': 4,
      //     padding: 'var(--identicon-size)'
      //   }
      // },

      // 80: {
      //   width: 80,
      //   height: 80,
      //   // '--identicon-size': 4,
      //   // padding: 'var(--identicon-size)',
      //   // padding: 4,
      // },

      80: {
        width: 80,
        height: 80,
        // '--identicon-size': 4,
        // padding: 'var(--identicon-size)',
        padding: 4,
      },
      56: {
        width: 56,
        height: 56,
        // padding: 3,
        '--identicon-size': 3,
        padding: 'var(--identicon-size)',
      },
      48: {
        width: 48,
        height: 48,
        padding: 2,
      },
      32: {
        width: 32,
        height: 32,
        padding: 2,
      },
      28: {
        width: 28,
        height: 28,
        padding: 1,
      },
      24: {
        width: 24,
        height: 24,
        padding: 1,
      },
      20: {
        width: 20,
        height: 20,
        padding: 1,
      },
      16: {
        width: 16,
        height: 16,
        padding: 1,
      },
    },

    shape: {
      circle: {
        borderRadius: '$full',
      },
      rounded: {
        borderRadius: '$16',
      },
    },
  } as const,
})

const Shape = styled(Stack, {
  name: 'AvatarShape',

  width: '100%',
  height: '100%',
  backgroundColor: '$white-100',
  overflow: 'hidden',

  variants: {
    shape: {
      circle: {
        borderRadius: '$full',
      },
      rounded: {
        borderRadius: '$16',
      },
    },
  },
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

const Fallback = styled(Text, {
  name: 'AvatarFallback',
})
