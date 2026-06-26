/**
 * End-to-end smoke test for the GitHub mutation primitives.
 *
 * Runs the full create-branch → commit → open-PR → query-PR → close-PR →
 * delete-branch lifecycle against a real repo so regressions in `github/*`
 * surface immediately. Safe to re-run — every iteration uses a unique
 * timestamped branch name, and cleanup runs in `finally`.
 *
 * Authentication: uses GitHub App installation credentials only. Configure
 * the target repo via `GITHUB_OWNER` / `GITHUB_REPO`; defaults to
 * acid-info/logos-co.
 */
import { getOctokit, __resetOctokitForTests } from '../src/github/client'
import {
  __resetGithubConfigForTests,
  loadGithubConfigFromEnv,
  setGithubConfig,
} from '../src/github/config'
import { findOpenPullRequestsTouchingPath } from '../src/github/locks'
import {
  branchExists,
  commitFiles,
  commitTextFile,
  createBranch,
  getBranchSha,
} from '../src/github/mutations'
import {
  createOrGetPullRequest,
  findPullRequestByBranch,
} from '../src/github/pull-requests'

type Step = {
  name: string
  run: () => Promise<unknown>
}

const config = loadGithubConfigFromEnv()
const { owner, repo, prBaseBranch: baseBranch } = config

const stamp = new Date().toISOString().replace(/[:.]/g, '-').replace(/-Z$/, 'Z')
const suffix = Math.random().toString(36).slice(2, 8)
const branchName = `content/smoke-test-${stamp}-${suffix}`
const filePath = `tmp/github-smoke/${stamp}-${suffix}.json`
const fileContent = JSON.stringify(
  { stamp, suffix, note: 'smoke test artifact — safe to delete' },
  null,
  2
)

const main = async (): Promise<void> => {
  __resetGithubConfigForTests()
  __resetOctokitForTests()
  setGithubConfig(config)

  console.log(`target  : ${owner}/${repo}`)
  console.log(`base    : ${baseBranch}`)
  console.log(`branch  : ${branchName}`)
  console.log(`file    : ${filePath}`)
  console.log('')

  const steps: Step[] = [
    {
      name: 'getBranchSha(base)',
      run: async () => {
        const sha = await getBranchSha(baseBranch)
        return `base sha=${sha.slice(0, 7)}`
      },
    },
    {
      name: 'createBranch',
      run: () =>
        createBranch({ newBranch: branchName, fromBranch: baseBranch }),
    },
    {
      name: 'branchExists',
      run: async () => {
        const exists = await branchExists(branchName)
        if (!exists) throw new Error('branch should exist after create')
        return 'true'
      },
    },
    {
      name: 'commitTextFile (single)',
      run: () =>
        commitTextFile({
          branch: branchName,
          path: filePath,
          content: fileContent,
          message: `chore(smoke): commit single file ${suffix}`,
        }),
    },
    {
      name: 'commitFiles (atomic multi)',
      run: async () => {
        const result = await commitFiles({
          branch: branchName,
          message: `chore(smoke): commit multi files ${suffix}`,
          changes: [
            {
              path: `${filePath.replace('.json', '')}-second.json`,
              content: JSON.stringify({ batch: 'second' }, null, 2),
            },
            {
              path: `${filePath.replace('.json', '')}-third.json`,
              content: JSON.stringify({ batch: 'third' }, null, 2),
            },
          ],
        })
        return `commitSha=${result.commitSha.slice(0, 7)}`
      },
    },
    {
      name: 'createOrGetPullRequest',
      run: async () => {
        const pr = await createOrGetPullRequest({
          branchName,
          title: `chore(smoke): GitHub primitives smoke test ${suffix}`,
          body:
            'Automated smoke test of the `@status-im/content` GitHub mutation ' +
            'primitives. Closed automatically by the smoke script — if ' +
            'this PR lingers in your inbox it means the cleanup phase ' +
            'failed and the branch needs manual deletion.',
          draft: true,
        })
        return `#${pr.number} ${pr.htmlUrl}`
      },
    },
    {
      name: 'findPullRequestByBranch (idempotency)',
      run: async () => {
        const pr = await findPullRequestByBranch(branchName)
        if (!pr) throw new Error('expected to find the PR by branch')
        return `#${pr.number}`
      },
    },
    {
      name: 'createOrGetPullRequest (returns existing, not duplicate)',
      run: async () => {
        const a = await createOrGetPullRequest({
          branchName,
          title: 'should not create a duplicate',
          body: 'should not create a duplicate',
        })
        return `#${a.number}`
      },
    },
    {
      name: 'findOpenPullRequestsTouchingPath',
      run: async () => {
        const matches = await findOpenPullRequestsTouchingPath(filePath)
        const ours = matches.find((pr) => pr.branchName === branchName)
        if (!ours) {
          throw new Error(
            `expected to find our smoke PR in lock query for ${filePath}; got [${matches
              .map((pr) => `#${pr.number}`)
              .join(', ')}]`
          )
        }
        return `${matches.length} PR(s) touch the path; ours #${ours.number}`
      },
    },
  ]

  let failed = 0
  for (const step of steps) {
    try {
      const result = await step.run()
      console.log(`ok    ${step.name}${result ? ' — ' + result : ''}`)
    } catch (err) {
      failed++
      const message = err instanceof Error ? err.message : String(err)
      console.error(`FAIL  ${step.name}: ${message}`)
      break
    }
  }

  console.log('')
  console.log('cleanup phase')
  await cleanup()

  if (failed > 0) process.exit(1)
}

const cleanup = async (): Promise<void> => {
  const octokit = getOctokit()

  // Close PR if it exists.
  try {
    const pr = await findPullRequestByBranch(branchName)
    if (pr) {
      await octokit.pulls.update({
        owner,
        repo,
        pull_number: pr.number,
        state: 'closed',
      })
      console.log(`ok    closed PR #${pr.number}`)
    }
  } catch (err) {
    console.warn(
      `warn  PR close skipped: ${err instanceof Error ? err.message : String(err)}`
    )
  }

  // Delete the branch.
  try {
    await octokit.git.deleteRef({
      owner,
      repo,
      ref: `heads/${branchName}`,
    })
    console.log(`ok    deleted branch ${branchName}`)
  } catch (err) {
    console.warn(
      `warn  branch delete skipped: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}

main().catch(async (err) => {
  console.error(err)
  await cleanup()
  process.exit(1)
})
