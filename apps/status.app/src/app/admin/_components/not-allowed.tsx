'use client'

import { Button } from '@status-im/components'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const NotAllowed = () => {
  const t = useTranslations('admin')

  return (
    <div className="visible relative flex size-full min-h-[calc(100vh-56px-4px)] flex-col items-center justify-center rounded-[24px] bg-white-100 2md:hidden">
      <div className="relative flex size-full items-center justify-center">
        <div className="relative z-10 flex flex-col items-center justify-center">
          <Image
            alt={t('mobileTitle')}
            src="/assets/chart/empty.png"
            width={80}
            height={80}
          />
          <div className="pb-3" />
          <p className="text-15 font-semibold">{t('mobileTitle')}</p>
          <div className="pb-1" />
          <p className="text-13 text-neutral-50">{t('mobileDescription')}</p>
          <div className="pt-5">
            <Button variant="outline" href="/">
              {t('goHome')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export { NotAllowed }
