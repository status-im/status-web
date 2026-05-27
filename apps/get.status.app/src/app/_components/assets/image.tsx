'use client'

import NextImage from 'next/image'

import { cloudinaryLoader } from './loader'

import type { ImageAlt, ImageId } from './types'
import type { ImageProps } from 'next/image'

type Props<K extends ImageId> = Omit<ImageProps, 'src' | 'alt'> & {
  id: K
  alt: ImageAlt[K]
} & ({ width: number; height: number } | { width?: never; height?: never })

const Image = <K extends ImageId>(props: Props<K>) => {
  const { id, alt = '', width, height, ...imageProps } = props

  const [publicId, imageWidth, imageHeight] = id.split(':')

  return (
    <NextImage
      {...imageProps}
      alt={alt}
      loader={cloudinaryLoader}
      src={publicId}
      width={width ?? Number(imageWidth)}
      height={height ?? Number(imageHeight)}
      style={{ userSelect: 'none' }}
    />
  )
}

export { Image }
export type { Props as ImageProps }
