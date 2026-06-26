import type { Payload } from 'payload'

import { mergePullRequestToBase } from '@status-im/content/github'

export interface MergeContentPullRequestDependencies {
  mergePullRequestToBase: typeof mergePullRequestToBase
}

type ChangeRequestDoc = {
  id: string | number
  pullRequestNumber?: number | null
  status?: string | null
}

export interface MergeContentPullRequestInput {
  payload: Payload
  pullRequestNumber: number
}

export interface MergeContentPullRequestResult {
  contentChangeRequestId: string | number | null
  merged: boolean
  message: string
  pullRequestNumber: number
  pullRequestUrl: string
  sha: string | null
}

const findChangeRequest = async ({
  payload,
  pullRequestNumber,
}: MergeContentPullRequestInput): Promise<ChangeRequestDoc | null> => {
  const result = await payload.find({
    collection: 'content-change-requests',
    depth: 0,
    limit: 1,
    where: {
      pullRequestNumber: {
        equals: pullRequestNumber,
      },
      status: {
        equals: 'open',
      },
    },
  })

  const doc = result.docs[0] as unknown as ChangeRequestDoc | undefined
  return doc ?? null
}

export const createMergeContentPullRequest =
  ({ mergePullRequestToBase }: MergeContentPullRequestDependencies) =>
  async (
    input: MergeContentPullRequestInput
  ): Promise<MergeContentPullRequestResult> => {
    const changeRequest = await findChangeRequest(input)
    const result = await mergePullRequestToBase({
      pullRequestNumber: input.pullRequestNumber,
    })

    if (changeRequest) {
      await input.payload.update({
        collection: 'content-change-requests',
        id: changeRequest.id,
        data: {
          commitSha: result.sha ?? undefined,
          status: 'merged',
        },
      })
    }

    return {
      contentChangeRequestId: changeRequest?.id ?? null,
      merged: result.merged,
      message: result.message,
      pullRequestNumber: result.pullRequestNumber,
      pullRequestUrl: result.pullRequestUrl,
      sha: result.sha,
    }
  }

export const mergeContentPullRequest = createMergeContentPullRequest({
  mergePullRequestToBase,
})
