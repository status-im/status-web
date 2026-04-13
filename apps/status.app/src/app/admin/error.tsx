'use client'

import { Button, Text } from '@status-im/components'
import { useTranslations } from 'next-intl'

import { Image } from '~components/assets'

export default function Error() {
  const t = useTranslations('admin')
  return (
    <>
      <div className="flex size-full min-h-screen flex-col items-center justify-center bg-white-100 text-center">
        <Image
          className="mb-5"
          id="404 Error/Other Errors/Error_All_1:942:732"
          alt="Illustration representing the loading error in the Status.app website"
          width={314}
          height={244}
          priority
        />

        <div className="mb-3 flex flex-col gap-2 py-3">
          <Text size={27} weight="semibold">
            {t('errorTitle')}
          </Text>
          <Text size={19} weight="regular">
            {t('errorDescription')}
          </Text>
        </div>

        <Button variant="outline" href="/admin">
          {t('goHome')}
        </Button>
      </div>
    </>
  )
}
