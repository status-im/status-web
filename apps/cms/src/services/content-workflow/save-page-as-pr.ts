import { pageCopySchema, type PageCopy } from '@status-im/content/schemas'
import { routeToPageSlug } from '@status-im/content/loaders'

import { toJsonFileChange } from './fixture-helpers'
import {
  createContentUpdatePrBody,
  createContentUpdateSubject,
  saveAsPullRequest,
  type SaveAsPullRequestResult,
  type SaveContentAsPullRequestInput,
} from './save-as-pr'

export type PageDocLike = {
  slug: string
  route: string
  page: unknown
}

const targetPath = (slug: string): string =>
  `content/get.status.app/pages/en/${slug}.json`

export const buildPageFixtureChange = (doc: PageDocLike) => {
  const parsed: PageCopy = pageCopySchema.parse(doc.page)
  if (parsed.route !== doc.route) {
    throw new Error(
      `page route mismatch: field route "${doc.route}" does not match page.route "${parsed.route}"`
    )
  }

  const expectedSlug = routeToPageSlug(doc.route)
  if (doc.slug !== expectedSlug) {
    throw new Error(
      `page slug mismatch: field slug "${doc.slug}" does not match route-derived slug "${expectedSlug}"`
    )
  }

  return toJsonFileChange(targetPath(doc.slug), parsed)
}

export const savePageAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<PageDocLike>): Promise<SaveAsPullRequestResult> => {
  const subject = createContentUpdateSubject({
    scope: 'page',
    slug: doc.slug,
  })

  return saveAsPullRequest({
    contentType: 'page',
    identifier: doc.slug,
    changes: [buildPageFixtureChange(doc)],
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentUpdatePrBody({
      displayName: doc.slug,
      contentLabel: 'page',
      details: [
        `- updates: \`${targetPath(doc.slug)}\``,
        `- route: \`${doc.route}\``,
      ],
    }),
    draft: true,
    editor,
    payload,
  })
}
