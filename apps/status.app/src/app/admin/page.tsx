import { getTranslations } from 'next-intl/server'

import { Card } from '~admin/_components/card'
import { api } from '~server/trpc/server'

import { EXTERNAL_ROUTES, INTERNAL_ROUTES } from './_constants'

export default async function OverviewPage() {
  const t = await getTranslations('admin')
  const user = await api.user()

  return (
    <main className="grow p-6 md:overflow-y-auto md:p-12">
      <h1 className="pb-1 text-27 font-semibold">
        {t('greeting', { email: user.email })}
      </h1>
      <p className="text-13 md:text-15">{t('welcome')}</p>
      <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-5">
        {INTERNAL_ROUTES.map(route => {
          if (
            (route.href.startsWith('/admin/insights') &&
              !(user.canEditInsights || user.canViewInsights)) ||
            (route.href.startsWith('/admin/keycard') &&
              !(user.canEditKeycard || user.canViewKeycard)) ||
            (route.href.startsWith('/admin/reporting') && !user.canEditReports)
          ) {
            return null
          }

          return (
            <Card
              key={route.href}
              {...route}
              title={t(route.titleKey)}
              description={t(route.descriptionKey)}
              actionLabel={t('goToPage')}
            />
          )
        })}
      </div>
      <section className="py-6">
        <p className="pb-1 text-15 font-600 md:text-19">
          {t('externalPlatforms')}
        </p>
        <p className="text-13 md:text-15">
          {t('externalPlatformsDescription')}
        </p>
        <div className="grid grid-cols-1 gap-4 pb-6 pt-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-5">
          {EXTERNAL_ROUTES.map(route => (
            <Card
              key={route.href}
              {...route}
              title={t(route.titleKey)}
              description={t(route.descriptionKey)}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
