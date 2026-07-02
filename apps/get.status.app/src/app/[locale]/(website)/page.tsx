import { isActiveLocale } from '@status-im/content/locales'

import { serverEnv } from '~/config/env.server.mjs'

import HomePage from '../../../../../status.app/src/app/(website)/page'
import { getCmsHeroCopy } from '../../../lib/page-copy'
import { createPageMetadata } from '../../../lib/page-metadata'

const ROUTE = '/'

export const dynamic =
  serverEnv.NODE_ENV === 'development' ? 'force-dynamic' : 'force-static'

export const generateMetadata = createPageMetadata(ROUTE)

export default async function GetSiteHomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isActiveLocale(locale)) {
    throw new Error(`GetSiteHomePage received non-active locale "${locale}"`)
  }

  const cmsHero = await getCmsHeroCopy(ROUTE, locale, 'home', 'home.hero')

  return <HomePage cmsHero={cmsHero} />
}
