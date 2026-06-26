import type { FileChange } from '@status-im/content/github'
import { circleIndexSchema, circleLocaleSchema } from '@status-im/content/schemas'

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
 * Shape of a Circle doc as Payload returns it from `payload.findByID`.
 * Mirrors the collection field config in `apps/cms/src/collections/Circles.ts`.
 *
 * Hand-typed (rather than imported from `@repo/types`) because the generated
 * Payload types are emitted from a build step that may lag the collection
 * during development.
 */
export type CircleDocLike = {
  slug: string
  status: 'draft' | 'review' | 'published' | 'archived'
  name: string
  description: string
  city: string
  country: string
  region?: string | null
  lat: number
  lng: number
  timezone: string
  memberCount?: number | null
  discordChannel?: string | null
  discordUrl?: string | null
  forumUrl?: string | null
  joinUrl: string
  imageSrc?: string | null
  imageAlt?: string | null
  imageWidth?: number | null
  imageHeight?: number | null
  organizers?: Array<{ name: string; handle?: string | null }> | null
  order?: number | null
}

/**
 * Maps a Payload Circle document to the locale-agnostic `index.json` shape and
 * the per-locale `<lang>.json` shape used by `@status-im/content` loaders, then
 * Zod-validates each before they touch GitHub. Validation failure throws
 * here rather than at PR-open time, so the editor sees a precise error
 * before any branch is created.
 *
 * Field mapping notes:
 * - Flat `lat`/`lng` collapse into `coordinates: { lat, lng }`.
 * - Flat `imageSrc`/`imageAlt`/`imageWidth`/`imageHeight` collapse into
 *   `image: MediaRef`. The image block is omitted entirely when no `src` is
 *   set so the resulting fixture stays lean.
 * - `organizers` entries with no `handle` are normalised to `{ name }`.
 */
export const buildCircleFixtureChanges = (doc: CircleDocLike): FixturePair => {
  const targetDir = `content/circles/circles/${doc.slug}`

  const image = doc.imageSrc
    ? {
        ...stripEmpty({
          width: doc.imageWidth ?? undefined,
          height: doc.imageHeight ?? undefined,
        }),
        src: doc.imageSrc,
        alt: doc.imageAlt ?? '',
      }
    : undefined

  const organizers =
    doc.organizers && doc.organizers.length > 0
      ? doc.organizers.map((o) =>
          stripEmpty({ name: o.name, handle: o.handle ?? undefined })
        )
      : undefined

  const indexCandidate = stripEmpty({
    schemaVersion: 1,
    slug: doc.slug,
    status: doc.status,
    city: doc.city,
    country: doc.country,
    region: doc.region ?? undefined,
    coordinates: { lat: doc.lat, lng: doc.lng },
    timezone: doc.timezone,
    memberCount: doc.memberCount ?? undefined,
    discordChannel: doc.discordChannel ?? undefined,
    discordUrl: doc.discordUrl ?? undefined,
    forumUrl: doc.forumUrl ?? undefined,
    joinUrl: doc.joinUrl,
    image,
    organizers,
    order: doc.order ?? undefined,
  })

  const localeCandidate = stripEmpty({
    language: 'en',
    name: doc.name,
    description: doc.description,
  })

  const indexParsed = circleIndexSchema.parse(indexCandidate)
  const localeParsed = circleLocaleSchema.parse(localeCandidate)

  return createFixturePair({
    targetDir,
    locale: 'en',
    indexValue: indexParsed,
    localeValue: localeParsed,
  })
}

export const buildCircleFixtureDeleteChanges = (
  doc: Pick<CircleDocLike, 'slug'>
): FileChange[] =>
  createFixtureDeleteChanges(`content/circles/circles/${doc.slug}`)

/**
 * High-level entry point invoked after a repo-backed Admin save. Takes the
 * saved Payload doc + editor metadata, builds the file-change pair, and
 * delegates to `saveAsPullRequest`.
 */
export const saveCircleAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<CircleDocLike>): Promise<SaveAsPullRequestResult> => {
  const { indexChange, localeChange } = buildCircleFixtureChanges(doc)
  const subject = createContentUpdateSubject({
    scope: 'circle',
    slug: doc.slug,
  })

  return saveAsPullRequest({
    contentType: 'circle',
    identifier: doc.slug,
    changes: [indexChange, localeChange],
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentUpdatePrBody({
      displayName: doc.name,
      contentLabel: 'Circle',
      details: [
        `- slug: \`${doc.slug}\``,
        `- status: \`${doc.status}\``,
        `- city: ${doc.city}, ${doc.country}`,
      ],
    }),
    draft: true,
    editor,
    payload,
  })
}

export const deleteCircleAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<CircleDocLike>): Promise<SaveAsPullRequestResult> => {
  const subject = createContentDeleteSubject({
    scope: 'circle',
    slug: doc.slug,
  })

  return saveAsPullRequest({
    contentType: 'circle',
    identifier: doc.slug,
    changes: buildCircleFixtureDeleteChanges(doc),
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentDeletePrBody({
      displayName: doc.name,
      contentLabel: 'Circle',
      details: [
        `- deletes: \`content/circles/circles/${doc.slug}/index.json\``,
        `- deletes: \`content/circles/circles/${doc.slug}/en.json\``,
      ],
    }),
    draft: true,
    editor,
    payload,
  })
}
