'use client'

import { Button } from '@status-im/components'
import { DownloadIcon } from '@status-im/icons/12'

import { useDesktopOperatingSystem } from '~hooks/use-desktop-operating-system'
import { useMobileOperatingSystem } from '~hooks/use-mobile-operating-system'
import { DownloadDesktopButton } from '~website/_components/download-desktop-button'

export const DownloadButton = () => {
  const desktopOs = useDesktopOperatingSystem()
  const mobileOS = useMobileOperatingSystem()

  if (mobileOS) {
    return (
      <Button
        href={'/api/download/mobile'}
        size="24"
        iconBefore={<DownloadIcon color="$white/70" />}
      >
        Download for {mobileOS === 'ios' ? 'iOS' : 'Android'}
      </Button>
    )
  }

  if (desktopOs) {
    return <DownloadDesktopButton show="single" source="sharing" size="24" />
  }

  return (
    <Button
      href={'/apps'}
      size="24"
      iconBefore={<DownloadIcon color="$white/70" />}
    >
      Download
    </Button>
  )
}
