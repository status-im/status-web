import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import {
  createMergeContentPullRequest,
  type MergeContentPullRequestDependencies,
} from '../merge-pr'

const createPayload = (docs: unknown[] = []) => {
  const updates: unknown[] = []
  return {
    payload: {
      find: async () => ({ docs }),
      update: async (input: unknown) => {
        updates.push(input)
        return input
      },
    },
    updates,
  }
}

const createDependencies = (
  overrides: Partial<MergeContentPullRequestDependencies> = {}
): MergeContentPullRequestDependencies => ({
  mergePullRequestToBase: async ({ pullRequestNumber }) => ({
    merged: true,
    message: 'merged',
    pullRequestNumber,
    pullRequestUrl: `https://github.com/logos-co/logos-co/pull/${pullRequestNumber}`,
    readyForReview: true,
    sha: 'merge-sha',
  }),
  ...overrides,
})

describe('createMergeContentPullRequest', () => {
  it('marks the matching open content change request as merged', async () => {
    const { payload, updates } = createPayload([{ id: 'ccr-1' }])
    const merge = createMergeContentPullRequest(createDependencies())

    const result = await merge({
      payload: payload as never,
      pullRequestNumber: 123,
    })

    assert.equal(result.contentChangeRequestId, 'ccr-1')
    assert.deepEqual(updates[0], {
      collection: 'content-change-requests',
      id: 'ccr-1',
      data: {
        commitSha: 'merge-sha',
        status: 'merged',
      },
    })
  })

  it('returns a null content change request id when Payload has no row', async () => {
    const { payload, updates } = createPayload()
    const merge = createMergeContentPullRequest(createDependencies())

    const result = await merge({
      payload: payload as never,
      pullRequestNumber: 123,
    })

    assert.equal(result.contentChangeRequestId, null)
    assert.equal(updates.length, 0)
  })

  it('does not mutate Payload when GitHub merge fails', async () => {
    const { payload, updates } = createPayload([{ id: 'ccr-1' }])
    const merge = createMergeContentPullRequest(
      createDependencies({
        mergePullRequestToBase: async () => {
          throw new Error('merge failed')
        },
      })
    )

    await assert.rejects(
      merge({
        payload: payload as never,
        pullRequestNumber: 123,
      }),
      /merge failed/
    )
    assert.equal(updates.length, 0)
  })
})
