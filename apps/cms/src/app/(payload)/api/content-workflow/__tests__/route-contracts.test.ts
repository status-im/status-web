import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { NextRequest, NextResponse } from 'next/server'

import { createMergePrPostHandler } from '../merge-pr/route'
import { createRecentPrGetHandler } from '../recent-pr/route'
import { createSyncProductionHandlers } from '../sync-production/route'

const readJson = async (response: NextResponse) =>
  (await response.json()) as Record<string, unknown>

const request = (
  url: string,
  init?: ConstructorParameters<typeof NextRequest>[1]
) => new NextRequest(url, init)

const createPayload = ({ user = { id: 'user-1' } }: { user?: unknown } = {}) =>
  ({
    auth: async () => ({ user }),
    find: async () => ({ docs: [] }),
  }) as never

describe('content workflow route contracts', () => {
  it('rejects invalid merge request bodies before loading GitHub config', async () => {
    const handler = createMergePrPostHandler({
      getPayload: async () => createPayload(),
      loadGithubConfigFromEnv: () => {
        throw new Error('should not load config')
      },
      mergeContentPullRequest: async () => {
        throw new Error('should not merge')
      },
      setGithubConfig: () => undefined,
    })

    const response = await handler(
      request('http://localhost/api/content-workflow/merge-pr', {
        body: JSON.stringify({ pullRequestNumber: 0 }),
        method: 'POST',
      })
    )

    assert.equal(response.status, 400)
    assert.match(String((await readJson(response)).error), /pullRequestNumber/)
  })

  it('rejects unauthenticated merge requests', async () => {
    const handler = createMergePrPostHandler({
      getPayload: async () => createPayload({ user: null }),
      loadGithubConfigFromEnv: () => ({ owner: 'logos-co' }) as never,
      mergeContentPullRequest: async () => {
        throw new Error('should not merge')
      },
      setGithubConfig: () => undefined,
    })

    const response = await handler(
      request('http://localhost/api/content-workflow/merge-pr', {
        body: JSON.stringify({ pullRequestNumber: 123 }),
        method: 'POST',
      })
    )

    assert.equal(response.status, 401)
  })

  it('returns 422 when merge service fails', async () => {
    const handler = createMergePrPostHandler({
      getPayload: async () => createPayload(),
      loadGithubConfigFromEnv: () => ({ owner: 'logos-co' }) as never,
      mergeContentPullRequest: async () => {
        throw new Error('merge failed')
      },
      setGithubConfig: () => undefined,
    })

    const response = await handler(
      request('http://localhost/api/content-workflow/merge-pr', {
        body: JSON.stringify({ pullRequestNumber: 123 }),
        method: 'POST',
      })
    )

    assert.equal(response.status, 422)
    assert.match(String((await readJson(response)).error), /merge failed/)
  })

  it('rejects unauthenticated recent PR lookups', async () => {
    const handler = createRecentPrGetHandler({
      findOpenPullRequestsTouchingPath: async () => [],
      getPayload: async () => createPayload({ user: null }),
      loadGithubConfigFromEnv: () => ({ owner: 'logos-co' }) as never,
      setGithubConfig: () => undefined,
    })

    const response = await handler(
      request(
        'http://localhost/api/content-workflow/recent-pr?collection=pages'
      )
    )

    assert.equal(response.status, 401)
  })

  it('rejects unsupported recent PR collections', async () => {
    const handler = createRecentPrGetHandler({
      findOpenPullRequestsTouchingPath: async () => [],
      getPayload: async () => createPayload(),
      loadGithubConfigFromEnv: () => ({ owner: 'logos-co' }) as never,
      setGithubConfig: () => undefined,
    })

    const response = await handler(
      request(
        'http://localhost/api/content-workflow/recent-pr?collection=unknown'
      )
    )

    assert.equal(response.status, 400)
  })

  it('returns 500 when recent PR GitHub config cannot load', async () => {
    const handler = createRecentPrGetHandler({
      findOpenPullRequestsTouchingPath: async () => [],
      getPayload: async () => createPayload(),
      loadGithubConfigFromEnv: () => {
        throw new Error('missing github env')
      },
      setGithubConfig: () => undefined,
    })

    const response = await handler(
      request(
        'http://localhost/api/content-workflow/recent-pr?collection=pages&slug=home'
      )
    )

    assert.equal(response.status, 500)
    assert.match(
      String((await readJson(response)).error),
      /GitHub PR lookup failed/
    )
  })

  it('rejects unauthenticated sync-production requests', async () => {
    const { GET } = createSyncProductionHandlers({
      compareProductionToStaging: async () => ({}) as never,
      getBranchSyncDecision: () => ({ kind: 'already-synced', sha: 'sha' }),
      getBranchSyncLinks: () => ({
        compareUrl: '',
        productionBranchUrl: '',
        stagingBranchUrl: '',
      }),
      getPayload: async () => createPayload({ user: null }),
      loadGithubConfigFromEnv: () => ({ owner: 'logos-co' }) as never,
      setGithubConfig: () => undefined,
      syncProductionToStaging: async () => ({}) as never,
    })

    const response = await GET(
      request('http://localhost/api/content-workflow/sync-production')
    )

    assert.equal(response.status, 401)
  })

  it('returns 500 when sync-production GitHub config cannot load', async () => {
    const { GET } = createSyncProductionHandlers({
      compareProductionToStaging: async () => ({}) as never,
      getBranchSyncDecision: () => ({ kind: 'already-synced', sha: 'sha' }),
      getBranchSyncLinks: () => ({
        compareUrl: '',
        productionBranchUrl: '',
        stagingBranchUrl: '',
      }),
      getPayload: async () => createPayload(),
      loadGithubConfigFromEnv: () => {
        throw new Error('missing github env')
      },
      setGithubConfig: () => undefined,
      syncProductionToStaging: async () => ({}) as never,
    })

    const response = await GET(
      request('http://localhost/api/content-workflow/sync-production')
    )

    assert.equal(response.status, 500)
  })
})
