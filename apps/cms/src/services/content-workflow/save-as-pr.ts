import {
  type FileChange,
  commitFiles,
  createBranch,
  createOrGetPullRequest,
  findOpenPullRequestsTouchingPath,
  findPullRequestByBranch,
  getGithubConfig,
} from '@status-im/content/github'
import {
  isLocalContentWriteEnabled,
  writeFileChangesLocally,
} from '@status-im/content/local'
import type { Payload } from 'payload'

import { buildContentBranchName } from './branch-naming'
import { collectReferencedCmsUploadChanges } from './media-file-changes'

export interface SaveAsPullRequestDependencies {
  buildContentBranchName: typeof buildContentBranchName
  collectReferencedCmsUploadChanges: typeof collectReferencedCmsUploadChanges
  commitFiles: typeof commitFiles
  createBranch: typeof createBranch
  createOrGetPullRequest: typeof createOrGetPullRequest
  findOpenPullRequestsTouchingPath: typeof findOpenPullRequestsTouchingPath
  findPullRequestByBranch: typeof findPullRequestByBranch
  getGithubConfig: typeof getGithubConfig
}

export interface SavePrEditor {
  email?: string
  payloadUserId?: string | number
  payloadAuditUrl?: string
}

export interface SaveContentAsPullRequestInput<TDoc> {
  doc: TDoc
  editor?: SavePrEditor
  payload: Payload
}

export const createContentUpdateSubject = ({
  scope,
  slug,
}: {
  scope: string
  slug: string
}): string => `content(${scope}): update ${slug}`

export const createContentDeleteSubject = ({
  scope,
  slug,
}: {
  scope: string
  slug: string
}): string => `content(${scope}): delete ${slug}`

export const createContentUpdatePrBody = ({
  displayName,
  contentLabel,
  details,
}: {
  displayName: string
  contentLabel: string
  details: string[]
}): string =>
  [
    `Updates the **${displayName}** ${contentLabel} fixture from the CMS Admin.`,
    '',
    ...details,
  ].join('\n')

export const createContentDeletePrBody = ({
  displayName,
  contentLabel,
  details,
}: {
  displayName: string
  contentLabel: string
  details: string[]
}): string =>
  [
    `Deletes the **${displayName}** ${contentLabel} fixture from the CMS Admin.`,
    '',
    ...details,
  ].join('\n')

export type SaveAsPullRequestInput = {
  /** Logical content type — used for branch naming and the CCR row. */
  contentType: string
  /**
   * Record identifier (slug or route) used in the branch name. The actual
   * file path is supplied in `changes`; this is for branch-naming only.
   */
  identifier: string
  /**
   * One or more file changes to commit in a single atomic GitHub commit.
   * The first change's `path` becomes the `targetPath` recorded on the
   * ContentChangeRequest row (used for lock queries).
   */
  changes: FileChange[]
  /** Single-line commit subject. */
  commitMessage: string
  /** PR title. Plan §9 PR Title Rules — should start with `content(scope):`. */
  prTitle: string
  /** PR body (markdown). The submitter line is appended automatically. */
  prBody?: string
  /** Open the PR as a draft (recommended for first-cut wiring). */
  draft?: boolean
  /**
   * Editor metadata. Surface code passes `req.user.email` etc. so the PR
   * description can attribute the change without writing the email into the
   * Git commit author (commits stay App-identity).
   */
  editor?: SavePrEditor
  /**
   * Override for tests / preview-only flows. Defaults to the Payload
   * instance the caller already holds. The payload arg is required so the
   * service can persist a `ContentChangeRequest` row.
   */
  payload: Payload
}

export type SaveAsPullRequestResult = {
  branchName: string
  pullRequestNumber: number
  pullRequestUrl: string
  commitSha: string
  contentChangeRequestId: string | number
}

const recordContentChangeRequest = async (
  input: SaveAsPullRequestInput & {
    branchName: string
    commitSha: string
    pullRequestNumber: number
    pullRequestUrl: string
    targetPath: string
  }
): Promise<string | number> => {
  const existing = await input.payload.find({
    collection: 'content-change-requests',
    where: {
      or: [
        { branchName: { equals: input.branchName } },
        { pullRequestNumber: { equals: input.pullRequestNumber } },
      ],
    },
    sort: '-updatedAt',
    limit: 1,
  })

  const existingRequest = existing.docs[0]
  const data = {
    contentType: input.contentType,
    targetPath: input.targetPath,
    branchName: input.branchName,
    pullRequestNumber: input.pullRequestNumber,
    pullRequestUrl: input.pullRequestUrl,
    status: 'open',
    commitSha: input.commitSha,
    ...(input.editor?.payloadUserId !== undefined && {
      createdBy: input.editor.payloadUserId,
    }),
  }

  if (existingRequest) {
    await input.payload.update({
      collection: 'content-change-requests',
      id: existingRequest.id,
      data,
    })
    return existingRequest.id
  }

  const created = await input.payload.create({
    collection: 'content-change-requests',
    data,
  })
  return created.id
}

/**
 * Single entry point for repo-backed Payload saves.
 *
 *   1. Reuse an open PR for the target path when one exists.
 *   2. Otherwise fork a fresh `content/...` branch off the configured base.
 *   3. Atomic-commit the JSON and any referenced CMS uploads.
 *   4. Open or refresh the PR targeting the base branch.
 *   5. Upsert the `ContentChangeRequest` row that mirrors the PR state.
 */
