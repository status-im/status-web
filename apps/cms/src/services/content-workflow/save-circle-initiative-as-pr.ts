import type { FileChange } from '@status-im/content/github'
import {
  circleInitiativeIndexSchema,
  circleInitiativeLocaleSchema,
} from '@status-im/content/schemas'

import {
  createFixtureDeleteChanges,
  createFixturePair,
  stripEmpty,
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
 * Shape of a CircleInitiative doc as Payload returns it from
 * `payload.findByID`. Mirrors the collection field config in
 * `apps/cms/src/collections/Circles.ts` (`CircleInitiatives` export).
 *
 * Hand-typed (rather than imported from `@repo/types`) because the generated
 * Payload types are emitted from a build step that may lag the collection
 * during development.
 */
export type CircleInitiativeDocLike = {
  slug: string
  status: 'draft' | 'review' | 'published' | 'archived'
  circleSlug: string
  href: string
  title: string
  locationLabel: string
  description: string
  ctaLabel: string
  imageSrc?: string | null
  imageAlt?: string | null
  imageWidth?: number | null
  imageHeight?: number | null
  featured?: boolean | null
  order?: number | null
}

/**
 * Maps a Payload CircleInitiative document to the locale-agnostic
 * `index.json` shape and the per-locale `<lang>.json` shape used by
 * `@status-im/content` loaders, then Zod-validates each.
 *
 * `image` is required by `circleInitiativeIndexSchema` (not optional),
 * so the editor must provide at least an `imageSrc` before this can succeed.
 * The validation error surfaces inline in the Admin button on save.
 */
export const buildCircleInitiativeFixtureChanges = (
  doc: CircleInitiativeDocLike
): FixturePair => {
  const targetDir = `content/circles/initiatives/${doc.slug}`

  const image = doc.imageSrc
    ? stripEmpty({
        src: doc.imageSrc,
        alt: doc.imageAlt ?? '',
        width: doc.imageWidth ?? undefined,
        height: doc.imageHeight ?? undefined,
      })
    : undefined

  const indexCandidate = stripEmpty({
    schemaVersion: 1,
    slug: doc.slug,
    status: doc.status,
    circleSlug: doc.circleSlug,
    href: doc.href,
    image,
    featured: doc.featured ?? false,
    order: doc.order ?? undefined,
  })

  const localeCandidate = stripEmpty({
    language: 'en',
    locationLabel: doc.locationLabel,
    title: doc.title,
    description: doc.description,
    ctaLabel: doc.ctaLabel,
  })

  const indexParsed = circleInitiativeIndexSchema.parse(indexCandidate)
  const localeParsed = circleInitiativeLocaleSchema.parse(localeCandidate)

  return createFixturePair({
    targetDir,
    locale: 'en',
    indexValue: indexParsed,
    localeValue: localeParsed,
  })
}

export const buildCircleInitiativeFixtureDeleteChanges = (
  doc: Pick<CircleInitiativeDocLike, 'slug'>
): FileChange[] =>
  createFixtureDeleteChanges(`content/circles/initiatives/${doc.slug}`)

export const saveCircleInitiativeAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<CircleInitiativeDocLike>): Promise<SaveAsPullRequestResult> => {
  const { indexChange, localeChange } = buildCircleInitiativeFixtureChanges(doc)
  const subject = createContentUpdateSubject({
    scope: 'circle-initiative',
    slug: doc.slug,
  })

  return saveAsPullRequest({
    contentType: 'circle-initiative',
    identifier: doc.slug,
    changes: [indexChange, localeChange],
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentUpdatePrBody({
      displayName: doc.title,
      contentLabel: 'Circle initiative',
      details: [
        `- slug: \`${doc.slug}\``,
        `- circleSlug: \`${doc.circleSlug}\``,
        `- status: \`${doc.status}\``,
      ],
    }),
    draft: true,
    editor,
    payload,
  })
}

export const deleteCircleInitiativeAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<CircleInitiativeDocLike>): Promise<SaveAsPullRequestResult> => {
  const subject = createContentDeleteSubject({
    scope: 'circle-initiative',
    slug: doc.slug,
  })

  return saveAsPullRequest({
    contentType: 'circle-initiative',
    identifier: doc.slug,
    changes: buildCircleInitiativeFixtureDeleteChanges(doc),
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentDeletePrBody({
      displayName: doc.title,
      contentLabel: 'Circle initiative',
      details: [
        `- deletes: \`content/circles/initiatives/${doc.slug}/index.json\``,
        `- deletes: \`content/circles/initiatives/${doc.slug}/en.json\``,
      ],
    }),
    draft: true,
    editor,
    payload,
  })
}
