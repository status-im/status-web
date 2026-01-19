'use client'

import { ButtonLink } from '@status-im/status-network/components'
import { useTranslations } from 'next-intl'

import { apps } from '~/data/apps'

import { AppCard } from './app-card'

const Apps = () => {
  const t = useTranslations()

  return (
    <section className="rounded-32 lg:bg-neutral-2.5 lg:p-8">
      <div className="mb-6 flex items-start justify-between">
        <div className="max-w-2xl">
          <h3 className="mb-2 text-19 font-600 text-neutral-90 lg:text-27">
            {t('apps.explore_apps_title')}
          </h3>

          <p className="ml-1 text-13 text-neutral-60 lg:text-15">
            {t('apps.explore_apps_description')}
          </p>
        </div>
        <ButtonLink
          href="/discover"
          variant="outline"
          className="bg-white-100"
          size="32"
        >
          {t('apps.explore_all_apps')}
        </ButtonLink>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map(app => (
          <AppCard key={app.id} {...app} />
        ))}
      </div>
    </section>
  )
}

export { Apps }
