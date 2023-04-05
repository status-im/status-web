import { forwardRef } from 'react'

import { setupReactNative, styled } from '@tamagui/core'
import { Image as RNImage } from 'react-native'

import type { GetProps, GetVariants } from '../types'
import type { Ref } from 'react'

setupReactNative({
  Image: RNImage,
})

type Variants = GetVariants<typeof Base>

type Props = GetProps<typeof Base> & {
  src: string
  width: number | 'full'
  height?: number
  radius?: Variants['radius']
}

const Image = (props: Props, ref: Ref<HTMLImageElement>) => {
  const { src, radius = 'none', aspectRatio, ...imageProps } = props

  const width = props.width === 'full' ? '100%' : props.width
  const height = aspectRatio ? undefined : props.height

  const source = {
    uri: src,
    // ...(isWeb && { width, height }),
  }

  return (
    <Base
      {...imageProps}
      ref={ref}
      source={source}
      width={width}
      height={height}
      aspectRatio={aspectRatio}
      radius={radius}
    />
  )
}

const _Image = forwardRef(Image)

export { _Image as Image }
export type { Props as ImageProps }

const Base = styled(RNImage, {
  name: 'Image',
  position: 'relative',
  zIndex: 1,
  source: {
    uri: '',
  },

  variants: {
    radius: {
      none: {},
      12: {
        borderRadius: 12, // fix this once Image is migrated to tamagui image
      },
      full: {
        borderRadius: 999, // fix this once Image is migrated to tamagui image
      },
    },
  },
})
