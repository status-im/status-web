'use client'

import { Button } from '@status-im/components'

import type { ZipFileId } from '~components/assets'

export const DownloadZipButton = (
  props: React.ComponentPropsWithoutRef<typeof Button> & {
    zipFileId: ZipFileId
  }
) => {
  const { zipFileId, ...buttonProps } = props

  return (
    <Button
      {...buttonProps}
      onPress={() => {
        window.open(
          `https://res.cloudinary.com/dhgck7ebz/raw/upload/${zipFileId}`,
          '_self'
        )
      }}
    />
  )
}
