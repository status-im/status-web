import { forwardRef } from 'react'

import { setupReactNative, styled } from '@tamagui/core'
import { Image as RNImage } from 'react-native'

import type { GetProps } from '@tamagui/core'
import type { Ref } from 'react'
import type { ImagePropsBase as RNImageProps } from 'react-native'

setupReactNative({
  Image: RNImage,
})

const Base = styled(RNImage, {
  name: 'Image',
  position: 'relative',
  zIndex: 1,
  source: {
    uri: '',
  },

  variants: {
    radius: {
      12: {
        borderRadius: 12,
      },
      full: {
        borderRadius: 9999,
      },
    },
  },
})

type ImageProps = GetProps<typeof Base>

interface Props {
  src: string
  width: number | 'full'
  height?: number
  aspectRatio?: ImageProps['aspectRatio']
  radius?: ImageProps['radius']
  onLoad?: RNImageProps['onLoad']
  onError?: RNImageProps['onError']
}

const Image = (props: Props, ref: Ref<HTMLImageElement>) => {
  const { src, aspectRatio, radius, ...rest } = props

  const width = props.width === 'full' ? '100%' : props.width
  const height = aspectRatio ? undefined : props.height

  const source = {
    uri: src,
    // ...(isWeb && { width, height }),
  }

  return (
    <Base
      {...rest}
      ref={ref}
      source={source}
      width={width}
      height={height}
      radius={radius}
      aspectRatio={aspectRatio}
    />
  )
}

// TODO?: this was used in @tamagui/image package. Why?
// focusableInputHOC(Image)
const _Image = Base.extractable(forwardRef(Image))

export { _Image as Image }
