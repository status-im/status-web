import { useEffect, useState } from 'react'

import { Stack, styled, Text } from '@tamagui/core'

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
  backgroundColor: 'rgb(255,255,255)',

  variants: {
    size: {
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
}

type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'

const Avatar = (props: Props) => {
  const { src, size, shape = 'circle' } = props

  const [status, setStatus] = useState<ImageLoadingStatus>('idle')

  useEffect(() => {
    setStatus('idle')
  }, [JSON.stringify(src)])

  return (
    <Base size={size} shape={shape}>
      <Image
        src={src}
        width={size}
        height={size}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
      <Fallback
        width={size}
        height={size}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        PP
      </Fallback>
    </Base>
  )
}

export { Avatar }
export type { Props as AvatarProps }
