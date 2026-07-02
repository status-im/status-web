import { getPageCopy } from '@status-im/content/loaders'

import { createSectionFinder } from './page-sections'

import type { HeroSection, Language } from '@status-im/content/schemas'

export type CmsHeroCopy = {
  headline: string
  body?: string
}

export async function getCmsHeroCopy(
  route: string,
  locale: Language,
  pageName: string,
  heroKey: string
): Promise<CmsHeroCopy> {
  const page = await getPageCopy(route, locale)
  const findSection = createSectionFinder(pageName)
  const hero = findSection<HeroSection>(page.sections, 'hero', heroKey)

  return {
    headline: hero.headline,
    ...(hero.body ? { body: hero.body } : {}),
  }
}
