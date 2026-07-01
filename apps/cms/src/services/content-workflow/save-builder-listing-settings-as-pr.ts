import {
  builderHubListingPageSettingsSchema,
  type BuilderHubListingPageSettings,
} from '@status-im/content/schemas'

import { toJsonFileChange } from './fixture-helpers'
import {
  createContentUpdatePrBody,
  createContentUpdateSubject,
  saveAsPullRequest,
  type SaveAsPullRequestResult,
  type SaveContentAsPullRequestInput,
} from './save-as-pr'

export type BuilderListingSettingsDocLike = {
  page: 'ideas' | 'rfps'
  title: string
  description: string
  breadcrumbLabel: string
  submitCtaLabel: string
  submitCtaHref: string
  submitCtaExternal?: boolean | null
  defaultView: 'grid' | 'list'
  pageSize: number
  previousLabel: string
  nextLabel: string
  bottomCtaTitle: string
  bottomCtaLabel: string
  bottomCtaHref: string
  bottomCtaExternal?: boolean | null
}

const targetPath = (page: BuilderListingSettingsDocLike['page']): string =>
  `content/builders-hub/listings/${page}/en.json`

export const buildBuilderListingSettingsFileChange = (
  doc: BuilderListingSettingsDocLike
) => {
  const parsed: BuilderHubListingPageSettings =
    builderHubListingPageSettingsSchema.parse({
      schemaVersion: 1,
      language: 'en',
      page: doc.page,
      title: doc.title,
      description: doc.description,
      breadcrumbLabel: doc.breadcrumbLabel,
      submitCta: {
        label: doc.submitCtaLabel,
        href: doc.submitCtaHref,
        external: doc.submitCtaExternal ?? undefined,
      },
      defaultView: doc.defaultView,
      pageSize: doc.pageSize,
      pagination: {
        previousLabel: doc.previousLabel,
        nextLabel: doc.nextLabel,
      },
      bottomCta: {
        title: doc.bottomCtaTitle,
        cta: {
          label: doc.bottomCtaLabel,
          href: doc.bottomCtaHref,
          external: doc.bottomCtaExternal ?? undefined,
        },
      },
    })

  return toJsonFileChange(targetPath(doc.page), parsed)
}

export const saveBuilderListingSettingsAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<BuilderListingSettingsDocLike>): Promise<SaveAsPullRequestResult> => {
  const subject = createContentUpdateSubject({
    scope: 'builder-listing',
    slug: doc.page,
  })
  const path = targetPath(doc.page)

  return saveAsPullRequest({
    contentType: 'builder-listing',
    identifier: doc.page,
    changes: [buildBuilderListingSettingsFileChange(doc)],
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentUpdatePrBody({
      displayName: doc.title,
      contentLabel: 'Builders Hub listing settings',
      details: [`- updates: \`${path}\``, `- page: \`${doc.page}\``],
    }),
    draft: true,
    editor,
    payload,
  })
}
