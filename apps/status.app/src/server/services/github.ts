import 'server-only'

import { Octokit } from '@octokit/rest'

import { serverEnv } from '~/config/env.server.mjs'

const octokit = new Octokit({
  auth: serverEnv.GITHUB_TOKEN,
})

export type GitHubRelease = Awaited<ReturnType<typeof getLatestRelease>>

type Repo = 'status-mobile' | 'status-desktop'

export async function getLatestRelease({ repo }: { repo: Repo }) {
  const release = await octokit.rest.repos.getLatestRelease({
    owner: 'status-im',
    repo,
  })

  return release.data
}
