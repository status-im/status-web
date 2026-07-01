import { createAppAuth } from '@octokit/auth-app'
import { Octokit } from '@octokit/rest'

import { getGithubConfig } from './config'

/**
 * Cached Octokit so installation token rotation does not reset on every call.
 * App-mode auth tokens auto-rotate inside the created instance via
 * `@octokit/auth-app`.
 */
let cached: Octokit | null = null

/**
 * Build an authenticated Octokit using GitHub App installation auth.
 * Personal access tokens are intentionally unsupported so CMS actions are
 * never attributed to an individual account.
 */
export const getOctokit = (): Octokit => {
  if (cached) return cached
  const config = getGithubConfig()

  cached = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: config.appId,
      privateKey: config.appPrivateKey,
      installationId: config.installationId,
    },
  })
  return cached
}

/**
 * Test-only helper. Production code should not reset the client at runtime.
 */
export const __resetOctokitForTests = (): void => {
  cached = null
}
