'use client'

import { Button } from '~app/_components/button'

// Download from public assets
export const DownloadZipButton = (
  props: React.ComponentPropsWithoutRef<typeof Button> & {
    fileName: string
  },
) => {
  const { fileName, ...buttonProps } = props

  return (
    <Button
      {...buttonProps}
      onClick={() => {
        window.open(`/brand/${fileName}`, '_self')
      }}
    />
  )
}
