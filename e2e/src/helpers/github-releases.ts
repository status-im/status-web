import { GITHUB_TOKEN } from '@config/site.js'
import { expect } from '@playwright/test'

import type { APIRequestContext } from '@playwright/test'

export type GitHubRelease = {
  tag_name: string
  draft: boolean
  prerelease: boolean
  assets: { name: string; state: string; browser_download_url: string }[]
}

/**
 * Fetches a release through the GitHub REST API, authenticated when
 * GITHUB_TOKEN is set. The suite never calls github.com itself: GitHub answers
 * anonymous traffic there with 504s when it is under load.
 */
export async function getRelease(
  request: APIRequestContext,
  repo: string,
  tag: string,
): Promise<GitHubRelease> {
  const url = `https://api.github.com/repos/${repo}/releases/tags/${encodeURIComponent(tag)}`
  const response = await request.get(url, {
    headers: {
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      ...(GITHUB_TOKEN && { authorization: `Bearer ${GITHUB_TOKEN}` }),
    },
  })
  expect(response.status(), `${url}: ${await response.text()}`).toBe(200)
  return response.json()
}
