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
  const { id, alt = '', width, height, quality, ...imageProps } = props

  const [publicId, imageWidth, imageHeight] = id.split(':')
  const resolvedWidth = width ?? Number(imageWidth)
  const resolvedHeight = height ?? Number(imageHeight)

  // Use a full Cloudinary URL so images work with `images.unoptimized` (static export).
  // Custom loaders are ignored when unoptimized; a bare public ID becomes a broken relative path.
  const src = cloudinaryLoader({
    src: publicId,
    width: resolvedWidth,
    quality: typeof quality === 'number' ? quality : undefined,
  })

  return (
    <NextImage
      {...imageProps}
      alt={alt}
      quality={quality}
      src={src}
      width={resolvedWidth}
      height={resolvedHeight}
      style={{ userSelect: 'none' }}
    />
  )
}

export { Image }
export type { Props as ImageProps }
