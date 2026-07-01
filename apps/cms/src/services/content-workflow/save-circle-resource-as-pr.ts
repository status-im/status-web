import type { FileChange } from '@status-im/content/github'
import { circleResourcesFileSchema } from '@status-im/content/schemas'
import type { Payload } from 'payload'

import { toJsonFileChange } from './fixture-helpers'
import {
  createContentDeletePrBody,
  createContentDeleteSubject,
  createContentUpdatePrBody,
  createContentUpdateSubject,
  saveAsPullRequest,
  type SaveAsPullRequestResult,
  type SaveContentAsPullRequestInput,
} from './save-as-pr'

export type CircleResourceDocLike = {
  slug: string
  status: 'draft' | 'review' | 'published' | 'archived'
  title: string
  description: string
  ctaLabel: string
  href: string
}

type CircleResourceMutation = 'delete' | 'upsert'

const TARGET_PATH = 'content/circles/resources/en.json'

const loadExistingCircleResources = async (
  payload: Payload
): Promise<CircleResourceDocLike[]> => {
  const result = await payload.find({
    collection: 'circle-resources',
    depth: 0,
    limit: 100,
    sort: 'slug',
  })
  return result.docs as unknown as CircleResourceDocLike[]
}

export const buildCircleResourcesFileChange = async ({
  doc,
  payload,
  mutation,
}: {
  doc: CircleResourceDocLike
  payload: Payload
  mutation: CircleResourceMutation
}): Promise<FileChange> => {
  const existing = await loadExistingCircleResources(payload)
  const withoutCurrent = existing.filter((item) => item.slug !== doc.slug)
  const items =
    mutation === 'delete'
      ? withoutCurrent
      : [...withoutCurrent, doc].sort((a, b) => a.slug.localeCompare(b.slug))

  const parsed = circleResourcesFileSchema.parse({
    schemaVersion: 1,
    language: 'en',
    items: items.map((item) => ({
      slug: item.slug,
      title: item.title,
      description: item.description,
      ctaLabel: item.ctaLabel,
      href: item.href,
      status: item.status,
    })),
  })

  return toJsonFileChange(TARGET_PATH, parsed)
}

export const saveCircleResourceAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<CircleResourceDocLike>): Promise<SaveAsPullRequestResult> => {
  const subject = createContentUpdateSubject({
    scope: 'circle-resource',
    slug: doc.slug,
  })

  const change = await buildCircleResourcesFileChange({
    doc,
    payload,
    mutation: 'upsert',
  })

  return saveAsPullRequest({
    contentType: 'circle-resource',
    identifier: doc.slug,
    changes: [change],
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentUpdatePrBody({
      displayName: doc.title,
      contentLabel: 'Circle resource',
      details: [`- updates: \`${TARGET_PATH}\``, `- slug: \`${doc.slug}\``],
    }),
    draft: true,
    editor,
    payload,
  })
}

export const deleteCircleResourceAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<CircleResourceDocLike>): Promise<SaveAsPullRequestResult> => {
  const subject = createContentDeleteSubject({
    scope: 'circle-resource',
    slug: doc.slug,
  })

  const change = await buildCircleResourcesFileChange({
    doc,
    payload,
    mutation: 'delete',
  })

  return saveAsPullRequest({
    contentType: 'circle-resource',
    identifier: doc.slug,
    changes: [change],
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentDeletePrBody({
      displayName: doc.title,
      contentLabel: 'Circle resource',
      details: [`- updates: \`${TARGET_PATH}\``, `- removes: \`${doc.slug}\``],
    }),
    draft: true,
    editor,
    payload,
  })
}
