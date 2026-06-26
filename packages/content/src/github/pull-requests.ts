import { getOctokit } from './client'
import { getGithubConfig } from './config'

export type PullRequestSummary = {
  number: number
  title: string
  htmlUrl: string
  nodeId: string
  state: 'open' | 'closed'
  draft: boolean
  merged: boolean
  branchName: string
  baseBranch: string
  changedFiles: number
}

const toSummary = (pr: {
  number: number
  title: string
  html_url: string
  node_id: string
  state: string
  draft?: boolean
  merged_at: string | null
  head: { ref: string }
  base: { ref: string }
  changed_files?: number
}): PullRequestSummary => ({
  number: pr.number,
  title: pr.title,
  htmlUrl: pr.html_url,
  nodeId: pr.node_id,
  state: pr.state === 'closed' ? 'closed' : 'open',
  draft: pr.draft ?? false,
  merged: pr.merged_at !== null,
  branchName: pr.head.ref,
  baseBranch: pr.base.ref,
  changedFiles: pr.changed_files ?? 0,
})

/** List open PRs targeting the configured base branch. */
export const listOpenPullRequests = async (): Promise<PullRequestSummary[]> => {
  const octokit = getOctokit()
  const { owner, repo, prBaseBranch } = getGithubConfig()
  const { data } = await octokit.pulls.list({
    owner,
    repo,
    state: 'open',
    base: prBaseBranch,
    per_page: 100,
  })
  return data.map(toSummary)
}

/**
 * Find the PR for a given source branch. Returns `null` when no open PR
 * exists for that branch.
 */
export const findPullRequestByBranch = async (
  branchName: string
): Promise<PullRequestSummary | null> => {
  const octokit = getOctokit()
  const { owner, repo } = getGithubConfig()
  const { data } = await octokit.pulls.list({
    owner,
    repo,
    state: 'open',
    head: `${owner}:${branchName}`,
    per_page: 1,
  })
  return data[0] ? toSummary(data[0]) : null
}

/**
 * Create a PR from a content branch into the configured base branch.
 * Idempotent: if a PR already exists for the source branch, returns it.
 */
export const createOrGetPullRequest = async ({
  branchName,
  title,
  body,
  draft,
}: {
  branchName: string
  title: string
  body?: string
  draft?: boolean
}): Promise<PullRequestSummary> => {
  const existing = await findPullRequestByBranch(branchName)
  if (existing) return existing

  const octokit = getOctokit()
  const { owner, repo, prBaseBranch } = getGithubConfig()
  const { data } = await octokit.pulls.create({
    owner,
    repo,
    head: branchName,
    base: prBaseBranch,
    title,
    body,
    draft,
  })
  return toSummary({
    ...data,
    changed_files: data.changed_files,
  })
}

export const getPullRequest = async (
  number: number
): Promise<PullRequestSummary> => {
  const octokit = getOctokit()
  const { owner, repo } = getGithubConfig()
  const { data } = await octokit.pulls.get({ owner, repo, pull_number: number })
  return toSummary({
    ...data,
    changed_files: data.changed_files,
  })
}
