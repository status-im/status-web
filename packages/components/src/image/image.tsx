import { forwardRef } from 'react'

import { styled } from '@tamagui/core'
import { Image as TamaguiImage } from '@tamagui/image'

import type { GetProps, GetVariants } from '../types'
import type { Ref } from 'react'

type Variants = GetVariants<typeof Base>

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Expression produces a union type that is too complex to represent.
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

const Base = styled(TamaguiImage, {
  name: 'Image',
  position: 'relative',
  zIndex: 1,
  source: {
    uri: '',
  },

  variants: {
    radius: {
      none: {},
      6: {
        borderRadius: 6,
      },
      8: {
        borderRadius: 8,
      },
      10: {
        borderRadius: 10,
      },
      12: {
        borderRadius: 12, // fix this once Image is migrated to tamagui image
      },
      16: {
        borderRadius: 16,
      },
      full: {
        borderRadius: 999, // fix this once Image is migrated to tamagui image
      },
    },
  } as const,

  backgroundColor: '$white-100',
})
