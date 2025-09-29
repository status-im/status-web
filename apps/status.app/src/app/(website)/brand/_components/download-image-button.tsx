'use client'

import { Button } from '@status-im/components'

import { cloudinaryLoader } from '~components/assets/loader'

import type { ImageId } from '~components/assets'

function downloadImage(imageId: ImageId) {
  const [publicId, width] = imageId.split(':')

  const url = cloudinaryLoader({
    src: publicId,
    width: Number(width),
    params: ['fl_attachment'],
  })

  // create download action
  const link = document.createElement('a')

  link.href = url
  link.download = publicId
  link.target = '_self'
  link.click()
  link.remove()
}

export const DownloadImageButton = (
  props: React.ComponentPropsWithoutRef<typeof Button> & {
    imageId: ImageId
  }
) => {
  const { imageId, ...buttonProps } = props

  return (
    <Button
      {...buttonProps}
      onPress={() => {
        downloadImage(imageId)
      }}
    />
  )
}
