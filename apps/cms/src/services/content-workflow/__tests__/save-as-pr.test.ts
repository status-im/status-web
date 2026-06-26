import assert from 'node:assert/strict'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { afterEach, describe, it } from 'node:test'

import {
  createSaveAsPullRequest,
  type SaveAsPullRequestDependencies,
  type SaveAsPullRequestInput,
} from '../save-as-pr'

const publicRoot = join(process.cwd(), 'tmp-save-as-pr-public')

type PayloadCall = {
  collection: string
  data?: Record<string, unknown>
  id?: string | number
  where?: unknown
}

const createPayload = (findResults: unknown[][] = [[]]) => {
  const calls: {
    create: PayloadCall[]
    find: PayloadCall[]
    update: PayloadCall[]
  } = {
    create: [],
    find: [],
    update: [],
  }

  return {
    calls,
    payload: {
      find: async (input: PayloadCall) => {
        const docs =
          findResults[Math.min(calls.find.length, findResults.length - 1)] ?? []
        calls.find.push(input)
        return { docs }
      },
      create: async (input: PayloadCall) => {
        calls.create.push(input)
        return { id: 'ccr-created', ...(input.data ?? {}) }
      },
      update: async (input: PayloadCall) => {
        calls.update.push(input)
        return { id: input.id, ...(input.data ?? {}) }
      },
    },
  }
}

const createDependencies = (
  overrides: Partial<SaveAsPullRequestDependencies> = {}
): SaveAsPullRequestDependencies => ({
  buildContentBranchName: () => 'content/page-home-test',
  collectReferencedCmsUploadChanges: async ({ changes }) => {
    const { collectReferencedCmsUploadChanges } =
      await import('../media-file-changes')
    return collectReferencedCmsUploadChanges({ changes, publicRoot })
  },
  commitFiles: async ({ changes }) => ({
    commitSha: changes.some(
      (change) => change.path === 'apps/web/public/cms/uploads/hero.webp'
    )
      ? 'commit-with-media'
      : 'commit-sha',
  }),
  createBranch: async () => ({ sha: 'base-sha' }),
  createOrGetPullRequest: async ({ branchName }) => ({
    baseBranch: 'develop',
    branchName,
    changedFiles: 1,
    draft: true,
    htmlUrl: `https://github.com/logos-co/logos-co/pull/123`,
    merged: false,
    nodeId: 'node-123',
    number: 123,
    state: 'open',
    title: 'content(page): update home',
  }),
  findOpenPullRequestsTouchingPath: async () => [],
  findPullRequestByBranch: async () => null,
  getGithubConfig: () => ({
    appId: 'app',
    appPrivateKey: 'private-key',
    contentBranchPrefix: 'content/',
    directCommitEnabled: false,
    installationId: 1,
    owner: 'logos-co',
    prBaseBranch: 'develop',
    productionBranch: 'master',
    repo: 'logos-co',
    stagingBranch: 'develop',
  }),
  ...overrides,
})

const createInput = (
  payload: unknown,
  { withMedia = false }: { withMedia?: boolean } = {}
): SaveAsPullRequestInput => ({
  changes: [
    {
      path: 'content/pages/en/home.json',
      content: JSON.stringify({
        hero: withMedia
          ? { image: '/cms/uploads/hero.webp' }
          : { title: 'Home' },
      }),
    },
  ],
  commitMessage: 'content(page): update home',
  contentType: 'page',
  draft: true,
  identifier: 'home',
  payload: payload as SaveAsPullRequestInput['payload'],
  prTitle: 'content(page): update home',
})

afterEach(async () => {
  await rm(publicRoot, { recursive: true, force: true })
})

