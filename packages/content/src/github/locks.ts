import { getOctokit } from './client'
import { getGithubConfig } from './config'
import { type PullRequestSummary } from './pull-requests'

/**
 * Find every open PR whose diff touches the given content path. The CMS
 * shows a banner when a second editor opens a record that is already in
 * flight, and refuses to create a duplicate branch on save.
 *
 * Implementation: list open PRs against the base branch, then page through
 * each PR's files and match by path. GitHub's REST list-PRs endpoint does
 * not support "filter by changed file" so we fan-out per PR. The result is
 * cached upstream by `ContentChangeRequest` rows in Payload DB.
 */
export const findOpenPullRequestsTouchingPath = async (
  targetPath: string
): Promise<PullRequestSummary[]> => {
  const octokit = getOctokit()
  const { owner, repo, prBaseBranch } = getGithubConfig()

  const { data: openPrs } = await octokit.pulls.list({
    owner,
    repo,
    state: 'open',
    base: prBaseBranch,
    per_page: 100,
  })

  const matching: PullRequestSummary[] = []
  for (const pr of openPrs) {
    // listFiles paginates at 100 files/page. For content PRs the diff is
    // always small (one record + media), so a single page is enough.
    const { data: files } = await octokit.pulls.listFiles({
      owner,
      repo,
      pull_number: pr.number,
      per_page: 100,
    })
    if (files.some((file) => file.filename === targetPath)) {
      matching.push({
        number: pr.number,
        title: pr.title,
        htmlUrl: pr.html_url,
        nodeId: pr.node_id,
        state: 'open',
        draft: pr.draft ?? false,
        merged: pr.merged_at !== null,
        branchName: pr.head.ref,
        baseBranch: pr.base.ref,
        changedFiles: files.length,
      })
    }
  }
  return matching
}
