import { useEffect, useState } from 'react'

import { Stack, styled, Text, Unspaced } from '@tamagui/core'

import { Image } from '../image'

import type { GetProps } from '@tamagui/core'

// import { Button as RNButton } from 'react-native'

// setupReactNative({ Button: RNButton })

// import type { GetProps} from '@tamagui/core';

const Base = styled(Stack, {
  name: 'Avatar',

  display: 'inline-flex',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '$white-100',
  justifyContent: 'center',
  alignItems: 'center',

  variants: {
    size: {
      80: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
      },
      56: {
        width: 56,
        height: 56,
        borderRadius: 56 / 2,
      },
      52: {
        width: 52,
        height: 52,
        borderRadius: 52 / 2,
      },
      48: {
        width: 48,
        height: 48,
        borderRadius: 48 / 2,
      },
      32: {
        width: 32,
        height: 32,
        borderRadius: 32 / 2,
      },
      20: {
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
      },
    },

    shape: {
      circle: {},
      rounded: {
        borderRadius: 16,
      },
    },
    withOutline: {
      true: {
        borderWidth: 2,
        borderColor: '$white-100',
      },
    },
  } as const,
})

const Indicator = styled(Stack, {
  name: 'Indicator',

  position: 'absolute',
  width: 8,
  height: 8,
  bottom: 0,
  right: 0,
  zIndex: 2,
  // borderWidth: 2,
  // borderColor: 'rgba(255,255,0,1.0)',

  variants: {
    size: {
      80: {
        width: 10,
        height: 10,
        borderRadius: '50%',
      },
      56: {
        width: 10,
        height: 10,
        borderRadius: '50%',
      },
      // FIXME: use catch all variant
      52: {
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
      },
      48: {
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
      },
      32: {
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
      },
      20: {
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
      },
    },

    state: {
      online: {
        backgroundColor: '$success-50',
      },
      offline: {
        backgroundColor: '$neutral-40',
      },
    },

    shape: {
      circle: {},
      rounded: {
        borderRadius: 16,
      },
    },
  } as const,
})

const Fallback = styled(Text, {
  name: 'AvatarFallback',
})

type BaseProps = GetProps<typeof Base>

interface Props {
  src: string
  size: NonNullable<BaseProps['size']>
  indicator?: 'online' | 'offline'
  shape?: 'circle' | 'rounded'
  withOutline?: boolean
}

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

const Avatar = (props: Props) => {
  const { src, size, shape = 'circle', withOutline, indicator } = props

  const [status, setStatus] = useState<ImageLoadingStatus>('idle')

  useEffect(() => {
    setStatus('idle')
  }, [JSON.stringify(src)])

  return (
    <Base size={size} shape={shape} withOutline={withOutline}>
      {indicator && (
        <Unspaced>
          <Indicator size={size} state={indicator} />
        </Unspaced>
      )}
      <Stack borderRadius={28} overflow="hidden">
        <Image
          src={src}
          width={size}
          height={size}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      </Stack>

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
    </Base>
  )
}

export { Avatar }
export type { Props as AvatarProps }