describe('createSaveAsPullRequest', () => {
  it('throws when there are no file changes', async () => {
    const { payload } = createPayload()
    const save = createSaveAsPullRequest(createDependencies())

    await assert.rejects(
      save({ ...createInput(payload), changes: [] }),
      /requires at least one file change/
    )
  })

  it('marks stale cached change requests closed before creating a new PR', async () => {
    const { calls, payload } = createPayload([
      [
        {
          id: 'ccr-stale',
          branchName: 'content/page-home-stale',
          pullRequestNumber: 99,
          pullRequestUrl: 'https://github.com/logos-co/logos-co/pull/99',
        },
      ],
      [],
    ])
    const save = createSaveAsPullRequest(createDependencies())

    const result = await save(createInput(payload))

    assert.equal(result.pullRequestNumber, 123)
    assert.deepEqual(calls.update[0], {
      collection: 'content-change-requests',
      id: 'ccr-stale',
      data: { status: 'closed' },
    })
    assert.equal(calls.create.length, 1)
  })

  it('commits to a live cached change request branch', async () => {
    const { calls, payload } = createPayload([
      [
        {
          id: 'ccr-live',
          branchName: 'content/page-home-live',
          pullRequestNumber: 42,
          pullRequestUrl: 'https://github.com/logos-co/logos-co/pull/42',
        },
      ],
    ])
    const save = createSaveAsPullRequest(
      createDependencies({
        findPullRequestByBranch: async () => ({
          baseBranch: 'develop',
          branchName: 'content/page-home-live',
          changedFiles: 1,
          draft: false,
          htmlUrl: 'https://github.com/logos-co/logos-co/pull/42',
          merged: false,
          nodeId: 'node-42',
          number: 42,
          state: 'open',
          title: 'content(page): update home',
        }),
      })
    )

    const result = await save(createInput(payload))

    assert.equal(result.branchName, 'content/page-home-live')
    assert.equal(result.contentChangeRequestId, 'ccr-live')
    assert.equal(calls.update[0]?.data?.status, 'open')
    assert.equal(calls.create.length, 0)
  })

  it('reuses a live GitHub PR touching the target path', async () => {
    const { calls, payload } = createPayload()
    const save = createSaveAsPullRequest(
      createDependencies({
        findOpenPullRequestsTouchingPath: async () => [
          {
            baseBranch: 'develop',
            branchName: 'content/page-home-existing',
            changedFiles: 1,
            draft: false,
            htmlUrl: 'https://github.com/logos-co/logos-co/pull/77',
            merged: false,
            nodeId: 'node-77',
            number: 77,
            state: 'open',
            title: 'content(page): update home',
          },
        ],
      })
    )

    const result = await save(createInput(payload))

    assert.equal(result.branchName, 'content/page-home-existing')
    assert.equal(result.pullRequestNumber, 77)
    assert.equal(calls.create[0]?.data?.pullRequestNumber, 77)
  })

  it('rejects multiple live GitHub PRs touching the target path', async () => {
    const { payload } = createPayload()
    const save = createSaveAsPullRequest(
      createDependencies({
        findOpenPullRequestsTouchingPath: async () => [
          {
            baseBranch: 'develop',
            branchName: 'content/page-home-a',
            changedFiles: 1,
            draft: false,
            htmlUrl: 'https://github.com/logos-co/logos-co/pull/1',
            merged: false,
            nodeId: 'node-1',
            number: 1,
            state: 'open',
            title: 'A',
          },
          {
            baseBranch: 'develop',
            branchName: 'content/page-home-b',
            changedFiles: 1,
            draft: false,
            htmlUrl: 'https://github.com/logos-co/logos-co/pull/2',
            merged: false,
            nodeId: 'node-2',
            number: 2,
            state: 'open',
            title: 'B',
          },
        ],
      })
    )

    await assert.rejects(
      save(createInput(payload)),
      /multiple open pull requests/
    )
  })

  it('includes referenced CMS uploads in the GitHub commit', async () => {
    await mkdir(join(publicRoot, 'cms/uploads'), { recursive: true })
    await writeFile(join(publicRoot, 'cms/uploads/hero.webp'), 'fake-image')
    const { payload } = createPayload()
    const save = createSaveAsPullRequest(createDependencies())

    const result = await save(createInput(payload, { withMedia: true }))

    assert.equal(result.commitSha, 'commit-with-media')
  })
})
