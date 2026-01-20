import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { Metadata } from './_metadata'

export const dynamic = 'force-static'

export const metadata = Metadata({
  // title: '404 — Page Not Found',
  // description:
  //   'The page you were looking for could not be found. Return to the Status Hub homepage.',
  robots: {
    index: false,
  },
})

export default async function NotFound() {
  const t = await getTranslations()

  return (
    <main className="flex min-h-screen flex-1 items-center justify-center px-5">
      <div className="flex max-w-[696px] flex-col items-center gap-8">
        <h1 className="text-center text-40 font-700 lg:text-64">
          {t('not_found.title')}
        </h1>

        <Link
          href="/"
          className="inline-flex h-10 items-center gap-1 rounded-12 border border-neutral-30 bg-white-100 px-4 py-[9px] text-15 font-500 text-dark-100 transition-all hover:border-neutral-40 hover:bg-white-80"
        >
          {t('not_found.take_me_home')}
        </Link>
      </div>
    </main>
  )
}
