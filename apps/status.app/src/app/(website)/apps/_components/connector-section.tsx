'use client'

import { Button, Tag } from '@status-im/components'
import { ChromeIcon } from '@status-im/icons/20'
import { useTranslations } from 'next-intl'

import { STATUS_CONNECTOR_CHROME_URL } from '~/config/routes'
import { trackEvent } from '~app/_utils/track'
import { DownloadConnectorSection } from '~website/_components/download-connector'

const ConnectorSection = () => {
  const t = useTranslations('apps')
  const td = useTranslations('download')

  return (
    <DownloadConnectorSection>
      <Tag size="32" label={t('connectorTag')} />
      <h2 className="mb-3 mt-4 text-27 font-700 xl:text-40">
        {t('connectorTitle')}
      </h2>
      <p className="mb-8 text-19 font-400 xl:text-27">
        {t('connectorDescription')}
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
        {td('downloadForChrome')}
      </Button>
    </DownloadConnectorSection>
  )
}

export { ConnectorSection }
