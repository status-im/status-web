import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server'

import { Link } from '~/i18n/navigation'
import { HubLayout } from '~components/hub-layout'

import { Metadata as MetadataFn } from '../_metadata'

export const metadata = MetadataFn({
  title: '404 — Page Not Found',
  description:
    'The page you were looking for could not be found. Return to the Status Hub homepage.',
  robots: {
    index: false,
  },
})

export default async function NotFound() {
  const locale = await getLocale()

  setRequestLocale(locale)

  const t = await getTranslations('not_found')

  return (
    <HubLayout showSidebar={false}>
      <div className="mx-auto flex w-full max-w-[696px] flex-col items-center gap-8 py-10">
        <h1 className="text-balance text-center text-40 font-700 lg:text-64">
          {t('title')}
        </h1>

        <Link
          href="/"
          className="inline-flex h-10 items-center gap-1 rounded-12 border border-neutral-30 bg-white-100 px-4 py-[9px] text-15 font-500 text-dark-100 transition-all hover:border-neutral-40 hover:bg-white-80"
        >
          {t('take_me_home')}
        </Link>
      </div>
    </HubLayout>
  )
}
