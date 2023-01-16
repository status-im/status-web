import React, { forwardRef } from 'react'

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
  source: { uri: '' },
  zIndex: 1,
})

type InputProps = GetProps<typeof Image>

interface Props {
  src: string
  width: number
  height: number
  // onLoad?: InputProps['onLoad']
  // onError?: InputProps['onError']
}

const Image = (props: Props, ref: Ref<HTMLImageElement>) => {
  const { src } = props

  const source =
    typeof src === 'string'
      ? {
          uri: src,
          ...(isWeb && { width: props.width, height: props.height }),
        }
      : src

  return <Base source={source} ref={ref} />
}

// focusableInputHOC(Image)
const _Image = Base.extractable(forwardRef(Image))

export { _Image as Image }
