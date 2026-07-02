import { isActiveLocale } from '@status-im/content/locales'

import { serverEnv } from '~/config/env.server.mjs'

import AppsPage from '../../../../../../status.app/src/app/(website)/apps/page'
import { getCmsHeroCopy } from '../../../../lib/page-copy'
import { createPageMetadata } from '../../../../lib/page-metadata'

const ROUTE = '/apps'

export const dynamic =
  serverEnv.NODE_ENV === 'development' ? 'force-dynamic' : 'force-static'

export const generateMetadata = createPageMetadata(ROUTE)

export default async function GetSiteAppsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isActiveLocale(locale)) {
    throw new Error(`GetSiteAppsPage received non-active locale "${locale}"`)
  }

  const cmsHero = await getCmsHeroCopy(ROUTE, locale, 'apps', 'apps.hero')

  return <AppsPage cmsHero={cmsHero} />
}
