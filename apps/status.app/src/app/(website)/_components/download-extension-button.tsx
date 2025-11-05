'use client'
import { Button } from '@status-im/components'
import { ChromeIcon } from '@status-im/icons/20'

import { STATUS_PORTFOLIO_WALLET_CHROME_URL } from '~/config/routes'
import { trackEvent } from '~app/_utils/track'

type Props = {
  source: string
  variant?: 'outline' | 'primary'
  size?: '32' | '40'
  children?: string
}

const DownloadExtensionButton = (props: Props) => {
  const {
    source,
    variant = 'outline',
    size = '32',
    children = 'Download',
  } = props

  const trackExtensionDownload = (source: string) => {
    trackEvent('Download Extension', {
      source,
    })
  }

  return (
    <Button
      size={size}
      variant={variant}
      iconBefore={<ChromeIcon />}
      href={STATUS_PORTFOLIO_WALLET_CHROME_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackExtensionDownload(source)}
    >
      {children}
    </Button>
  )
}

export { DownloadExtensionButton }
