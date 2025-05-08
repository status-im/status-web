import type { ImageId } from './types'
import type { ImageLoaderProps } from 'next/image'

interface CustomImageLoaderProps extends ImageLoaderProps {
  params?: string[]
}

export const cloudinaryLoader = ({
  src,
  width,
  quality,
  params = [],
}: CustomImageLoaderProps) => {
  // If there is additionalParams, add it to the params
  const configParams = [
    'f_auto',
    'c_limit',
    `w_${width}`,
    `q_${quality || 'auto'}`,
    ...params,
  ].join(',')

  return encodeURI(
    `https://res.cloudinary.com/dhgck7ebz/image/upload/${configParams}/${src}`,
  )
}

export const createCloudinaryUrl = (id: ImageId) => {
  const [publicId, width] = id.split(':')
  return cloudinaryLoader({ src: publicId, width: parseInt(width) })
}
