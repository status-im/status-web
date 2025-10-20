'use client'

import { Button, Tag } from '@status-im/components'
import { ChromeIcon } from '@status-im/icons/20'

import { STATUS_CONNECTOR_CHROME_URL } from '~/config/routes'
import { trackEvent } from '~app/_utils/track'
import { DownloadConnectorSection } from '~website/_components/download-connector'

const ConnectorSection = () => {
  return (
    <DownloadConnectorSection>
      <Tag size="32" label="Status Wallet Connector" />
      <h2 className="mb-3 mt-4 text-27 font-700 xl:text-40">
        Connect Status to your favourite dapps
      </h2>
      <p className="mb-8 text-19 font-400 xl:text-27">
        Safely explore dapps with our browser extension while keeping your keys
        secure inside Status.
      </p>

      <Button
        variant="outline"
        size="40"
        iconBefore={<ChromeIcon className="text-neutral-100" />}
        onPress={() => {
          trackEvent('Download', {
            platform: 'connector',
            source: 'apps',
          })
          window.open(STATUS_CONNECTOR_CHROME_URL, '_blank')
        }}
      >
        Download for Chrome
      </Button>
    </DownloadConnectorSection>
  )
}

export { ConnectorSection }
