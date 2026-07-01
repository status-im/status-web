import { getOctokit } from './client'
import { getGithubConfig } from './config'
import { getBranchSha } from './mutations'
import { getPullRequest } from './pull-requests'

export type BranchComparisonStatus =
  | 'ahead'
  | 'behind'
  | 'diverged'
  | 'identical'

export type BranchSyncDecision =
  | {
      kind: 'fast-forward'
      sha: string
    }
  | {
      kind: 'already-synced'
      sha: string
    }
  | {
      kind: 'blocked'
      reason: string
    }

export interface BranchSyncComparison {
  aheadBy: number
  behindBy?: number
  productionBranch: string
  productionSha: string
  stagingBranch: string
  stagingSha: string
  status: BranchComparisonStatus
}

export interface BranchSyncLinks {
  compareUrl: string
  productionBranchUrl: string
  stagingBranchUrl: string
}

export interface BranchSyncResult {
  comparison: BranchSyncComparison
  decision: BranchSyncDecision
  links: BranchSyncLinks
  updated: boolean
}

export interface MergePullRequestResult {
  merged: boolean
  message: string
  pullRequestNumber: number
  pullRequestUrl: string
  readyForReview: boolean
  sha: string | null
}

const markPullRequestReadyForReview = async ({
  nodeId,
}: {
  nodeId: string
}): Promise<void> => {
  const octokit = getOctokit()
  await octokit.graphql(
    `mutation MarkPullRequestReadyForReview($pullRequestId: ID!) {
      markPullRequestReadyForReview(input: { pullRequestId: $pullRequestId }) {
        pullRequest {
          id
        }
      }
    }`,
    {
      pullRequestId: nodeId,
    }
  )
}

export const getBranchSyncLinks = ({
  owner,
  productionBranch,
  repo,
  stagingBranch,
}: {
  owner: string
  productionBranch: string
  repo: string
  stagingBranch: string
}): BranchSyncLinks => {
  const repoUrl = `https://github.com/${owner}/${repo}`
  return {
    compareUrl: `${repoUrl}/compare/${productionBranch}...${stagingBranch}`,
    productionBranchUrl: `${repoUrl}/tree/${productionBranch}`,
    stagingBranchUrl: `${repoUrl}/tree/${stagingBranch}`,
  }
}

export const getBranchSyncDecision = (
  comparison: BranchSyncComparison
): BranchSyncDecision => {
  if (comparison.status === 'identical') {
    return {
      kind: 'already-synced',
      sha: comparison.productionSha,
    }
  }

  if (comparison.status === 'ahead' && comparison.aheadBy > 0) {
    return {
      kind: 'fast-forward',
      sha: comparison.stagingSha,
    }
  }

  return {
    kind: 'blocked',
    reason:
      comparison.status === 'behind'
        ? `${comparison.stagingBranch} is behind ${comparison.productionBranch}`
        : `${comparison.productionBranch} and ${comparison.stagingBranch} have diverged`,
  }
}

export const compareProductionToStaging =
  async (): Promise<BranchSyncComparison> => {
    const octokit = getOctokit()
    const { owner, productionBranch, repo, stagingBranch } = getGithubConfig()
    const [productionSha, stagingSha] = await Promise.all([
      getBranchSha(productionBranch),
      getBranchSha(stagingBranch),
    ])

    const { data } = await octokit.repos.compareCommitsWithBasehead({
      owner,
      repo,
      basehead: `${productionBranch}...${stagingBranch}`,
    })

    return {
      aheadBy: data.ahead_by,
      behindBy: data.behind_by,
      productionBranch,
      productionSha,
      stagingBranch,
      stagingSha,
      status: data.status as BranchComparisonStatus,
    }
  }

export const syncProductionBranchToStaging =
  async (): Promise<BranchSyncResult> => {
    const comparison = await compareProductionToStaging()
    const decision = getBranchSyncDecision(comparison)
    const { owner, repo } = getGithubConfig()
    const links = getBranchSyncLinks({
      owner,
      repo,
      productionBranch: comparison.productionBranch,
      stagingBranch: comparison.stagingBranch,
    })
    if (decision.kind !== 'fast-forward') {
      return {
        comparison,
        decision,
        links,
        updated: false,
      }
    }

    const octokit = getOctokit()
    const { productionBranch } = getGithubConfig()
    await octokit.git.updateRef({
      owner,
      repo,
      force: false,
      ref: `heads/${productionBranch}`,
      sha: decision.sha,
    })

    return {
      comparison,
      decision,
      links,
      updated: true,
    }
  }

export const mergePullRequestToBase = async ({
  pullRequestNumber,
}: {
  pullRequestNumber: number
}): Promise<MergePullRequestResult> => {
  const { prBaseBranch, owner, repo } = getGithubConfig()
  const pr = await getPullRequest(pullRequestNumber)
  if (pr.baseBranch !== prBaseBranch) {
    throw new Error(
      `PR #${pullRequestNumber} targets "${pr.baseBranch}", expected "${prBaseBranch}"`
    )
  }

  const octokit = getOctokit()
  let readyForReview = false
  if (pr.draft) {
    await markPullRequestReadyForReview({ nodeId: pr.nodeId })
    readyForReview = true
  }

  const { data } = await octokit.pulls.merge({
    owner,
    repo,
    pull_number: pullRequestNumber,
    merge_method: 'squash',
  })

  return {
    merged: data.merged,
    message: data.message,
    pullRequestNumber,
    pullRequestUrl: pr.htmlUrl,
    readyForReview,
    sha: data.sha,
  }
}
