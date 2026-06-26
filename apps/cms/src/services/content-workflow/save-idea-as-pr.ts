import type { FileChange } from '@status-im/content/github'
import { ideaIndexSchema, ideaLocaleSchema } from '@status-im/content/schemas'

import {
  createFixtureDeleteChanges,
  createFixturePair,
  stripEmpty,
  toIsoDateOrUndefined,
  type FixturePair,
} from './fixture-helpers'
import {
  createContentDeletePrBody,
  createContentDeleteSubject,
  createContentUpdatePrBody,
  createContentUpdateSubject,
  saveAsPullRequest,
  type SaveAsPullRequestResult,
  type SaveContentAsPullRequestInput,
} from './save-as-pr'

/**
 * Shape of an Idea doc as Payload returns it from `payload.findByID`.
 * Mirrors the collection field config in `apps/cms/src/collections/Ideas.ts`.
 */
export type IdeaDocLike = {
  slug: string
  status: 'draft' | 'review' | 'published' | 'archived'
  title: string
  tagline?: string | null
  summary: string
  description: string
  ctaLabel?: string | null
  submitterName?: string | null
  submitterHandle: string
  rewardAmount?: number | null
  rewardCurrency?: 'USDC' | null
  rewardXp?: number | null
  discussionUrl?: string | null
  tags?: string[] | null
  featured?: boolean | null
  order?: number | null
  submittedAt?: string | null
}

/**
 * Maps a Payload Idea document to the locale-agnostic `index.json` shape and
 * the per-locale `<lang>.json` shape, then Zod-validates each. Reward is
 * built only when an amount is provided — keeps the published fixture lean.
 */
export const buildIdeaFixtureChanges = (doc: IdeaDocLike): FixturePair => {
  const targetDir = `content/builders-hub/ideas/${doc.slug}`

  const reward =
    typeof doc.rewardAmount === 'number' && doc.rewardAmount > 0
      ? stripEmpty({
          amount: doc.rewardAmount,
          currency: doc.rewardCurrency ?? 'USDC',
          xp: doc.rewardXp ?? undefined,
        })
      : undefined

  const indexCandidate = stripEmpty({
    schemaVersion: 1,
    slug: doc.slug,
    status: doc.status,
    submitter: stripEmpty({
      name: doc.submitterName ?? undefined,
      handle: doc.submitterHandle,
    }),
    reward,
    tags: doc.tags ?? [],
    featured: doc.featured ?? false,
    order: doc.order ?? undefined,
    submittedAt: toIsoDateOrUndefined(doc.submittedAt),
    discussionUrl: doc.discussionUrl ?? undefined,
  })

  const localeCandidate = stripEmpty({
    language: 'en',
    title: doc.title,
    tagline: doc.tagline ?? undefined,
    summary: doc.summary,
    description: doc.description,
    ctaLabel: doc.ctaLabel ?? undefined,
  })

  const indexParsed = ideaIndexSchema.parse(indexCandidate)
  const localeParsed = ideaLocaleSchema.parse(localeCandidate)

  return createFixturePair({
    targetDir,
    locale: 'en',
    indexValue: indexParsed,
    localeValue: localeParsed,
  })
}

export const buildIdeaFixtureDeleteChanges = (
  doc: Pick<IdeaDocLike, 'slug'>
): FileChange[] =>
  createFixtureDeleteChanges(`content/builders-hub/ideas/${doc.slug}`)

export const saveIdeaAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<IdeaDocLike>): Promise<SaveAsPullRequestResult> => {
  const { indexChange, localeChange } = buildIdeaFixtureChanges(doc)
  const subject = createContentUpdateSubject({
    scope: 'idea',
    slug: doc.slug,
  })

  return saveAsPullRequest({
    contentType: 'idea',
    identifier: doc.slug,
    changes: [indexChange, localeChange],
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentUpdatePrBody({
      displayName: doc.title,
      contentLabel: 'Idea',
      details: [
        `- slug: \`${doc.slug}\``,
        `- status: \`${doc.status}\``,
        `- submitter: @${doc.submitterHandle}${doc.submitterName ? ` (${doc.submitterName})` : ''}`,
      ],
    }),
    draft: true,
    editor,
    payload,
  })
}

export const deleteIdeaAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<IdeaDocLike>): Promise<SaveAsPullRequestResult> => {
  const subject = createContentDeleteSubject({
    scope: 'idea',
    slug: doc.slug,
  })

  return saveAsPullRequest({
    contentType: 'idea',
    identifier: doc.slug,
    changes: buildIdeaFixtureDeleteChanges(doc),
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentDeletePrBody({
      displayName: doc.title,
      contentLabel: 'Idea',
      details: [
        `- deletes: \`content/builders-hub/ideas/${doc.slug}/index.json\``,
        `- deletes: \`content/builders-hub/ideas/${doc.slug}/en.json\``,
      ],
    }),
    draft: true,
    editor,
    payload,
  })
}
