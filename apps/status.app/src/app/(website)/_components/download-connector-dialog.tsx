'use client'

import { Button } from '@status-im/components'
import { ChromeIcon, CloseIcon } from '@status-im/icons/20'

import { STATUS_CONNECTOR_CHROME_URL } from '~/config/routes'
import { trackEvent } from '~app/_utils/track'
import { Dialog } from '~components/dialog'

import { DownloadConnectorSection } from './download-connector'

type Props = {
  children: React.ReactElement
}

export const DownloadConnectorDialog = (props: Props) => {
  const { children } = props

  return (
    <Dialog>
      {children}

      <Dialog.Content className="relative lg:max-w-[1184px]">
        <div className="absolute right-3 top-3 z-10">
          <Dialog.Close>
            <Button
              variant="outline"
              size="32"
              icon={<CloseIcon />}
              aria-label="Close"
            />
          </Dialog.Close>
        </div>
        <DownloadConnectorSection afterDownload>
          <div className="pb-2 text-19 font-600 xl:text-27">
            Thanks for downloading!&nbsp;🎉
          </div>
          <Dialog.Title className="mb-3 mt-4 text-27 font-700 xl:text-40">
            Want to improve your Status experience?
          </Dialog.Title>
          <p className="mb-6 text-19 font-400 xl:text-27">
            Connect to your favourite dapps with the Status Wallet Connector
            browser extension.
          </p>

          <Button
            variant="primary"
            size="40"
            iconBefore={<ChromeIcon className="text-white-100" />}
            onPress={() => {
              trackEvent('Download', {
                platform: 'connector',
                source: 'dialog',
              })
              window.open(STATUS_CONNECTOR_CHROME_URL, '_blank')
            }}
          >
            Download for Chrome
          </Button>
        </DownloadConnectorSection>
      </Dialog.Content>
    </Dialog>
  )
}
