import type { FileChange } from '@status-im/content/github'
import { builderResourcesFileSchema } from '@status-im/content/schemas'
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

export type BuilderResourceDocLike = {
  slug: string
  status: 'draft' | 'review' | 'published' | 'archived'
  title: string
  description: string
  ctaLabel: string
  href: string
}

type BuilderResourceMutation = 'delete' | 'upsert'
type BuilderResourcePayload = Pick<Payload, 'find'>

const TARGET_PATH = 'content/builders-hub/resources/en.json'

const loadExistingBuilderResources = async (
  payload: BuilderResourcePayload
): Promise<BuilderResourceDocLike[]> => {
  const result = await payload.find({
    collection: 'builder-resources',
    depth: 0,
    limit: 100,
    sort: 'slug',
  })
  return result.docs as unknown as BuilderResourceDocLike[]
}

export const buildBuilderResourcesFileChange = async ({
  doc,
  payload,
  mutation,
}: {
  doc: BuilderResourceDocLike
  payload: BuilderResourcePayload
  mutation: BuilderResourceMutation
}): Promise<FileChange> => {
  const existing = await loadExistingBuilderResources(payload)
  const withoutCurrent = existing.filter((item) => item.slug !== doc.slug)
  const items =
    mutation === 'delete'
      ? withoutCurrent
      : [...withoutCurrent, doc].sort((a, b) => a.slug.localeCompare(b.slug))

  const parsed = builderResourcesFileSchema.parse({
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

export const saveBuilderResourceAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<BuilderResourceDocLike>): Promise<SaveAsPullRequestResult> => {
  const subject = createContentUpdateSubject({
    scope: 'builder-resource',
    slug: doc.slug,
  })

  const change = await buildBuilderResourcesFileChange({
    doc,
    payload,
    mutation: 'upsert',
  })

  return saveAsPullRequest({
    contentType: 'builder-resource',
    identifier: doc.slug,
    changes: [change],
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentUpdatePrBody({
      displayName: doc.title,
      contentLabel: 'Builder resource',
      details: [`- updates: \`${TARGET_PATH}\``, `- slug: \`${doc.slug}\``],
    }),
    draft: true,
    editor,
    payload,
  })
}

export const deleteBuilderResourceAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<BuilderResourceDocLike>): Promise<SaveAsPullRequestResult> => {
  const subject = createContentDeleteSubject({
    scope: 'builder-resource',
    slug: doc.slug,
  })

  const change = await buildBuilderResourcesFileChange({
    doc,
    payload,
    mutation: 'delete',
  })

  return saveAsPullRequest({
    contentType: 'builder-resource',
    identifier: doc.slug,
    changes: [change],
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentDeletePrBody({
      displayName: doc.title,
      contentLabel: 'Builder resource',
      details: [`- updates: \`${TARGET_PATH}\``, `- removes: \`${doc.slug}\``],
    }),
    draft: true,
    editor,
    payload,
  })
}
