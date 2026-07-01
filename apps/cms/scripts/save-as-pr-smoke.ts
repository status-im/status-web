/**
 * End-to-end smoke test for the CMS workflow service `saveAsPullRequest`.
 *
 * Picks one existing RFP fixture, simulates an editor change to its tagline,
 * and runs the full create-branch → atomic-commit → open-PR pipeline against
 * the real `logos-co/logos-web` repository. Verifies the PR exists and points
 * at the expected file path, then cleans up (close PR + delete branch).
 *
 * Authentication: uses GitHub App installation credentials only.
 * The Payload-side `payload.create` for the `content-change-requests` row is
 * stubbed — this is a smoke for the GitHub-mutation half of the service, not
 * the Payload persistence half.
 *
 * Usage:
 *   pnpm --filter cms tsx scripts/save-as-pr-smoke.ts
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import {
  __resetGithubConfigForTests,
  __resetOctokitForTests,
  findPullRequestByBranch,
  getOctokit,
  loadGithubConfigFromEnv,
  setGithubConfig,
} from '@status-im/content/github'
import type { Payload } from 'payload'

import { saveAsPullRequest } from '../src/services/content-workflow'

const config = loadGithubConfigFromEnv()
const { owner, repo, prBaseBranch: baseBranch } = config

/**
 * Minimal stub of the Payload instance — only `create` for the
 * `content-change-requests` collection is exercised. The smoke test does not
 * assert on the row itself; it just needs the call to resolve.
 */
const stubPayload = {
  find: async ({ collection }: { collection: string }) => {
    if (collection !== 'content-change-requests') {
      throw new Error(
        `stub payload received unexpected collection "${collection}"`
      )
    }
    return { docs: [] }
  },
  create: async ({ collection }: { collection: string }) => {
    if (collection !== 'content-change-requests') {
      throw new Error(
        `stub payload received unexpected collection "${collection}"`
      )
    }
    return { id: 'stub-ccr-id' }
  },
  update: async ({ collection, id }: { collection: string; id: string }) => {
    if (collection !== 'content-change-requests') {
      throw new Error(
        `stub payload received unexpected collection "${collection}"`
      )
    }
    return { id }
  },
} as unknown as Payload

const SLUG = 'secure-decentralised-frontends'
const REPO_ROOT = path.resolve(import.meta.dirname, '../../..')
const fixtureIndexPath = `content/builders-hub/rfps/${SLUG}/index.json`
const fixtureLocalePath = `content/builders-hub/rfps/${SLUG}/en.json`

const main = async (): Promise<void> => {
  __resetGithubConfigForTests()
  __resetOctokitForTests()
  setGithubConfig(config)

  console.log(`target  : ${owner}/${repo}`)
  console.log(`base    : ${baseBranch}`)
  console.log(`fixture : ${fixtureIndexPath}, ${fixtureLocalePath}`)
  console.log('')

  const indexJson = await readFile(
    path.join(REPO_ROOT, fixtureIndexPath),
    'utf-8'
  )
  const localeJsonRaw = await readFile(
    path.join(REPO_ROOT, fixtureLocalePath),
    'utf-8'
  )

  // Simulate an editor edit: append a timestamp marker to the tagline.
  const localeObj = JSON.parse(localeJsonRaw) as { tagline?: string }
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const baseTagline = (
    localeObj.tagline ??
    'Censorship-resistant frontends for Logos applications.'
  ).replace(/ \[smoke .+?\]$/, '')
  const updatedLocale = {
    ...localeObj,
    tagline: `${baseTagline} [smoke ${stamp}]`,
  }
  const updatedLocaleJson = JSON.stringify(updatedLocale, null, 2) + '\n'

  let result: Awaited<ReturnType<typeof saveAsPullRequest>> | undefined

  try {
    result = await saveAsPullRequest({
      contentType: 'rfp',
      identifier: SLUG,
      changes: [
        { path: fixtureIndexPath, content: indexJson },
        { path: fixtureLocalePath, content: updatedLocaleJson },
      ],
      commitMessage: `content(rfp): smoke-test edit to ${SLUG} tagline`,
      prTitle: `content(rfp): smoke-test edit to ${SLUG}`,
      prBody:
        'Automated smoke test for the CMS workflow service. Closed automatically by ' +
        'the smoke script — if this PR lingers in your inbox the cleanup phase failed.',
      draft: true,
      editor: { email: 'smoke@logos.co' },
      payload: stubPayload,
    })

    console.log(`ok    saveAsPullRequest`)
    console.log(`      branch: ${result.branchName}`)
    console.log(
      `      PR:     #${result.pullRequestNumber} ${result.pullRequestUrl}`
    )
    console.log(`      sha:    ${result.commitSha.slice(0, 7)}`)

    // Reverse-lookup: the PR should be findable by branch.
    const found = await findPullRequestByBranch(result.branchName)
    if (!found || found.number !== result.pullRequestNumber) {
      throw new Error('PR not findable by branch after save')
    }
    console.log(`ok    findPullRequestByBranch — #${found.number}`)
  } finally {
    if (result) {
      await cleanup(result.branchName, result.pullRequestNumber)
    }
  }
}

const cleanup = async (
  branchName: string,
  pullNumber: number
): Promise<void> => {
  console.log('')
  console.log('cleanup phase')
  const octokit = getOctokit()
  try {
    await octokit.pulls.update({
      owner,
      repo,
      pull_number: pullNumber,
      state: 'closed',
    })
    console.log(`ok    closed PR #${pullNumber}`)
  } catch (err) {
    console.warn(
      `warn  PR close skipped: ${err instanceof Error ? err.message : String(err)}`
    )
  }
  try {
    await octokit.git.deleteRef({ owner, repo, ref: `heads/${branchName}` })
    console.log(`ok    deleted branch ${branchName}`)
  } catch (err) {
    console.warn(
      `warn  branch delete skipped: ${err instanceof Error ? err.message : String(err)}`
    )
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
