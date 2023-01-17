import { forwardRef } from 'react'

import { isWeb, setupReactNative, styled } from '@tamagui/core'
import { Image as RNImage } from 'react-native'

import type { GetProps } from '@tamagui/core'
import type { Ref } from 'react'

// TODO: this was used in @tamagui/image package. Why?
// import { focusableInputHOC } from '@tamagui/focusable'

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
})

type InputProps = GetProps<typeof Image>

// type W = InputProps['width']

interface Props {
  src: string
  width: number | 'full'
  height?: number
  aspectRatio?: number
  // onLoad?: InputProps['onLoad']
  // onError?: InputProps['onError']
}

const Image = (props: Props, ref: Ref<HTMLImageElement>) => {
  const { src, aspectRatio, ...rest } = props

  const width = props.width === 'full' ? '100%' : props.width
  const height = aspectRatio ? undefined : props.height

  const source = {
    uri: src,
    ...(isWeb && { width, height }),
  }

  return (
    <Base
      {...rest}
      ref={ref}
      source={source}
      width={width}
      height={height}
      style={{
        aspectRatio,
      }}
    />
  )
}

// focusableInputHOC(Image)
const _Image = Base.extractable(forwardRef(Image))

export { _Image as Image }
