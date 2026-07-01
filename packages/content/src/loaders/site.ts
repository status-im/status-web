import { assertActiveLocale } from '../locales/registry'
import {
  type Footer,
  type Language,
  type Navigation,
  type SiteSettings,
  footerSchema,
  navigationSchema,
  siteSettingsSchema,
} from '../schemas/index'

import { contentPath, readJson } from './_fs'

const SITE_DIR = 'site'

export const getSiteSettings = async (
  locale: Language
): Promise<SiteSettings> => {
  assertActiveLocale(locale)
  return readJson(
    contentPath(SITE_DIR, locale, 'settings.json'),
    siteSettingsSchema
  )
}

export const getFooter = async (locale: Language): Promise<Footer> => {
  assertActiveLocale(locale)
  return readJson(contentPath(SITE_DIR, locale, 'footer.json'), footerSchema)
}

export const getNavigationContent = async (
  locale: Language
): Promise<Navigation> => {
  assertActiveLocale(locale)
  return readJson(
    contentPath(SITE_DIR, locale, 'navigation.json'),
    navigationSchema
  )
}
