'use client'

import { ExternalIcon } from '@status-im/icons/12'
import { useTranslations } from 'next-intl'
import { ButtonLink } from './button-link'

const PromoBar = () => {
  const t = useTranslations()

  return (
    <div
      className="flex max-h-16 min-h-8 w-full items-center bg-purple px-2 py-2 md:justify-center"
      data-theme="dark"
    >
      <div className="mx-2 flex w-fit items-center gap-2 lg:mx-auto lg:w-auto lg:justify-center">
        <p className="line-clamp-2 min-w-0 flex-1 overflow-hidden text-15 font-500 text-white-100 lg:line-clamp-1 lg:flex-none lg:truncate">
          {t('common.promo_message')}
        </p>
        <ButtonLink
          variant="outline"
          size="24"
          icon={<ExternalIcon />}
          href="https://hub.status.network/pre-deposits?utm_source=ecosystem&utm_medium=referral&utm_campaign=app"
          aria-label={t('common.visit_hub_aria')}
          className="shrink-0"
        >
          {t('common.visit_hub')}
        </ButtonLink>
      </div>
    </div>
  )
}

export { PromoBar }
