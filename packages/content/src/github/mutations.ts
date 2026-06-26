import { getOctokit } from './client'
import { getGithubConfig } from './config'

type FileWriteChange = {
  path: string
  content: string | Uint8Array
}

type FileDeleteChange = {
  path: string
  deleted: true
}

/**
 * A single file change for a multi-file commit. Writes carry UTF-8 text
 * (JSON, MDX) or raw bytes (uploaded media). Deletes become Git tree entries
 * with a null SHA.
 */
export type FileChange = FileWriteChange | FileDeleteChange

const ASSERT_BRANCH_PREFIX = (branchName: string): void => {
  const {
    contentBranchPrefix,
    directCommitEnabled,
    stagingBranch,
    productionBranch,
  } = getGithubConfig()
  if (directCommitEnabled) return
  if (branchName === stagingBranch || branchName === productionBranch) {
    throw new Error(
      `direct commit to "${branchName}" is disabled (set CONTENT_DIRECT_COMMIT_ENABLED=true to override)`
    )
  }
  if (
    !branchName.startsWith(contentBranchPrefix) &&
    !branchName.startsWith('schema/')
  ) {
    throw new Error(
      `branch "${branchName}" must start with "${contentBranchPrefix}" or "schema/"`
    )
  }
}

/**
 * Resolve a branch name to its commit SHA. Throws when the branch does not
 * exist (the caller usually has more context to surface a useful error).
 */
export const getBranchSha = async (branchName: string): Promise<string> => {
  const octokit = getOctokit()
  const { owner, repo } = getGithubConfig()
  const { data } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${branchName}`,
  })
  return data.object.sha
}

export const branchExists = async (branchName: string): Promise<boolean> => {
  const octokit = getOctokit()
  const { owner, repo } = getGithubConfig()
  try {
    await octokit.git.getRef({ owner, repo, ref: `heads/${branchName}` })
    return true
  } catch (err) {
    if (isNotFound(err)) return false
    throw err
  }
}

/**
 * Create a new branch from another branch's tip. Refuses to create branches
 * targeting staging/production directly.
 */
export const createBranch = async ({
  newBranch,
  fromBranch,
}: {
  newBranch: string
  fromBranch?: string
}): Promise<{ sha: string }> => {
  const config = getGithubConfig()
  const octokit = getOctokit()
  ASSERT_BRANCH_PREFIX(newBranch)

  const baseBranch = fromBranch ?? config.stagingBranch
  const baseSha = await getBranchSha(baseBranch)

  await octokit.git.createRef({
    owner: config.owner,
    repo: config.repo,
    ref: `refs/heads/${newBranch}`,
    sha: baseSha,
  })
  return { sha: baseSha }
}

/**
 * Commit a single text file to a branch. Uses the GitHub Contents API which
 * handles tree creation server-side. For multi-file commits use
 * `commitFiles` (atomic single commit across changes).
 */
export const commitTextFile = async ({
  branch,
  path,
  content,
  message,
}: {
  branch: string
  path: string
  content: string
  message: string
}): Promise<void> => {
  ASSERT_BRANCH_PREFIX(branch)
  const octokit = getOctokit()
  const { owner, repo } = getGithubConfig()

  let sha: string | undefined
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    })
    if (!Array.isArray(data) && 'sha' in data) {
      sha = data.sha
    }
  } catch (err) {
    if (!isNotFound(err)) throw err
  }

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    branch,
    message,
    content: Buffer.from(content, 'utf-8').toString('base64'),
    sha,
  })
}

/**
 * Atomic multi-file commit using the Git Data API. Avoids the multi-API-call
 * race that `commitTextFile`-in-a-loop has when several files change as part
 * of a single editor save (e.g. JSON + uploaded media).
 */
export const commitFiles = async ({
  branch,
  message,
  changes,
}: {
  branch: string
  message: string
  changes: FileChange[]
}): Promise<{ commitSha: string }> => {
  if (changes.length === 0) {
    throw new Error('commitFiles requires at least one change')
  }
  ASSERT_BRANCH_PREFIX(branch)
  const octokit = getOctokit()
  const { owner, repo } = getGithubConfig()

  const parentSha = await getBranchSha(branch)
  const { data: parentCommit } = await octokit.git.getCommit({
    owner,
    repo,
    commit_sha: parentSha,
  })

  // Create blobs for each file. Strings are UTF-8 encoded; raw bytes are
  // base64'd directly so binary content (images, video) survives the trip.
  const tree = await Promise.all(
    changes.map(async (change) => {
      if ('content' in change) {
        const buffer =
          typeof change.content === 'string'
            ? Buffer.from(change.content, 'utf-8')
            : Buffer.from(change.content)
        const { data: blob } = await octokit.git.createBlob({
          owner,
          repo,
          content: buffer.toString('base64'),
          encoding: 'base64',
        })
        return {
          path: change.path,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: blob.sha,
        }
      }

      return {
        path: change.path,
        mode: '100644' as const,
        type: 'blob' as const,
        sha: null,
      }
    })
  )

  const { data: newTree } = await octokit.git.createTree({
    owner,
    repo,
    base_tree: parentCommit.tree.sha,
    tree,
  })

  const { data: newCommit } = await octokit.git.createCommit({
    owner,
    repo,
    message,
    tree: newTree.sha,
    parents: [parentSha],
  })

  await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${branch}`,
    sha: newCommit.sha,
  })

  return { commitSha: newCommit.sha }
}

/**
 * Commit a binary file (e.g. uploaded media). Thin wrapper over
 * `commitFiles` for caller clarity at the binary-upload site.
 */
export const commitBinaryFile = async ({
  branch,
  path,
  data,
  message,
}: {
  branch: string
  path: string
  data: Uint8Array
  message: string
}): Promise<{ commitSha: string }> => {
  return commitFiles({
    branch,
    message,
    changes: [{ path, content: data }],
  })
}

const isNotFound = (err: unknown): boolean => {
  return Boolean(
    err &&
    typeof err === 'object' &&
    'status' in err &&
    (err as { status: number }).status === 404
  )
}
