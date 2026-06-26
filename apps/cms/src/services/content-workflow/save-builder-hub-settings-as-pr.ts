import { builderHubSettingsSchema } from '@status-im/content/schemas'

import { toJsonFileChange } from './fixture-helpers'
import {
  createContentUpdatePrBody,
  createContentUpdateSubject,
  saveAsPullRequest,
  type SaveAsPullRequestResult,
  type SaveContentAsPullRequestInput,
} from './save-as-pr'

export type BuilderHubSettingsDocLike = {
  slug: string
  settings: unknown
}

const TARGET_PATH = 'content/builders-hub/settings/en.json'

export const buildBuilderHubSettingsFileChange = (
  doc: BuilderHubSettingsDocLike
) => {
  const parsed = builderHubSettingsSchema.parse(doc.settings)
  return toJsonFileChange(TARGET_PATH, parsed)
}

export const saveBuilderHubSettingsAsPullRequest = async ({
  doc,
  payload,
  editor,
}: SaveContentAsPullRequestInput<BuilderHubSettingsDocLike>): Promise<SaveAsPullRequestResult> => {
  const subject = createContentUpdateSubject({
    scope: 'builder-hub-settings',
    slug: doc.slug,
  })

  return saveAsPullRequest({
    contentType: 'builder-hub-settings',
    identifier: doc.slug,
    changes: [buildBuilderHubSettingsFileChange(doc)],
    commitMessage: subject,
    prTitle: subject,
    prBody: createContentUpdatePrBody({
      displayName: 'Builders Hub',
      contentLabel: 'settings',
      details: [`- updates: \`${TARGET_PATH}\``],
    }),
    draft: true,
    editor,
    payload,
  })
}