export const createSaveAsPullRequest =
  ({
    buildContentBranchName,
    collectReferencedCmsUploadChanges,
    commitFiles,
    createBranch,
    createOrGetPullRequest,
    findOpenPullRequestsTouchingPath,
    findPullRequestByBranch,
    getGithubConfig,
  }: SaveAsPullRequestDependencies) =>
  async (input: SaveAsPullRequestInput): Promise<SaveAsPullRequestResult> => {
    if (input.changes.length === 0) {
      throw new Error('saveAsPullRequest requires at least one file change')
    }

    const targetPath = input.changes[0]!.path
    const mediaChanges = await collectReferencedCmsUploadChanges({
      changes: input.changes,
    })
    const changes = [...input.changes, ...mediaChanges]

    if (isLocalContentWriteEnabled()) {
      await writeFileChangesLocally(changes)
      return {
        branchName: 'local',
        pullRequestNumber: 0,
        pullRequestUrl: '',
        commitSha: 'local',
        contentChangeRequestId: 'local',
      }
    }

    const config = getGithubConfig()
    const existing = await input.payload.find({
      collection: 'content-change-requests',
      where: {
        and: [
          { targetPath: { equals: targetPath } },
          { status: { in: ['draft', 'open'] } },
        ],
      },
      sort: '-updatedAt',
      limit: 1,
    })

    const existingRequest = existing.docs[0]
    if (existingRequest) {
      if (
        !existingRequest.pullRequestNumber ||
        !existingRequest.pullRequestUrl
      ) {
        throw new Error(
          `open content change request ${existingRequest.id} is missing pull request metadata`
        )
      }

      const branchName = existingRequest.branchName
      const liveRequest = await findPullRequestByBranch(branchName)
      if (!liveRequest) {
        await input.payload.update({
          collection: 'content-change-requests',
          id: existingRequest.id,
          data: { status: 'closed' },
        })
      } else {
        const { commitSha } = await commitFiles({
          branch: branchName,
          message: input.commitMessage,
          changes,
        })

        await input.payload.update({
          collection: 'content-change-requests',
          id: existingRequest.id,
          data: {
            pullRequestNumber: liveRequest.number,
            pullRequestUrl: liveRequest.htmlUrl,
            status: 'open',
            commitSha,
          },
        })

        return {
          branchName,
          pullRequestNumber: liveRequest.number,
          pullRequestUrl: liveRequest.htmlUrl,
          commitSha,
          contentChangeRequestId: existingRequest.id,
        }
      }
    }

    const branchName = buildContentBranchName({
      contentType: input.contentType,
      identifier: input.identifier,
    })
    const baseBranch = config.prBaseBranch

    const livePullRequests = await findOpenPullRequestsTouchingPath(targetPath)
    if (livePullRequests.length > 1) {
      throw new Error(
        `multiple open pull requests already touch ${targetPath}; merge or close one before saving`
      )
    }
    const livePullRequest = livePullRequests[0]
    if (livePullRequest) {
      const { commitSha } = await commitFiles({
        branch: livePullRequest.branchName,
        message: input.commitMessage,
        changes,
      })

      const contentChangeRequestId = await recordContentChangeRequest({
        ...input,
        branchName: livePullRequest.branchName,
        commitSha,
        pullRequestNumber: livePullRequest.number,
        pullRequestUrl: livePullRequest.htmlUrl,
        targetPath,
      })

      return {
        branchName: livePullRequest.branchName,
        pullRequestNumber: livePullRequest.number,
        pullRequestUrl: livePullRequest.htmlUrl,
        commitSha,
        contentChangeRequestId,
      }
    }

    await createBranch({ newBranch: branchName, fromBranch: baseBranch })

    const { commitSha } = await commitFiles({
      branch: branchName,
      message: input.commitMessage,
      changes,
    })

    // PR body intentionally omits editor identity. The internal CCR row
    // (created below) records `createdBy` for audit; surfacing the editor's
    // email on a public PR is PII leakage we explicitly avoid. The
    // `editor.email` and `editor.payloadAuditUrl` plumbing stays in the
    // input type for future internal uses (e.g. notification emails) but
    // never reaches the GitHub PR.
    const pr = await createOrGetPullRequest({
      branchName,
      title: input.prTitle,
      body: input.prBody ?? '',
      draft: input.draft ?? true,
    })

    const contentChangeRequestId = await recordContentChangeRequest({
      ...input,
      branchName,
      commitSha,
      pullRequestNumber: pr.number,
      pullRequestUrl: pr.htmlUrl,
      targetPath,
    })

    return {
      branchName,
      pullRequestNumber: pr.number,
      pullRequestUrl: pr.htmlUrl,
      commitSha,
      contentChangeRequestId,
    }
  }

export const saveAsPullRequest = createSaveAsPullRequest({
  buildContentBranchName,
  collectReferencedCmsUploadChanges,
  commitFiles,
  createBranch,
  createOrGetPullRequest,
  findOpenPullRequestsTouchingPath,
  findPullRequestByBranch,
  getGithubConfig,
})
