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
    `https://res.cloudinary.com/dhgck7ebz/image/upload/${configParams}/${src}`
  )
}

export const createCloudinaryUrl = (id: ImageId) => {
  const [publicId, width] = id.split(':')
  return cloudinaryLoader({ src: publicId, width: parseInt(width) })
}

const GET_SITE_CLOUDINARY_PREFIX = 'get.status.app/'

export const isGetSiteCloudinaryAsset = (publicId: string) =>
  publicId.startsWith(GET_SITE_CLOUDINARY_PREFIX)

export const createCloudinaryVideoUrl = (publicId: string) => {
  if (isGetSiteCloudinaryAsset(publicId)) {
    return encodeURI(
      `https://res.cloudinary.com/dhgck7ebz/video/upload/${publicId}`
    )
  }

  return encodeURI(
    `https://res.cloudinary.com/dhgck7ebz/video/upload/f_auto:video,q_auto/v1/${publicId}`
  )
}

export const createCloudinaryVideoMovUrl = (publicId: string) => {
  if (isGetSiteCloudinaryAsset(publicId)) {
    return createCloudinaryVideoUrl(publicId)
  }

  return encodeURI(
    `https://res.cloudinary.com/dhgck7ebz/video/upload/v1/${publicId}_HEVC.mov`
  )
}
