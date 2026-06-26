import type { FileChange } from '@status-im/content/github'
import {
  circleEventIndexSchema,
  circleEventLocaleSchema,
} from '@status-im/content/schemas'

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
 * Shape of a CircleEvent doc as Payload returns it from `payload.findByID`.
 * Mirrors the collection field config in `apps/cms/src/collections/Circles.ts`
 * (`CircleEvents` export).
 *
 * Hand-typed (rather than imported from `@repo/types`) because the generated
 * Payload types are emitted from a build step that may lag the collection
 * during development.
 */
export type CircleEventDocLike = {
  slug: string
  status: 'draft' | 'review' | 'published' | 'archived'
  circleSlug: string
  title: string
  locationLabel: string
  startsAt: string
  endsAt?: string | null
  timezone: string
  venueName?: string | null
  address?: string | null
  eventUrl?: string | null
  imageSrc?: string | null
  imageAlt?: string | null
  imageWidth?: number | null
  imageHeight?: number | null
  hostedBy?: Array<{ name: string }> | null
  featured?: boolean | null
  sequenceNumber?: number | null
}

/**
 * Maps a Payload CircleEvent document to the locale-agnostic `index.json`
 * shape and the per-locale `<lang>.json` shape used by `@status-im/content`
 * loaders, then Zod-validates each before they touch GitHub. Validation
 * failure throws here rather than at PR-open time.
 */
export const buildCircleEventFixtureChanges = (
  doc: CircleEventDocLike
): FixturePair => {
  const targetDir = `content/circles/events/${doc.slug}`

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
    startsAt: toIsoDateOrUndefined(doc.startsAt),
    endsAt: toIsoDateOrUndefined(doc.endsAt),
    timezone: doc.timezone,
    venueName: doc.venueName ?? undefined,
    address: doc.address ?? undefined,
    eventUrl: doc.eventUrl ?? undefined,
    image,
    hostedBy: doc.hostedBy ?? [],
    featured: doc.featured ?? false,
    sequenceNumber: doc.sequenceNumber ?? undefined,
  })

  const localeCandidate = stripEmpty({
    language: 'en',
    title: doc.title,
    locationLabel: doc.locationLabel,
  })

  const indexParsed = circleEventIndexSchema.parse(indexCandidate)
  const localeParsed = circleEventLocaleSchema.parse(localeCandidate)

  return createFixturePair({
    targetDir,
    locale: 'en',
    indexValue: indexParsed,
    localeValue: localeParsed,
  })
}

export const buildCircleEventFixtureDeleteChanges = (
  doc: Pick<CircleEventDocLike, 'slug'>
): FileChange[] =>
  createFixtureDeleteChanges(`content/circles/events/${doc.slug}`)

export const saveCircleEventAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<CircleEventDocLike>): Promise<SaveAsPullRequestResult> => {
  const { indexChange, localeChange } = buildCircleEventFixtureChanges(doc)
  const subject = createContentUpdateSubject({
    scope: 'circle-event',
    slug: doc.slug,
  })

  return saveAsPullRequest({
    contentType: 'circle-event',
    identifier: doc.slug,
    changes: [indexChange, localeChange],
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentUpdatePrBody({
      displayName: doc.title,
      contentLabel: 'Circle event',
      details: [
        `- slug: \`${doc.slug}\``,
        `- circleSlug: \`${doc.circleSlug}\``,
        `- status: \`${doc.status}\``,
        `- startsAt: ${doc.startsAt}`,
      ],
    }),
    draft: true,
    editor,
    payload,
  })
}

export const deleteCircleEventAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<CircleEventDocLike>): Promise<SaveAsPullRequestResult> => {
  const subject = createContentDeleteSubject({
    scope: 'circle-event',
    slug: doc.slug,
  })

  return saveAsPullRequest({
    contentType: 'circle-event',
    identifier: doc.slug,
    changes: buildCircleEventFixtureDeleteChanges(doc),
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentDeletePrBody({
      displayName: doc.title,
      contentLabel: 'Circle event',
      details: [
        `- deletes: \`content/circles/events/${doc.slug}/index.json\``,
        `- deletes: \`content/circles/events/${doc.slug}/en.json\``,
      ],
    }),
    draft: true,
    editor,
    payload,
  })
}
