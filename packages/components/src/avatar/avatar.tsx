import { useEffect, useState } from 'react'

import { Stack, styled, Text, Unspaced } from '@tamagui/core'

import { Image } from '../image'

import type { GetProps } from '@tamagui/core'

const Base = styled(Stack, {
  name: 'Avatar',

  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',

  variants: {
    // defined in Avatar props
    size: {
      '...': (size: number) => {
        return {
          width: size,
          height: size,
        }
      },
    },

    shape: {
      circle: {
        borderRadius: 80, // big enough to cover all sizes
      },
      rounded: {
        borderRadius: 16,
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

const Shape = styled(Stack, {
  name: 'AvatarShape',

  width: '100%',
  height: '100%',
  backgroundColor: '$white-100',
  overflow: 'hidden',

  variants: {
    shape: {
      circle: {
        borderRadius: 80, // big enough to cover all sizes
      },
      rounded: {
        borderRadius: 16,
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
  borderRadius: 10,

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

interface Props {
  src: string
  size: 80 | 56 | 48 | 32 | 28 | 24 | 20 | 16
  indicator?: GetProps<typeof Indicator>['state']
  shape?: GetProps<typeof Base>['shape']
  outline?: GetProps<typeof Base>['outline']
}

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

const Avatar = (props: Props) => {
  const {
    src,
    size,
    shape = 'circle',
    outline = false,
    indicator = 'none',
  } = props

  const [status, setStatus] = useState<ImageLoadingStatus>('idle')

  useEffect(() => {
    setStatus('idle')
  }, [src])

  return (
    <Base size={size} shape={shape} outline={outline}>
      {indicator && (
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
