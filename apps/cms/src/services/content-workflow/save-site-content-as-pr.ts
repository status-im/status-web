import {
  footerSchema,
  navigationSchema,
  siteSettingsSchema,
  type Footer,
  type Navigation,
  type SiteSettings,
} from '@status-im/content/schemas'

import { toJsonFileChange } from './fixture-helpers'
import {
  createContentUpdatePrBody,
  createContentUpdateSubject,
  saveAsPullRequest,
  type SaveAsPullRequestResult,
  type SaveContentAsPullRequestInput,
} from './save-as-pr'

export type SiteSettingsDocLike = {
  slug: string
  settings: unknown
}

export type SiteNavigationDocLike = {
  slug: string
  navigation: unknown
}

export type SiteFooterDocLike = {
  slug: string
  footer: unknown
}

const SITE_SETTINGS_PATH = 'content/get.status.app/site/en/settings.json'
const SITE_NAVIGATION_PATH = 'content/get.status.app/site/en/navigation.json'
const SITE_FOOTER_PATH = 'content/get.status.app/site/en/footer.json'

export const buildSiteSettingsFileChange = (doc: SiteSettingsDocLike) => {
  const parsed: SiteSettings = siteSettingsSchema.parse(doc.settings)
  return toJsonFileChange(SITE_SETTINGS_PATH, parsed)
}

export const buildSiteNavigationFileChange = (doc: SiteNavigationDocLike) => {
  const parsed: Navigation = navigationSchema.parse(doc.navigation)
  return toJsonFileChange(SITE_NAVIGATION_PATH, parsed)
}

export const buildSiteFooterFileChange = (doc: SiteFooterDocLike) => {
  const parsed: Footer = footerSchema.parse(doc.footer)
  return toJsonFileChange(SITE_FOOTER_PATH, parsed)
}

export const saveSiteSettingsAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<SiteSettingsDocLike>): Promise<SaveAsPullRequestResult> => {
  const subject = createContentUpdateSubject({
    scope: 'site-settings',
    slug: doc.slug,
  })

  return saveAsPullRequest({
    contentType: 'site-settings',
    identifier: doc.slug,
    changes: [buildSiteSettingsFileChange(doc)],
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentUpdatePrBody({
      displayName: 'Site settings',
      contentLabel: 'site settings',
      details: [`- updates: \`${SITE_SETTINGS_PATH}\``],
    }),
    draft: true,
    editor,
    payload,
  })
}

export const saveSiteNavigationAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<SiteNavigationDocLike>): Promise<SaveAsPullRequestResult> => {
  const subject = createContentUpdateSubject({
    scope: 'site-navigation',
    slug: doc.slug,
  })

  return saveAsPullRequest({
    contentType: 'site-navigation',
    identifier: doc.slug,
    changes: [buildSiteNavigationFileChange(doc)],
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentUpdatePrBody({
      displayName: 'Site navigation',
      contentLabel: 'site navigation',
      details: [`- updates: \`${SITE_NAVIGATION_PATH}\``],
    }),
    draft: true,
    editor,
    payload,
  })
}

export const saveSiteFooterAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<SiteFooterDocLike>): Promise<SaveAsPullRequestResult> => {
  const subject = createContentUpdateSubject({
    scope: 'site-footer',
    slug: doc.slug,
  })

  return saveAsPullRequest({
    contentType: 'site-footer',
    identifier: doc.slug,
    changes: [buildSiteFooterFileChange(doc)],
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentUpdatePrBody({
      displayName: 'Site footer',
      contentLabel: 'site footer',
      details: [`- updates: \`${SITE_FOOTER_PATH}\``],
    }),
    draft: true,
    editor,
    payload,
  })
}
